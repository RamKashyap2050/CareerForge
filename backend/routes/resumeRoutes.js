const express = require("express");
const {
  createOrUpdateResumeBio,
  updateResumeSummary,
  getUserDraftResumes,
  getDraftUserSingleResume,
  updateResumeSkills,
} = require("../controllers/resumecontroller");
const { isAuthenticated } = require("../controllers/usercontroller");
const router = express.Router();

router.route("/resume-bio").put(isAuthenticated, createOrUpdateResumeBio);
router.route("/resume-summary").put(isAuthenticated, updateResumeSummary);
router.route("/resumes").get(isAuthenticated, getUserDraftResumes);
router.route("/resume-skills").put(isAuthenticated, updateResumeSkills )
router
  .route("/resumes/:resumeId")
  .get(isAuthenticated, getDraftUserSingleResume);
module.exports = router;
