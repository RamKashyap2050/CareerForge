// Conditionally load `puppeteer-core` and `@sparticuz/chromium` in production
const isProduction = process.env.NODE_ENV === "production";

// Use `puppeteer-extra` as the main library, which can use `puppeteer-core` in production
const puppeteer = require("puppeteer-extra");

// Use `puppeteer-core` and `@sparticuz/chromium` only in production
let chromium;
if (isProduction) {
  puppeteer.use(require("puppeteer-extra-plugin-stealth")());
  chromium = require("@sparticuz/chromium");
}

async function scrapeIndeedJobs(searchQuery, location = "Remote", pagesToScrape = 1) {
  // Set up Puppeteer launch configuration
  const browser = await puppeteer.launch({
    args: isProduction ? chromium.args : [],
    executablePath: isProduction ? await chromium.executablePath : undefined, // Only use executablePath in production
    headless: isProduction ? chromium.headless : false, // Headless in production only
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );

  let jobs = [];

  for (let pageNum = 0; pageNum < pagesToScrape; pageNum++) {
    const searchURL = `https://ca.indeed.com/jobs?q=${encodeURIComponent(searchQuery)}&l=${encodeURIComponent(location)}&start=${pageNum * 10}`;
    console.log(`Navigating to: ${searchURL}`);
    
    try {
      await page.goto(searchURL, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector("#mosaic-provider-jobcards .job_seen_beacon", { timeout: 60000 });

      const jobsOnPage = await page.evaluate(() => {
        const jobElements = document.querySelectorAll("#mosaic-provider-jobcards .job_seen_beacon");
        let jobListings = [];

        jobElements.forEach((job) => {
          const titleElement = job.querySelector("h2.jobTitle span");
          const companyElement = job.querySelector("span[data-testid='company-name']");
          const locationElement = job.querySelector("[data-testid='text-location']");
          const urlElement = job.querySelector("h2.jobTitle a");

          const title = titleElement ? titleElement.innerText.trim() : "No title";
          const company = companyElement ? companyElement.innerText.trim() : "No company name";
          const location = locationElement ? locationElement.innerText.trim() : "No location";
          const url = urlElement ? `https://ca.indeed.com${urlElement.getAttribute("href")}` : "No URL";

          jobListings.push({ title, company, location, url, jobSite: "Indeed" });
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

async function scrapeJobDetailsFromUrl(jobUrl) {
  const browser = await puppeteer.launch({
    args: isProduction ? chromium.args : [],
    executablePath: isProduction ? await chromium.executablePath : undefined,
    headless: isProduction ? chromium.headless : true,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );

  await page.goto(jobUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  const jobDetails = await page.evaluate(() => {
    const jobDescriptionElement = document.querySelector("#jobDescriptionText");
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText.trim() : "No job description available.";

    const skillsElement = document.querySelector("[aria-label='Skills'] h3");
    const skills = skillsElement ? skillsElement.innerText.trim() : "No skills information.";

    const payElement = document.querySelector("[aria-label='Pay'] ul li");
    const pay = payElement ? payElement.innerText.trim() : "No salary information.";

    const benefitsElement = document.querySelector("#benefits ul");
    const benefits = benefitsElement ? Array.from(benefitsElement.querySelectorAll("li")).map((li) => li.innerText.trim()) : "No benefits information.";

    const jobTypeElement = document.querySelector("[aria-label='Job type'] ul li");
    const jobType = jobTypeElement ? jobTypeElement.innerText.trim() : "No job type information.";

    const locationElement = document.querySelector("#jobLocationText div");
    const location = locationElement ? locationElement.innerText.trim() : "No location provided.";

    return { jobDescription, skills, pay, benefits, jobType, location };
  });

  await browser.close();
  return jobDetails;
}

module.exports = { scrapeIndeedJobs, scrapeJobDetailsFromUrl };
