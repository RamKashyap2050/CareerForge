const expressAsyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const ResumeBio = require("../models/ResumeBio");
const Resume = require("../models/Resume");
const ResumeSummary = require("../models/ResumeSummary");
const ResumeSkills = require("../models/ResumeSkill");
const ResumeExperience = require("../models/ResumeExperience");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ResumeEducation = require("../models/ResumeEducation");
const ResumeExtraSection = require("../models/ResumeExtraSection");
const GeneratedResumesJSON = require("../models/GeneratedResumeJSONSchema");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDraftUserSingleResume = expressAsyncHandler(async (req, res) => {
  const resumeId = req.params.resumeId;

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    // Fetch the resume without relying on associations
    const draftsingleresume = await Resume.findOne({
      where: { id: resumeId },
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

    // Manually fetch experiences related to this resume
    const resumeExperiences = await ResumeExperience.findAll({
      where: { ResumeId: resumeId },
    });

    // Manually fetch education related to this resume
    const resumeEducation = await ResumeEducation.findAll({
      where: { ResumeId: resumeId },
    });

    // Convert ResumeExperience and ResumeEducation instances to plain objects
    const plainExperiences = resumeExperiences.map((experience) =>
      experience.toJSON()
    );
    const plainEducation = resumeEducation.map((education) =>
      education.toJSON()
    );

    // Attach experiences and education manually to the response
    res.status(200).json({
      ...draftsingleresume.toJSON(),
      experiences: plainExperiences, // Use plain objects for experiences
      education: plainEducation, // Use plain objects for education
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getUserDraftResumes = expressAsyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const draftResumes = await Resume.findAll({
      where: {
        User: req.user.id,
        Status: "draft",
      },
      include: [
        { model: ResumeBio, as: "resumeBio" },
        { model: ResumeSummary, as: "resumeSummary" },
        { model: ResumeSkills, as: "resumeSkills" },
        { model: ResumeExperience, as: "resumeExperiences" },
        { model: ResumeEducation, as: "resumeEducations" },
        { model: ResumeExtraSection, as: "resumeExtraSection" },
      ],
    });
    res.status(200).json(draftResumes);
  } catch (error) {
    console.error("Error fetching user draft resumes:", error);
    res
      .status(500)
      .json({ message: "Error fetching user draft resumes", error });
  }
});

const updateResumeExperience = expressAsyncHandler(async (req, res) => {
  const { resumeId, experience } = req.body;
  console.log(resumeId, experience);
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    let resumeExperience;
    // Create a new experience
    const endDate = experience.endDate === "" ? null : experience.endDate;
    resumeExperience = await ResumeExperience.create({
      ResumeId: resumeId,
      User: req.user.id,
      CompanyName: experience.companyName,
      RoleTitle: experience.occupation,
      StartDate: experience.startDate,
      EndDate: endDate,
      ExperienceSummary: experience.summary,
    });

    res.status(201).json({
      message: "Experience created successfully",
      experienceId: resumeExperience.id,
    });
    // }
  } catch (error) {
    console.error("Error updating or creating experience:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create or update ResumeBio and Resume in a single request
const createOrUpdateResumeBio = expressAsyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const {
    resumeId,
    firstName,
    lastName,
    phoneNumber,
    email,
    linkedinProfile,
    githubLink,
    websiteLink,
    location,
  } = req.body;

  try {
    let resume;
    let resumeBio;

    if (resumeId) {
      resume = await Resume.findOne({
        where: { id: resumeId, User: req.user.id },
      });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      resumeBio = await ResumeBio.findOne({
        where: { id: resume.ResumeBio, User: req.user.id },
      });

      if (!resumeBio) {
        return res.status(404).json({ message: "Resume Bio not found" });
      }
      await resumeBio.update({
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: phoneNumber,
        GithubLink: githubLink,
        Email: email,
        LinkedInLink: linkedinProfile,
        WebsiteLink: websiteLink,
        Location: location,
      });

      res
        .status(200)
        .json({ message: "Resume bio updated successfully", resumeId });
    } else {
      resumeBio = await ResumeBio.create({
        User: req.user.id,
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: phoneNumber,
        GithubLink: githubLink,
        Email: email,
        LinkedInLink: linkedinProfile,
        WebsiteLink: websiteLink,
        Location: location,
      });

      resume = await Resume.create({
        User: req.user.id,
        ResumeBio: resumeBio.id,
        Status: "draft",
      });

      res.status(201).json({
        message: "Resume Bio and Resume created successfully",
        resumeId: resume.id,
        resumeBioId: resumeBio.id,
      });
    }
  } catch (error) {
    console.error("Error creating/updating resume bio or resume:", error);
    res
      .status(400)
      .json({ message: "Error creating/updating resume bio or resume", error });
  }
});

// Update or create the resume summary
const updateResumeSummary = expressAsyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    console.log("User ID not found");
    return res.status(400).json({ message: "User not authenticated" });
  }

  const { resumeId, summary } = req.body;
  console.log(resumeId, summary);
  try {
    let resume = await Resume.findOne({
      where: { id: resumeId, User: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    let resumeSummary;

    if (resume.ResumeSummary) {
      resumeSummary = await ResumeSummary.findOne({
        where: { id: resume.ResumeSummary },
      });
      await resumeSummary.update({
        Summary: summary, // Update the summary field
      });

      res.status(200).json({ message: "Resume summary updated successfully" });
    } else {
      resumeSummary = await ResumeSummary.create({
        User: req.user.id,
        Summary: summary,
      });

      await resume.update({
        ResumeSummary: resumeSummary.id,
      });

      res.status(201).json({
        message: "Resume summary created successfully",
        resumeSummaryId: resumeSummary.id,
      });
    }
  } catch (error) {
    console.error("Error updating resume summary:", error);
    res.status(400).json({ message: "Error updating resume summary", error });
  }
});

// Update or create resume skills
const updateResumeSkills = expressAsyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const { resumeId, skills } = req.body;
  console.log(resumeId, skills);

  try {
    let resume = await Resume.findOne({
      where: { id: resumeId, User: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    let resumeSkills;

    if (resume.ResumeSkills) {
      resumeSkills = await ResumeSkills.findOne({
        where: { id: resume.ResumeSkills },
      });
      await resumeSkills.update({
        Skills: skills.join(", "),
      });
      console.log(resumeSkills);

      res.status(200).json({ message: "Resume skills updated successfully" });
    } else {
      resumeSkills = await ResumeSkills.create({
        User: req.user.id,
        Skills: skills.join(", "),
      });

      await resume.update({
        ResumeSkills: resumeSkills.id,
      });

      res.status(201).json({
        message: "Resume skills created successfully",
        resumeSkillsId: resumeSkills.id,
      });
    }
  } catch (error) {
    console.error("Error updating resume skills:", error);
    res.status(400).json({ message: "Error updating resume skills", error });
  }
});

//Delete a Single Experience
const deleteresumeexperience = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await ResumeExperience.destroy({
      where: { id },
    });
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: "Failed to delete experience" });
  }
});

