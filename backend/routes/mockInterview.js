const express = require("express");
const router = express.Router();

const {loadMoreTitles, getToolInsights} = require("../controllers/MockInterviewController")

router.route("/loadMoreTitles").post(loadMoreTitles);
router.route("/getinsights").post(getToolInsights)

module.exports = router


