const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const path = require("path");
const {
  scrapeGlassdoorJobs,
  scrapeGlassdoorJobDetails,
} = require("../scrappers/GlassdoorScrapper");
const OpenAI = require("openai");
const ResumeBio = require("../models/ResumeBio");
const Resume = require("../models/Resume");
const ResumeSummary = require("../models/ResumeSummary");
const ResumeSkills = require("../models/ResumeSkill");
const ResumeExperience = require("../models/ResumeExperience");
const ResumeEducation = require("../models/ResumeEducation");
const ResumeExtraSection = require("../models/ResumeExtraSection");
const UserMongo = require("../models/MongoUser");
const axios = require("axios");
const FetchedJobUrls = require("../models/MongoFetchedUrls"); // Import your model
const MongoScrapedDetails = require("../models/MongoScrapedDetails"); // Import your model
const { generateCustomResume } = require("../utlis/genaiResumeBuilder"); // path depends on your project
const GeneratedResumesJSON = require("../models/GeneratedResumeJSONSchema");
const generatePDFBuffer = require("../utlis/generatePDFBuffer");
const { uploadImageToS3 } = require("../s3/s3");
const S3Blobs = require("../models/S3BlobSchema");

// 🧠 Utility: Manual login to Glassdoor and save cookies in MongoDB
const loginAndSaveCookiesToMongo = async (sqlUserId) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.glassdoor.ca/profile/login_input.htm", {
    waitUntil: "networkidle2",
  });

  console.log("🔐 Please login manually to Glassdoor in the opened browser.");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const cookies = await page.cookies();

  await UserMongo.updateOne(
    { sqlUserId },
    { glassdoorCookies: cookies },
    { upsert: false }
  );

  await browser.close();
  console.log("✅ Glassdoor cookies saved to MongoDB.");
};

// 🧠 Load cookies from Mongo and set in Puppeteer
const loadGlassdoorCookies = async (page, mongoUser) => {
  if (mongoUser.glassdoorCookies && mongoUser.glassdoorCookies.length > 0) {
    await page.setCookie(...mongoUser.glassdoorCookies);
  } else {
    throw new Error("No Glassdoor cookies found. Please login first.");
  }
};

// 🧠 Puppeteer job auto-apply logic with cookies
const autoApplyToJob = async (jobUrl, resumeJSON, mongoUser) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await loadGlassdoorCookies(page, mongoUser);
    await page.goto(jobUrl, { waitUntil: "networkidle2", timeout: 60000 });

    if (page.url().includes("/login")) {
      throw new Error("❌ Session expired or not logged in.");
    }

    await page.type(
      'input[name="full_name"]',
      `${resumeJSON.bio.firstName} ${resumeJSON.bio.lastName}`
    );
    await page.type('input[name="email"]', resumeJSON.bio.email);
    await page.type('textarea[name="summary"]', resumeJSON.summary);
    await page.type('textarea[name="skills"]', resumeJSON.skills.join(", "));

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await browser.close();
    return true;
  } catch (err) {
    console.error("❌ Puppeteer apply error:", err.message);
    return false;
  }
};

const getATSSimilarityScore = async (jobDescription, resumeJSON) => {
  const prompt = `
You're an ATS scoring assistant.

Given a job description and a resume (structured as JSON), return a number between 0 and 100 that reflects how well the resume matches the job.

Only return the number. No explanation. No symbols.

### JOB DESCRIPTION:
${jobDescription}

### RESUME:
${JSON.stringify(resumeJSON)}
`;

  try {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    let response = completion.choices?.[0]?.message?.content || "";
    const score = parseInt(response.match(/\d+/)?.[0]) || 0;

    return Math.min(score, 100);
  } catch (err) {
    console.error("❌ GPT ATS Score Error:", err.message);
    return null;
  }
};

