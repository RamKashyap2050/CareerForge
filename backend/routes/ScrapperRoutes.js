const express = require("express");
const {
  getJobListings,
  getdetailsofjoblisting,
  scrapeLinkedInProfileFromUrl
} = require("../controllers/ScrapperController");
const router = express.Router();

router.route("/scrape-jobs").post(getJobListings);
router.route("/jobDetails").get(getdetailsofjoblisting);
router.route("/ScrapeProfile").post(scrapeLinkedInProfileFromUrl);
module.exports = router;