//Add Resume Education
const updateResumeEducation = expressAsyncHandler(async (req, res) => {
  const { resumeId, education } = req.body;
  console.log(resumeId, education);

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    let resumeEducation;
    const endDate = education.endDate === "" ? null : education.endDate;
    resumeEducation = await ResumeEducation.create({
      ResumeId: resumeId,
      User: req.user.id,
      InstitueName: education.instituteName,
      DegreeType: education.degreeType,
      StartDate: education.startDate,
      EndDate: endDate,
      EducationSummary: education.gradesAchievements,
    });
    res.status(201).json({
      message: "Education created successfully",
      educationId: resumeEducation.id,
    });
  } catch (error) {
    console.error("Error updating or creating education:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Swiftlet chats
const askswiftlet = expressAsyncHandler(async (req, res) => {
  const { prompt, jobDescription, resumeText } = req.body;
  console.log(prompt, jobDescription, resumeText);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let fullPrompt = "";

  // Switch based on the prompt received from the frontend
  if (prompt === "Why am I a good fit?") {
    fullPrompt = `
      You are tasked with evaluating a candidate's fit for the role of "${prompt}".
      Here is the job description:
      "${jobDescription}"

      Here is the candidate's resume:
      "${resumeText}"

      Based on both the job description and resume, provide a comparison and explain why the candidate is a strong fit for the position.
      Highlight key experiences, skills, and achievements from the resume that align with the job description, at the end give a rating out of 5 how much does candidate fit to job.
    `;
  } else if (prompt === "Create a cover letter") {
    fullPrompt = `
    You are tasked with writing a professional cover letter for a candidate applying to the role of "${jobDescription}".

    Here is the candidate's resume Resume:
    "${resumeText}". Extract the following details:

    - Full Name
    - Address
    - Phone Number
    - Email Address

    

    Use the following structure for the cover letter:
    1. Replace "[Candidate Full Name]" with the extracted full name.
    2. Replace "[Candidate Address]" with the extracted address.
    3. Replace "[Candidate Phone Number]" with the extracted phone number.
    4. Replace "[Candidate Email Address]" with the extracted email address.
    
    The cover letter should summarize the candidate's skills, experience, and qualifications based on the resume. Ensure that all placeholders are replaced with the correct information from the resume.
  `;
  } else if (prompt === "Suggest similar roles") {
    fullPrompt = `
      Based on the following resume, suggest job titles that would be suitable for the candidate's skills and experience:
      "${resumeText}"

      Provide only job titles for roles that match the candidate’s experience and skills.
    `;
  } else {
    return res.status(400).json({ message: "Unknown prompt" });
  }

  // Generate content from the model based on the constructed prompt
  try {
    const result = await model.generateContent(fullPrompt);
    const text = await result.response.text();
    console.log(text);

    // Send the generated text back as the response
    res.status(200).json({ message: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ message: "Error generating content", error: error.message });
  }
});

//Parsing and Creating Custom Resume
const parsenadcreatecustomresume = expressAsyncHandler(async (req, res) => {
  const { jobDescription, resumeText } = req.body;
  console.log(jobDescription, resumeText);
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Updated structured prompt
    const prompt = `
    I have provided a job description and a resume. You are a resume builder whose goal is to tailor resumes for job descriptions to pass through Applicant Tracking Systems (ATS).
    
    Your task is to modify the resume in the following ways based on the job description provided:
    
    1. **Updating the skills section**:
        - Cross-reference the skills in the resume with the skills in the job description.
        -Don't Remove any skills from resume as they are the Candidates hard earned skillset
        - Add job-specific skills from the job description that may not be present in the resume. For example, if the job description requires "GraphQL" and the resume mentions "REST API", either replace "REST API" with "GraphQL" or add "GraphQL" alongside "REST API" where appropriate, Same goes with Backend languages and Frameworks, ORM tools, Testing Frameworks, Frontend Frameworks and languages.
    
    2. **Updating the experience points**:
        - For every new skill added to the skills section (e.g., "GraphQL" or "AWS"), **add or modify experience points** in the experience section to explain where and how the candidate applied this skill in their previous roles. For example, if "GraphQL" is added, include an experience point under relevant roles that highlights how the candidate used GraphQL in backend development.
        - If there is no direct experience for a newly added skill, add inferred points based on the role responsibilities with the newly added skill.
        - Adjust existing experience points to make them more **impactful**, including specific accomplishments or metrics. For example, instead of “worked on Microservices,” modify it to “Developed and deployed Microservices using Node.js, reducing load times by 20%.”
        - Ensure that the experience duration aligns with the job description and keep the **start date and end date** intact.
        - Ensure the points has these verbs always "Acquired, Catered, Cut, Activated, Coached,Decreased, Adapted, Collaborated*,Delivered ,Adopted
Communicated,Designed,Advised,Completed, Developed, Advocated, Conceptualized, Directed, Allocated, Conducted, Doubled (Tripled, etc.), Analyzed*. Connected
Drafted, Assessed, Contributed, Drove*, Assisted, Converted, Earned, Authored, Coordinated*, Elevated, Automated, Corrected, Empowered
Engineered, Held, Lowered, Ensured*, Identified, Maintained. Evaluated
Implemented*
Managed*
Exceeded
Increased*
Mentored
Excelled
Initiated
Met
Expanded
Instituted
Migrated
Facilitated*
Intervened
Negotiated
Finalized
Introduced
Optimized
Furthered
Investigated
Outlined
Generated*
Launched
Oversaw

Led*
Owned*

Leveraged
Partnered

Liaised
198
Performed*" As they are action verbs which impress employers
    3. **Modifying the professional summary**:
        - Tailor the summary to reflect the **job-relevant skills** and expertise from the job description. Use keywords from the job description to make the summary more relevant to the specific position being applied for.
        - Do not mention specific company names or roles. Focus on general expertise, accomplishments, and the added skills.
    
    4. **Maintaining Bio Information**:
        - Ensure that the candidate’s **name, email, phone number, LinkedIn, GitHub, personal website, and location** remain unchanged, but include them in the final JSON output.
    
    5. **Updating the education section**:
        - Adjust the education points to reflect relevance to the candidate’s field of study. If the user has a "Bachelor’s in Computer Science," include points like GPA or relevant coursework to the job.
        - Keep the **institution name, degree type, and dates** intact, but add any relevant details that make the education section more aligned with the job description.
    
    Return the updated resume in the following structured JSON format:
    
    {
      "bio": {
        "firstName": "<First Name>",
        "lastName": "<Last Name>",
        "email": "<Email>",
        "phoneNumber": "<Phone Number>",
        "linkedin": "<LinkedIn URL>",
        "github": "<GitHub URL>",
        "website": "<Personal Website URL>",
        "location": "<Location>"
      },
      "summary": "<updated summary>",
      "skills": ["<list of updated skills>"],
      "experiences": [
        {
          "companyName": "<company name>",
          "roleTitle": "<role title>",
          "startDate": "<start date>",
          "endDate": "<end date>",
          "experienceDetails": ["<updated experience points that justify new skills>"]
        }
      ],
      "education": [
        {
          "institution": "<institution name>",
          "degreeType": "<degree type>",
          "startDate": "<start date>",
          "endDate": "<end date>",
          "educationDetails": ["<updated education points>"]
        }
      ]
    }
    
    Job Description: ${jobDescription}
    
    Resume Text: ${resumeText}
    `;

    // Generate structured output from Gemini model
    const result = await model.generateContent(prompt);

    // Parse the structured output
    const structuredOutput = result.response.text(); // Assuming response is JSON parsable

    // Send structured output to frontend
    res.status(200).json({
      success: true,
      data: structuredOutput,
    });
  } catch (error) {
    console.error("Error generating custom resume:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating resume" });
  }
});

const mockinterviews = expressAsyncHandler(async (req, res) => {
  const { jobTitle, selectedTools, interviewSettings } = req.body;

  console.log(jobTitle, selectedTools, interviewSettings);

  const { style, difficulty } = interviewSettings;

  if (!jobTitle || !selectedTools || !style || !difficulty) {
    return res.status(400).json({
      success: false,
      message: "Job title, selected tools, style, and difficulty are required.",
    });
  }

  const questionCount =
    difficulty === 1 ? 10 : difficulty === 2 ? 15 : difficulty === 3 ? 20 : 10;
  const difficultyDescription =
    difficulty === 1
      ? "easy"
      : difficulty === 2
      ? "moderate"
      : difficulty === 3
      ? "hard"
      : "easy";

  try {
    const prompt = `
    You are an AI designed to generate mock interview questions for technical roles in the ${style} round.
    Based on the following input, create ${questionCount} multiple-choice questions
    tailored for a ${difficultyDescription} level mock interview. Ensure all questions
    are multiple-choice with one correct answer each.

    Job Title: ${jobTitle}
    Selected Tools: ${selectedTools.join(", ")}
    Interview Style: ${style}

    Rules:
    1. Each question must align with the ${style} round expectations.
    2. Ensure all questions are relevant to the job title and selected tools.
    3. Provide four answer choices for each question, with one correct answer.
    4. Clearly mark the correct answer in the JSON response.

    Round-Specific Expectations:
    - If this is a Behavioral round, focus on situational and workplace-related scenarios.
    - If this is a Theoretical round, focus on fundamental concepts and technical principles.
    - If this is a Coding round, create algorithm or coding-related problems that require logical thinking.
    - If this is a Managerial round, focus on questions that assess leadership, decision-making, and handling challenges.
    - If this is a Stress round, make the questions slightly ambiguous or challenging to test composure.

    Return the output in the following JSON format:
    {
      "questions": [
        {
          "question": "<question text>",
          "options": ["<option 1>", "<option 2>", "<option 3>", "<option 4>"],
          "correctAnswer": "<correct answer>"
        }
      ]
    }
  `;

    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Replace with your preferred model
      messages: [{ role: "user", content: prompt }],
    });

    let generatedOutput = completion.choices[0].message.content;

    // Clean up response by removing Markdown formatting
    generatedOutput = generatedOutput.replace(/```json|```/g, "").trim();

    // Parse JSON
    const structuredOutput = JSON.parse(generatedOutput);

    res.status(200).json({
      success: true,
      data: structuredOutput,
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating mock interview questions.",
      error: error.message,
    });
  }
});




// GET all generated resumes for a user
const getUserGeneratedResumes = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;

  const resumes = await GeneratedResumesJSON.find({ sqlUserId: userId })
    .populate("jobId") // Includes job title, description, etc. from scraped jobs
    .sort({ createdAt: -1 }); // Latest first

  res.status(200).json({ success: true, data: resumes });
});



module.exports = {
  createOrUpdateResumeBio,
  updateResumeSummary,
  getUserDraftResumes,
  getDraftUserSingleResume,
  updateResumeSkills,
  updateResumeExperience,
  deleteresumeexperience,
  updateResumeEducation,
  askswiftlet,
  parsenadcreatecustomresume,
  mockinterviews,
  getUserGeneratedResumes,
};