const runAutoApplyNow = async (req, res) => {
  try {
    const sqlUserId = req.user.id;
    const mongoUser = await UserMongo.findOne({ sqlUserId });
    console.log(sqlUserId, mongoUser);
    if (!mongoUser) {
      return res.status(404).json({ message: "Mongo user profile not found" });
    }

    // 🧠 If no Glassdoor cookies, login first
    if (
      !mongoUser.glassdoorCookies ||
      mongoUser.glassdoorCookies.length === 0
    ) {
      console.log(
        "🟡 No saved Glassdoor cookies found. Starting manual login..."
      );
      await loginAndSaveCookiesToMongo(sqlUserId);
      return res
        .status(200)
        .json({ message: "Login complete. Rerun auto-apply now." });
    }

    const { defaultResumeId, jobPreferences } = mongoUser;
    const { role, location } = jobPreferences;

    if (!defaultResumeId) {
      return res.status(400).json({ message: "Missing default resume ID." });
    }

    const jobs = await scrapeGlassdoorJobs(
      role || "Software Developer",
      location || "Remote"
    );
    await FetchedJobUrls.create({
      sqlUserId: sqlUserId,
      fetchedUrls: jobs,
      desiredRole: role,
      location: location,
    });

    console.log(jobs);
    const draftsingleresume = await Resume.findOne({
      where: { id: defaultResumeId },
      include: [
        { model: ResumeBio, as: "resumeBio" },
        { model: ResumeSummary, as: "resumeSummary" },
        { model: ResumeSkills, as: "resumeSkills" },
        { model: ResumeExtraSection, as: "resumeExtraSection" },
      ],
    });

    if (!draftsingleresume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeExperiences = await ResumeExperience.findAll({
      where: { ResumeId: defaultResumeId },
    });
    const resumeEducation = await ResumeEducation.findAll({
      where: { ResumeId: defaultResumeId },
    });

    const fullResume = {
      ...draftsingleresume.toJSON(),
      experiences: resumeExperiences.map((e) => e.toJSON()),
      education: resumeEducation.map((e) => e.toJSON()),
    };

    const successful = [];

    for (let i = 0; i < Math.min(20, jobs.length); i++) {
      const job = jobs[i];

      const details = await scrapeGlassdoorJobDetails(job);
      if (details) {
        try {
          await MongoScrapedDetails.create({
            sqlUserId: req.user.id,
            url: job,
            jobTitle: details.jobTitle,
            company: details.company,
            jobDescription: details.jobDescription,
            pay: details.pay,
            benefits: details.benefits,
            location: details.location,
          });
          console.log("✅ Scraped job saved successfully!");
        } catch (err) {
          console.error("❌ Failed to save scraped job details:", err.message);
        }
      }

      if (
        !details ||
        !details.jobDescription ||
        details.jobDescription === "Not available"
      )
        continue;

      console.log(
        details.jobDescription,
        fullResume,
        JSON.stringify(fullResume)
      );
      const tailoredResume = await generateCustomResume(
        details.jobDescription,
        JSON.stringify(fullResume)
      );
      console.log(
        "This is Job Url",
        job,
        "This is Generated Resume",
        tailoredResume
      );
      try {
        const scrapedJobDoc = await MongoScrapedDetails.findOne({ url: job });

        if (!scrapedJobDoc) {
          console.warn(
            `⚠️ Skipping resume save — job not found for URL: ${job}`
          );
          continue;
        }
        // 🔥 Calculate ATS Score in-line using Gemini
        const atsScore = await getATSSimilarityScore(
          details.jobDescription,
          tailoredResume
        );
        await GeneratedResumesJSON.create({
          sqlUserId: req.user.id,
          jobId: scrapedJobDoc._id,
          sourceJobUrl: job,
          resumeJSON: tailoredResume,
          atsScore, // this will match your schema field
        });

        console.log("🧠 Tailored resume saved to GeneratedResumesJSON ✅");

        const pdfBuffer = await generatePDFBuffer(tailoredResume);
        const fileName = `${tailoredResume.bio.firstName.replace(/\s+/g, "")}_${Date.now()}.pdf`;
        const fileToUpload = {
          name: fileName,
          data: pdfBuffer,
          mimetype: "application/pdf",
        };
        const s3Url = await uploadImageToS3(fileToUpload);

        await S3Blobs.create({
          sqlUserId: req.user.id,
          jobId: scrapedJobDoc._id,
          sourceJobUrl: job,
          resumePdfUrl: s3Url,
          resumeFormat: "Default-GenAI-V1", // useful for multi-format in future
        });
      } catch (saveErr) {
        console.error(
          "❌ Failed to save tailored GenAI resume:",
          saveErr.message
        );
      }
      if (!tailoredResume) continue;

      // const applied = await autoApplyToJob(job.url, tailoredResume, mongoUser);

      // successful.push({
      //   jobTitle: job.title,
      //   company: job.company,
      //   url: job.url,
      //   status: applied ? "Applied" : "Failed",
      // });
    }

    return res.json({ success: true, appliedJobs: successful });
  } catch (err) {
    console.error("❌ Auto-apply error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { runAutoApplyNow };
