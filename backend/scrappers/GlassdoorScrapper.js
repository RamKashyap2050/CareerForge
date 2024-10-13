const puppeteer = require("puppeteer");

async function scrapeGlassdoorJobs(searchQuery, location = "Remote") {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const searchURL = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(searchQuery)}&locT=C&locId=&locKeyword=${encodeURIComponent(location)}`;
  await page.goto(searchURL, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    const jobElements = document.querySelectorAll(".react-job-listing");
    let jobListings = [];

    jobElements.forEach((job) => {
      const title = job.querySelector(".jobLink")?.innerText || "No title";
      const company = job.querySelector(".jobEmpolyerName")?.innerText || "No company name";
      const location = job.querySelector(".jobLocation")?.innerText || "No location";
      const url = job.querySelector(".jobLink")?.href || "No URL";

      jobListings.push({ title, company, location, url });
    });

    return jobListings;
  });

  console.log(jobs); // Display the scraped jobs

  await browser.close();
  return jobs;
}

module.exports = {
  scrapeGlassdoorJobs,
};
