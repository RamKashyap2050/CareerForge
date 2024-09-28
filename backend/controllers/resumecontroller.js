const expressAsyncHandler = require("express-async-handler");
const ResumeBio = require("../models/ResumeBio");
const Resume = require("../models/Resume");
const ResumeSummary = require("../models/ResumeSummary");
const ResumeSkills = require("../models/ResumeSkill");
const ResumeExperience = require("../models/ResumeExperience");
const ResumeEducation = require("../models/ResumeEducation");
const ResumeExtraSection = require("../models/ResumeExtraSection");
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
        { model: ResumeExperience, as: "resumeExperience" },
        { model: ResumeEducation, as: "resumeEducation" },
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

module.exports = {
  createOrUpdateResumeBio,
  updateResumeSummary,
  getUserDraftResumes,
  getDraftUserSingleResume,
  updateResumeSkills,
  updateResumeExperience,
  deleteresumeexperience,
  updateResumeEducation,
};
