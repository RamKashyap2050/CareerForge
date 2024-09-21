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
router.route("/resume-summary").put(updateResumeSummary);
router.route("/resumes").get(getUserDraftResumes);
router.route("/resume-skills").put(updateResumeSkills);
router
  .route("/resumes/:resumeId")
  .get( getDraftUserSingleResume);
module.exports = router;
