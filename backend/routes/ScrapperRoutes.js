const express = require("express");
const { getJobListings, getdetailsofjoblisting } = require("../controllers/ScrapperController");
const router = express.Router();

router.route("/scrape-jobs").post(getJobListings)
router.route("/jobDetails").get(getdetailsofjoblisting)
module.exports = router;
