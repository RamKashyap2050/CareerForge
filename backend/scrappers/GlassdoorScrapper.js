const chromium =
  process.env.NODE_ENV === "production" ? require("@sparticuz/chromium") : null;
const puppeteer =
  process.env.NODE_ENV === "production"
    ? require("puppeteer-core")
    : require("puppeteer");

async function scrapeGlassdoorJobs(
  searchQuery,
  location = "Remote",
  pagesToScrape = 2
) {
  const isProduction = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch({
    args: isProduction ? chromium.args : [],
    defaultViewport: chromium ? chromium.defaultViewport : null,
    executablePath: isProduction ? await chromium.executablePath : undefined, // Use default executable in development
    headless: isProduction ? chromium.headless : false, // Use non-headless in dev for debugging
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-extensions']
  });

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
        waitUntil: "networkidle2",
        timeout: 60000,
      });

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
            jobSite: "Glassdoor",
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

async function scrapeGlassdoorJobDetails(jobUrl) {
  const isProduction = process.env.NODE_ENV === "production";
  console.log(jobUrl);
  const browser = await puppeteer.launch({
    args: isProduction ? chromium.args : [],
    executablePath: isProduction ? await chromium.executablePath : undefined,
    headless: isProduction ? chromium.headless : true, // Headless by default for local
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );

  await page.goto(jobUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  const jobDetails = await page.evaluate(() => {
    const jobTitleElement = document.querySelector("h1.heading_Level1__soLZs");
    const jobTitle = jobTitleElement
      ? jobTitleElement.innerText.trim()
      : "No job title available.";

    const companyElement = document.querySelector("h4.heading_Subhead__Ip1aW");
    const company = companyElement
      ? companyElement.innerText.trim()
      : "No company name available.";

    const jobDescriptionElement = document.querySelector(
      ".JobDetails_jobDescription__uW_fK"
    );
    const jobDescription = jobDescriptionElement
      ? jobDescriptionElement.innerText.trim()
      : "No job description available.";

    const payElement = document.querySelector(
      ".SalaryEstimate_salaryRange__brHFy"
    );
    const pay = payElement
      ? payElement.innerText.trim()
      : "No salary information available.";

    const benefitsElement = document.querySelector(
      ".SalaryEstimate_salaryDisclosure__wmX4V"
    );
    const benefits = benefitsElement
      ? benefitsElement.innerText.trim()
      : "No benefits information available.";

    const locationElement = document.querySelector(
      ".JobDetails_location__mSg5h"
    );
    const location = locationElement
      ? locationElement.innerText.trim()
      : "No location provided.";

    return {
      jobTitle,
      company,
      jobDescription,
      pay,
      benefits,
      location,
    };
  });

  await browser.close();
  return jobDetails;
}

module.exports = { scrapeGlassdoorJobs, scrapeGlassdoorJobDetails };
