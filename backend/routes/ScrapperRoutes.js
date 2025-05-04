const express = require("express");
const {
  getJobListings,
  getdetailsofjoblisting,
  scrapeLinkedInProfileFromUrl,
} = require("../controllers/ScrapperController");
const { runAutoApplyNow } = require("../controllers/AutoApplyController");
const router = express.Router();

router.route("/scrape-jobs").post(getJobListings);
router.route("/jobDetails").get(getdetailsofjoblisting);
router.route("/ScrapeProfile").post(scrapeLinkedInProfileFromUrl);
router.route("/auto-apply").post(runAutoApplyNow);
module.exports = router;
