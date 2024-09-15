const expressAsyncHandler = require("express-async-handler");
const ResumeBio = require("../models/ResumeBio");
const Resume = require("../models/Resume");
const ResumeSummary = require("../models/ResumeSummary");
// Create or update ResumeBio and Resume in a single request
const createOrUpdateResumeBio = expressAsyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const {
    resumeId, // Will be undefined for a new resume
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
    console.log("User ID not found")
    return res.status(400).json({ message: "User not authenticated" });
  }

  const { resumeId, summary } = req.body;
  console.log(resumeId, summary)
  try {
    // Check if the resume exists with the given resumeId and is associated with the authenticated user
    let resume = await Resume.findOne({
      where: { id: resumeId, User: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    let resumeSummary;

    // Check if a ResumeSummary already exists for this resume
    if (resume.ResumeSummary) {
      // If the resume already has a summary, update it
      resumeSummary = await ResumeSummary.findOne({
        where: { id: resume.ResumeSummary },
      });
      await resumeSummary.update({
        Summary: summary, // Update the summary field
      });

      res.status(200).json({ message: "Resume summary updated successfully" });
    } else {
      // If no summary exists, create a new one
      resumeSummary = await ResumeSummary.create({
        User: req.user.id,
        Summary: summary, // Create a new summary
      });

      // Update the Resume to link it to the newly created ResumeSummary
      await resume.update({
        ResumeSummary: resumeSummary.id,
      });

      res
        .status(201)
        .json({
          message: "Resume summary created successfully",
          resumeSummaryId: resumeSummary.id,
        });
    }
  } catch (error) {
    console.error("Error updating resume summary:", error);
    res.status(400).json({ message: "Error updating resume summary", error });
  }
});

module.exports = { createOrUpdateResumeBio, updateResumeSummary };
