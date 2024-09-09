const express = require("express");
const { createResumeBio } = require("../controllers/resumecontroller");

const router = express.Router();

router.route("/resume-bio").post(createResumeBio);

module.exports = router;
