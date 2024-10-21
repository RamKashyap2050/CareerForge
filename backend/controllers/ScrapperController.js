const expressAsyncHandler = require("express-async-handler");
const { scrapeIndeedJobs, scrapeJobDetailsFromUrl } = require("../scrappers/IndeedScrapper");
const { scrapeGlassdoorJobs, scrapeGlassdoorJobDetails } = require("../scrappers/GlassdoorScrapper");

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
    console.log(glassdoorJobs)
    // Combine and return the job listings
    const allJobs = [...indeedJobs, ...glassdoorJobs];
    // Respond with the scraped job listings
    res.status(200).json({ success: true, data: allJobs });
  } catch (error) {
    console.error("Error scraping job listings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch job listings" });
  }
});

const getdetailsofjoblisting = expressAsyncHandler(async (req, res) => {
  const { url, jobSite } = req.query;

  // Check if URL and jobSite are provided
  if (!url || !jobSite) {
    return res.status(400).json({ success: false, message: "Job URL and jobSite are required" });
  }

  try {
    let jobDetails;

    // Scrape job details based on jobSite
    if (jobSite === "Indeed") {
      jobDetails = await scrapeJobDetailsFromUrl(url); // Assuming scrapeJobDetailsFromUrl is for Indeed
    } else if (jobSite === "Glassdoor") {
      jobDetails = await scrapeGlassdoorJobDetails(url); // For Glassdoor
    } else {
      return res.status(400).json({ success: false, message: "Invalid job site" });
    }

    // Return the scraped job details
    return res.status(200).json({ success: true, data: jobDetails });
  } catch (error) {
    console.error("Error scraping job details:", error);
    return res.status(500).json({ success: false, message: "Failed to scrape job details" });
  }
});


module.exports = { getJobListings,getdetailsofjoblisting };
