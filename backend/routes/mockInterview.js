const express = require("express");
const router = express.Router();

const {loadMoreTitles, getToolInsights, CodeSandbox} = require("../controllers/MockInterviewController")

router.route("/loadMoreTitles").post(loadMoreTitles);
router.route("/getinsights").post(getToolInsights)
router.route("/execute").post(CodeSandbox)

module.exports = router


