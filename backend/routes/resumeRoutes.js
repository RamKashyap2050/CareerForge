const express = require("express");
const { createOrUpdateResumeBio, updateResumeSummary } = require("../controllers/resumecontroller");
const { isAuthenticated } = require("../controllers/usercontroller");
const router = express.Router();

router.route("/resume-bio").put(isAuthenticated, createOrUpdateResumeBio);
router.route("/resume-summary").put(isAuthenticated, updateResumeSummary)
module.exports = router;
