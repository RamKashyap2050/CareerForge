const expressAsyncHandler = require("express-async-handler");
const { scrapeIndeedJobs } = require("../scrappers/IndeedScrapper");
const { scrapeGlassdoorJobs } = require("../scrappers/GlassdoorScrapper");

// Controller function for handling job scraping requests
const getJobListings = expressAsyncHandler(async (req, res) => {
  try {
    const {
      jobTitle = "software engineer", // Provide default values if missing
      location = "Remote",
      jobType,
      experience,
      salaryRange,
      datePosted,
      remote,
      skills,
    } = req.body;
    console.log(
      jobTitle,
      location,
      jobType,
      experience,
      salaryRange,
      datePosted,
      remote,
      skills
    );
    const indeedJobs = await scrapeIndeedJobs(jobTitle, location);
    const glassdoorJobs = await scrapeGlassdoorJobs(jobTitle, location);

    // Combine and return the job listings
    const allJobs = [...indeedJobs, ...glassdoorJobs];
    console.log(allJobs);
    // Respond with the scraped job listings
    res.status(200).json({ success: true, data: allJobs });
  } catch (error) {
    console.error("Error scraping job listings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch job listings" });
  }
});

module.exports = { getJobListings };
