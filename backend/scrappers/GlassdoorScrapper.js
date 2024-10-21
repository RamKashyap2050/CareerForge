const puppeteer = require("puppeteer");

async function scrapeGlassdoorJobs(
  searchQuery,
  location = "Remote",
  pagesToScrape = 2
) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );

  let jobs = [];

  for (let pageNum = 0; pageNum < pagesToScrape; pageNum++) {
    const searchURL = `https://www.glassdoor.ca/Job/jobs.htm?sc.keyword=${encodeURIComponent(
      searchQuery
    )}&locT=C&locId=&locKeyword=${encodeURIComponent(
      location
    )}&jobType=&fromAge=-1&radius=0&minSalary=0&includeNoSalaryJobs=true&sortBy=date_desc&start=${
      pageNum * 10
    }`;

    console.log(`Navigating to: ${searchURL}`);
    try {
      await page.goto(searchURL, {
        waitUntil: "networkidle2", // Wait until all network activity is done
        timeout: 60000,
      });

      // Updated selector based on the HTML structure you provided
      await page.waitForSelector("li[data-test='jobListing']", {
        timeout: 20000,
      });

      const jobsOnPage = await page.evaluate(() => {
        const jobElements = document.querySelectorAll(
          "li[data-test='jobListing']"
        );

        let jobListings = [];

        jobElements.forEach((job) => {
          const titleElement = job.querySelector("a[data-test='job-title']");
          const companyElement = job.querySelector(
            ".EmployerProfile_compactEmployerName__LE242"
          );
          const locationElement = job.querySelector(
            "div[data-test='emp-location']"
          );
          const salaryElement = job.querySelector(
            "div[data-test='detailSalary']"
          );
          const urlElement = job.querySelector("a[data-test='job-title']");

          const title = titleElement
            ? titleElement.innerText.trim()
            : "No title";
          const company = companyElement
            ? companyElement.innerText.trim()
            : "No company name";
          const location = locationElement
            ? locationElement.innerText.trim()
            : "No location";
          const salary = salaryElement
            ? salaryElement.innerText.trim()
            : "No salary info";
          const url = urlElement ? urlElement.href : "No URL";

          jobListings.push({
            title,
            company,
            location,
            salary,
            url,
            jobSite: "Glassdoor", // Adding the job site for later use
          });
        });

        return jobListings;
      });

      jobs = [...jobs, ...jobsOnPage];
    } catch (error) {
      console.error(`Error scraping ${searchURL}: ${error.message}`);
    }
  }

  console.log(`Total jobs scraped: ${jobs.length}`);
  await browser.close();
  return jobs;
}

// Function to scrape detailed job info from a Glassdoor URL
async function scrapeGlassdoorJobDetails(jobUrl) {
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
    // Job Title
    const jobTitleElement = document.querySelector("h1.heading_Level1__soLZs");
    const jobTitle = jobTitleElement
      ? jobTitleElement.innerText.trim()
      : "No job title available.";

    // Company Name
    const companyElement = document.querySelector("h4.heading_Subhead__Ip1aW");
    const company = companyElement
      ? companyElement.innerText.trim()
      : "No company name available.";

    // Job Description
    const jobDescriptionElement = document.querySelector(
      ".JobDetails_jobDescription__uW_fK"
    );
    const jobDescription = jobDescriptionElement
      ? jobDescriptionElement.innerText.trim()
      : "No job description available.";

    // Pay / Salary Information
    const payElement = document.querySelector(
      ".SalaryEstimate_salaryRange__brHFy"
    );
    const pay = payElement
      ? payElement.innerText.trim()
      : "No salary information available.";

    // Benefits Information (you can tweak this selector based on how benefits are shown)
    const benefitsElement = document.querySelector(
      ".SalaryEstimate_salaryDisclosure__wmX4V"
    );
    const benefits = benefitsElement
      ? benefitsElement.innerText.trim()
      : "No benefits information available.";

    // Location
    const locationElement = document.querySelector(
      ".JobDetails_location__mSg5h"
    );
    const location = locationElement
      ? locationElement.innerText.trim()
      : "No location provided.";

    // Return the scraped data
    return {
      jobTitle,
      company,
      jobDescription,
      pay,
      benefits,
      location,
    };
  });

  // Close the browser
  await browser.close();

  // Return the scraped job details
  return jobDetails;
}


module.exports = { scrapeGlassdoorJobs, scrapeGlassdoorJobDetails };
