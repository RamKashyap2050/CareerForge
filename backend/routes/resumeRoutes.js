const express = require("express");
const {
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
} = require("../controllers/resumecontroller");
const { isAuthenticated } = require("../controllers/usercontroller");
const router = express.Router();

router.route("/resume-bio").put(isAuthenticated, createOrUpdateResumeBio);
router.route("/resume-summary").put(isAuthenticated, updateResumeSummary);
router.route("/resumes").get(isAuthenticated, getUserDraftResumes);
router.route("/resume-skills").put(isAuthenticated, updateResumeSkills);
router.route("/resume-experience").put(isAuthenticated, updateResumeExperience);
router
  .route("/deleteresumeexperience/:id")
  .delete(deleteresumeexperience, isAuthenticated);
router.route("/resumes/:resumeId").get(getDraftUserSingleResume);
router.route("/resume-education").put(isAuthenticated, updateResumeEducation);
router.route("/chats").post(askswiftlet)
router.route("/parseresume").post(parsenadcreatecustomresume)
module.exports = router;
