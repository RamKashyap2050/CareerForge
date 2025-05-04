// ✅ UPDATED: GlassdoorScrapper.js using ScraperAPI
require("dotenv").config(); // Make sure this is at the top!
const axios = require("axios");
const cheerio = require("cheerio");

const SCRAPER_KEY = process.env.SCRAPER_KEY ?? (() => { throw new Error("SCRAPER_KEY missing"); })();

const SCRAPER_API_BASE = `http://api.scraperapi.com?api_key=${SCRAPER_KEY}&render=true&url=`;

const scrapeGlassdoorJobs = async (searchQuery, location = "Remote", pagesToScrape = 2) => {
  const jobLinks = [];

  for (let pageNum = 0; pageNum < pagesToScrape; pageNum++) {
    const searchURL = `https://www.glassdoor.ca/Job/jobs.htm?sc.keyword=${encodeURIComponent(
      searchQuery
    )}&locT=C&locId=&locKeyword=${encodeURIComponent(
      location
    )}&jobType=&fromAge=-1&radius=0&minSalary=0&includeNoSalaryJobs=true&sortBy=date_desc&start=${
      pageNum * 10
    }`;
    console.log(searchURL)
    const scraperURL = `${SCRAPER_API_BASE}${encodeURIComponent(searchURL)}`;

    try {
      const response = await axios.get(scraperURL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const jsonScript = $("script[type='application/ld+json']").html();

      if (jsonScript) {
        const jsonData = JSON.parse(jsonScript);

        if (Array.isArray(jsonData.itemListElement)) {
          jsonData.itemListElement.forEach((item) => {
            if (item.url) {
              jobLinks.push(item.url);
            }
          });
        }
      } else {
        console.warn("No ld+json found on this page");
      }
    } catch (err) {
      console.error(`Error on page ${pageNum}:`, err.message);
    }
  }

  return jobLinks;
};


// Keep Puppeteer for dynamic job detail scraping
const isProduction = process.env.NODE_ENV === "production";
const puppeteer = isProduction
  ? require("puppeteer-core")
  : require("puppeteer");
const chromium = isProduction ? require("@sparticuz/chromium") : null;

async function scrapeGlassdoorJobDetails(jobUrl) {
  const scraperURL = `${SCRAPER_API_BASE}${encodeURIComponent(jobUrl)}`;
  console.log(`🔍 Fetching Job URL: ${jobUrl}`);

  try {
    const response = await axios.get(scraperURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // 🔵 Try JSON-LD parsing first
    let jobTitle = "Not available";
    let company = "Not available";
    let jobDescription = "Not available";
    let pay = "Not available";
    let benefits = "Not available";
    let location = "Not available";

    const jsonLD = $("script[type='application/ld+json']").html();

    if (jsonLD) {
      try {
        const parsed = JSON.parse(jsonLD);

        if (parsed["@type"] === "JobPosting") {
          jobTitle = parsed.title || jobTitle;
          company = parsed.hiringOrganization?.name || company;
          jobDescription = parsed.description
            ? parsed.description.replace(/<\/?[^>]+(>|$)/g, "").trim()
            : jobDescription;
          location = parsed.jobLocation?.address?.addressLocality || location;

          if (parsed.baseSalary?.value?.minValue && parsed.baseSalary?.value?.maxValue) {
            pay = `$${parsed.baseSalary.value.minValue} - $${parsed.baseSalary.value.maxValue}`;
          }

          benefits = parsed.jobBenefits || benefits;

          console.log(`✅ Parsed with JSON successfully`);
        }
      } catch (jsonErr) {
        console.warn("⚠️ JSON parsing failed, falling back to CSS parsing:", jsonErr.message);
      }
    }

    // 🟠 If critical fields are still missing, fallback to CSS
    if (jobTitle === "Not available" || company === "Not available") {
      console.warn("⚠️ Falling back to CSS selectors...");

      jobTitle = $("h1[class*='jobTitle'], h1[class*='heading_Level1']").text().trim() || jobTitle;
      company = $("h4[class*='heading_Subhead']").text().trim() || company;
      jobDescription = $("div[class*='JobDetails_jobDescription']").text().trim() || jobDescription;
      pay = $("div[id^='jd-salary']").text().trim() || pay;
      benefits = $("div[class*='SalaryEstimate_salaryDisclosure']").text().trim() || benefits;
      location = $("div[data-test='location']").text().trim() || location;

      console.log(`✅ Parsed with CSS selectors successfully`);
    }

    console.log(`🏢 Company: ${company} | 📋 Title: ${jobTitle} | 💵 Pay: ${pay}`);

    return { jobTitle, company, jobDescription, pay, benefits, location };
  } catch (err) {
    console.error("❌ Failed to scrape Glassdoor job details:", err.message);
    return null;
  }
}

module.exports = { scrapeGlassdoorJobs, scrapeGlassdoorJobDetails };

