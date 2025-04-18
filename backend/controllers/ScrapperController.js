const expressAsyncHandler = require("express-async-handler");
const { scrapeIndeedJobs, scrapeJobDetailsFromUrl } = require("../scrappers/IndeedScrapper");
const { scrapeGlassdoorJobs, scrapeGlassdoorJobDetails } = require("../scrappers/GlassdoorScrapper");
const {scrapeLinkedInProfile} = require("../scrappers/LinkedinScraper")
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
    // const indeedJobs = await scrapeIndeedJobs(jobTitle, location);
    const glassdoorJobs = await scrapeGlassdoorJobs(jobTitle, location);
    console.log(glassdoorJobs)
    const allJobs = [ ...glassdoorJobs];
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

  if (!url || !jobSite) {
    return res.status(400).json({
      success: false,
      message: "Job URL and jobSite are required",
    });
  }

  try {
    let jobDetails = null;

    if (jobSite === "Indeed") {
      jobDetails = await scrapeJobDetailsFromUrl(url);
    } else if (jobSite === "Glassdoor") {
      jobDetails = await scrapeGlassdoorJobDetails(url);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid job site specified",
      });
    }

    if (!jobDetails) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve job details",
      });
    }

    return res.status(200).json({ success: true, data: jobDetails });
  } catch (error) {
    console.error("Error scraping job details:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error while scraping job details",
    });
  }
});


const scrapeLinkedInProfileFromUrl = expressAsyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "LinkedIn profile URL is required",
    });
  }

  try {
    const profileData = await scrapeLinkedInProfile(url);
    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error scraping LinkedIn profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to scrape LinkedIn profile",
    });
  }
});

module.exports = { getJobListings,getdetailsofjoblisting, scrapeLinkedInProfileFromUrl };
