const axios = require("axios");
const cheerio = require("cheerio");

const SCRAPER_API_KEY = process.env.SCRAPER_KEY;
const BASE_SCRAPER_URL = "http://api.scraperapi.com";

async function scrapeLinkedInProfile(linkedInProfileURL, debug = false) {
  if (!linkedInProfileURL) throw new Error("LinkedIn Profile URL is required");

  const fullURL = `${BASE_SCRAPER_URL}?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(linkedInProfileURL)}&render=true`;

  try {
    const response = await axios.get(fullURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);

    // Primary data extraction
    const name = $("h1.inline.t-24.v-align-middle.break-words").text().trim() ||
                 $("h1").first().text().trim();

    const headline = $(".text-body-medium.break-words").first().text().trim() ||
                     $(".t-italic").first().text().trim();

    const location = $("span.text-body-small.inline.t-black--light.break-words").first().text().trim() ||
                     $("span.text-body-small").first().text().trim();

    const profileImage =
      $("img.profile-photo-edit__preview").attr("src") ||
      $("img.evi-image").first().attr("src");

    const education =
      $("li.yopwBzMAyDwcJxBrjQHOyzjuBjjhYjMdzheE span.LbhegJfDWOrPwGqaiXxddhaXPfjygulanCl")
        .text()
        .trim() ||
      $("section#education li span.t-bold").first().text().trim();

    // Experience section scraping
    const experiences = [];
    $("section[id^='experience'] li").each((_, el) => {
      const jobTitle = $(el)
        .find("div.t-bold span[aria-hidden='true']")
        .text()
        .trim();
      const companyName = $(el).find("span.t-14.t-normal").first().text().trim();
      const dateRange = $(el)
        .find("span.t-14.t-normal.t-black--light")
        .first()
        .text()
        .trim();

      if (jobTitle || companyName) {
        experiences.push({ jobTitle, companyName, dateRange });
      }
    });

    const extractedData = {
      name,
      headline,
      location,
      profileImage,
      education,
      experiences,
    };

    if (debug) {
      console.log("🔍 LinkedIn Data Extracted:", extractedData);
    }

    return extractedData;
  } catch (err) {
    console.error("❌ Error scraping LinkedIn:", err.message);
    return null;
  }
}

module.exports = { scrapeLinkedInProfile };
