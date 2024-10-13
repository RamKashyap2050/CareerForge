const express = require("express");
const { getJobListings } = require("../controllers/ScrapperController");
const router = express.Router();

router.route("/scrape-jobs").post(getJobListings)

module.exports = router;
