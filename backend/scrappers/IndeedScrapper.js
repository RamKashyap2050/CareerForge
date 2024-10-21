const puppeteer = require("puppeteer");

// Scraping jobs with pagination and saving to DB structure
async function scrapeIndeedJobs(
  searchQuery,
  location = "Remote",
  pagesToScrape = 2
) {
  const browser = await puppeteer.launch({ headless: false }); // Debugging
  const page = await browser.newPage();

  // Set User-Agent to avoid detection by Indeed's bot filtering
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );

  let jobs = [];

  for (let pageNum = 0; pageNum < pagesToScrape; pageNum++) {
    const searchURL = `https://ca.indeed.com/jobs?q=${encodeURIComponent(
      searchQuery
    )}&l=${encodeURIComponent(location)}&start=${pageNum * 10}`;

    console.log(`Navigating to: ${searchURL}`);
    try {
      await page.goto(searchURL, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForSelector("#mosaic-provider-jobcards .job_seen_beacon", {
        timeout: 10000,
      });

      // Extract job details from the current page
      const jobsOnPage = await page.evaluate(() => {
        const jobElements = document.querySelectorAll(
          "#mosaic-provider-jobcards .job_seen_beacon"
        );

        let jobListings = [];

        jobElements.forEach((job) => {
          const titleElement = job.querySelector("h2.jobTitle span");
          const companyElement = job.querySelector(
            "span[data-testid='company-name']"
          );
          const locationElement = job.querySelector(
            "[data-testid='text-location']"
          );
          const urlElement = job.querySelector("h2.jobTitle a");

          const title = titleElement
            ? titleElement.innerText.trim()
            : "No title";
          const company = companyElement
            ? companyElement.innerText.trim()
            : "No company name";
          const location = locationElement
            ? locationElement.innerText.trim()
            : "No location";
          const url = urlElement
            ? `https://ca.indeed.com${urlElement.getAttribute("href")}`
            : "No URL";

          jobListings.push({
            title,
            company,
            location,
            url,
            jobSite: "Indeed", // Adding the job site
          });
        });

        return jobListings;
      });

      if (jobsOnPage.length === 0) {
        console.warn("No jobs found on this page. Check selectors.");
      } else {
        console.log(`Jobs found on page ${pageNum + 1}:`, jobsOnPage);
      }

      jobs = [...jobs, ...jobsOnPage]; // Merge results
    } catch (error) {
      console.error(`Error scraping ${searchURL}: ${error.message}`);
    }
  }

  console.log(`Total jobs scraped: ${jobs.length}`);
  await browser.close();
  return jobs;
}

// Function to scrape detailed job info from a URL
async function scrapeJobDetailsFromUrl(jobUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a User-Agent to avoid being blocked
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );

  // Go to the job URL
  await page.goto(jobUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Scrape the detailed information from the page
  const jobDetails = await page.evaluate(() => {
    // Job Description
    const jobDescriptionElement = document.querySelector("#jobDescriptionText");
    const jobDescription = jobDescriptionElement
      ? jobDescriptionElement.innerText.trim()
      : "No job description available.";

    // Skills
    const skillsElement = document.querySelector("[aria-label='Skills'] h3");
    const skills = skillsElement
      ? skillsElement.innerText.trim()
      : "No skills information.";

    // Pay information
    const payElement = document.querySelector("[aria-label='Pay'] ul li");
    const pay = payElement
      ? payElement.innerText.trim()
      : "No salary information.";

    // Benefits
    const benefitsElement = document.querySelector("#benefits ul");
    const benefits = benefitsElement
      ? Array.from(benefitsElement.querySelectorAll("li")).map((li) =>
          li.innerText.trim()
        )
      : "No benefits information.";

    // Job Type
    const jobTypeElement = document.querySelector(
      "[aria-label='Job type'] ul li"
    );
    const jobType = jobTypeElement
      ? jobTypeElement.innerText.trim()
      : "No job type information.";

    // Location
    const locationElement = document.querySelector("#jobLocationText div");
    const location = locationElement
      ? locationElement.innerText.trim()
      : "No location provided.";

    // Return the scraped data
    return {
      jobDescription,
      skills,
      pay,
      benefits,
      jobType,
      location,
    };
  });

  // Close the browser
  await browser.close();

  // Return the scraped job details
  return jobDetails;
}

// Exporting function for reuse in other modules
module.exports = { scrapeIndeedJobs, scrapeJobDetailsFromUrl };
