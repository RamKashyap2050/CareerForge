// ✅ UPDATED: GlassdoorScrapper.js using ScraperAPI
const axios = require("axios");
const cheerio = require("cheerio");

const SCRAPER_API_KEY = process.env.SCRAPER_KEY;
const SCRAPER_API_BASE = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&render=true&url=`;

async function scrapeGlassdoorJobs(
  searchQuery,
  location = "Remote",
  pagesToScrape = 2
) {
  let jobs = [];

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

      // First: Try parsing DOM-based listings (may fail if Glassdoor uses client-side rendering)
      const domJobs = $("li[data-test='jobListing']");
      if (domJobs.length > 0) {
        domJobs.each((_, job) => {
          const title =
            $(job).find("a[data-test='job-title']").text().trim() || "No title";
          const company =
            $(job)
              .find(".EmployerProfile_compactEmployerName__9MGcV")
              .text()
              .trim() || "No company";
          const location =
            $(job).find("div[data-test='emp-location']").text().trim() ||
            "No location";
          const salary =
            $(job).find("div[data-test='detailSalary']").text().trim() ||
            "No salary";
          let href = $(job).find("a[data-test='job-title']").attr("href");

          let url = "No URL";
          if (href) {
            url = href.startsWith("http")
              ? href
              : `https://www.glassdoor.ca${href}`;
          }

          jobs.push({
            title,
            company,
            location,
            salary,
            url,
            jobSite: "Glassdoor",
          });
        });
      } else {
        // Fallback: Extract from structured JSON if DOM parsing fails
        const jsonScript = $("script[type='application/ld+json']").html();
        if (jsonScript) {
          try {
            const jsonData = JSON.parse(jsonScript);
            if (Array.isArray(jsonData.itemListElement)) {
              jsonData.itemListElement.forEach((item) => {
                const jobUrl = item.url || "No URL";
                jobs.push({
                  title: "Unknown (use detail scraper)",
                  company: "Unknown",
                  location: "Unknown",
                  salary: "Unknown",
                  url: jobUrl,
                  jobSite: "Glassdoor",
                });
              });
            }
          } catch (jsonErr) {
            console.error("Failed to parse ld+json:", jsonErr.message);
          }
        }
      }
    } catch (error) {
      console.error(
        `Error scraping Glassdoor (page ${pageNum}):`,
        error.message
      );
    }
  }

  return jobs;
}

// Keep Puppeteer for dynamic job detail scraping
const isProduction = process.env.NODE_ENV === "production";
const puppeteer = isProduction
  ? require("puppeteer-core")
  : require("puppeteer");
const chromium = isProduction ? require("@sparticuz/chromium") : null;

async function scrapeGlassdoorJobDetails(jobUrl) {
  const scraperURL = `${SCRAPER_API_BASE}${jobUrl}`;
  console.log(jobUrl)

  try {
    const response = await axios.get(scraperURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // First try DOM-based selectors
    let jobTitle = $("h2[class*='jobTitle'], h1[class*='heading_Level1']").text().trim() || "Not available";
    let company = $("h4[class*='heading_Subhead']").text().trim() || "Not available";
    let jobDescription = $("div[class*='JobDetails_jobDescription']").text().trim() || "Not available";
    let pay = $("div[id^='jd-salary']").text().trim() || "Not available";
    let benefits = $("div[class*='SalaryEstimate_salaryDisclosure']").text().trim() || "Not available";
    let location = $("div[data-test='location']").text().trim() || "Not available";

    // Fallback to JSON-LD if jobTitle is still not found
    if (jobTitle === "Not available") {
      const jsonLD = $("script[type='application/ld+json']").html();
      if (jsonLD) {
        const parsed = JSON.parse(jsonLD);
        if (parsed.title) jobTitle = parsed.title;
        if (parsed.hiringOrganization?.name) company = parsed.hiringOrganization.name;
        if (parsed.description) jobDescription = parsed.description.replace(/<\/?[^>]+(>|$)/g, "").trim();
        if (parsed.jobLocation?.address?.addressLocality) location = parsed.jobLocation.address.addressLocality;
      }
    }

    return { jobTitle, company, jobDescription, pay, benefits, location };
  } catch (err) {
    console.error("❌ Failed to scrape Glassdoor job details:", err.message);
    return null;
  }
}
module.exports = { scrapeGlassdoorJobs, scrapeGlassdoorJobDetails };

