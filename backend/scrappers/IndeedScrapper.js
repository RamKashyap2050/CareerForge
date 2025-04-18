const isProduction = process.env.NODE_ENV === "production";
const puppeteer = require("puppeteer-extra");
let chromium;

if (isProduction) {
  puppeteer.use(require("puppeteer-extra-plugin-stealth")());
  chromium = require("@sparticuz/chromium");
}

const axios = require("axios");
const cheerio = require("cheerio");

const SCRAPER_API_KEY = process.env.SCRAPER_KEY;
const SCRAPER_API_BASE = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&render=true&url=`;

// Main search scraper
async function scrapeIndeedJobs(
  searchQuery,
  location = "Remote",
  pagesToScrape = 1
) {
  const jobs = [];

  for (let pageNum = 0; pageNum < pagesToScrape; pageNum++) {
    const searchURL = `https://ca.indeed.com/jobs?q=${encodeURIComponent(
      searchQuery
    )}&l=${encodeURIComponent(location)}&start=${pageNum * 10}`;
    const scraperURL = `${SCRAPER_API_BASE}${encodeURIComponent(searchURL)}`;
    console.log(searchURL)
    try {
      const response = await axios.get(scraperURL);
      const $ = cheerio.load(response.data);

      // Selector block: More flexible & fallback added
      $("li.css-1ac2h1w.eu4oa1w0").each((_, job) => {
        const title =
          $(job).find("h2.jobTitle span[title]").text().trim() ||
          $(job).find("h2.jobTitle span").text().trim() ||
          "No title";

        const company =
          $(job).find("span[data-testid='company-name']").text().trim() ||
          "No company";
        const location =
          $(job).find("[data-testid='text-location']").text().trim() ||
          "No location";
        const href = $(job).find("h2.jobTitle a").attr("href");
        const url = href ? `https://ca.indeed.com${href}` : "No URL";

        jobs.push({ title, company, location, url, jobSite: "Indeed" });
      });
    } catch (err) {
      console.error(`Error scraping ${searchURL}:`, err.message);
    }
  }

  return jobs;
}

// Detail page scraper
async function scrapeJobDetailsFromUrl(jobUrl) {
  const scraperURL = `${SCRAPER_API_BASE}${encodeURIComponent(jobUrl)}`;
  try {
    const response = await axios.get(scraperURL);
    const $ = cheerio.load(response.data);

    const jobDescription =
      $("#jobDescriptionText").text().trim() ||
      $("div.jobsearch-jobDescriptionText").text().trim() ||
      "No job description available.";

    const skills =
      $("[aria-label='Skills'] h3").text().trim() ||
      $("div.jobsearch-ReqAndQualSection-sectionItem span").text().trim() ||
      "No skills information.";

    const pay =
      $("[aria-label='Pay'] li").first().text().trim() ||
      $("span.salary-snippet").first().text().trim() ||
      "No salary information.";

    const benefits = $("#benefits ul li")
      .map((_, li) => $(li).text().trim())
      .get();
    const benefitsText =
      benefits.length > 0 ? benefits : "No benefits information.";

    const jobType =
      $("[aria-label='Job type'] li").first().text().trim() ||
      $("div.jobsearch-JobMetadataHeader-item").text().trim() ||
      "No job type information.";

    const location =
      $("#jobLocationText div").first().text().trim() ||
      $("div.jobsearch-CompanyInfoWithoutHeaderImage div")
        .last()
        .text()
        .trim() ||
      "No location provided.";

    return {
      jobDescription,
      skills,
      pay,
      benefits: benefitsText,
      jobType,
      location,
    };
  } catch (err) {
    console.error("Error scraping job detail via ScraperAPI:", err.message);
    return {
      jobDescription: "No job description available.",
      skills: "No skills information.",
      pay: "No salary information.",
      benefits: "No benefits information.",
      jobType: "No job type information.",
      location: "No location provided.",
    };
  }
}

module.exports = { scrapeIndeedJobs, scrapeJobDetailsFromUrl };
