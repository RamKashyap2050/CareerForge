const puppeteer = require("puppeteer-extra");

async function autoApplyToJob(jobUrl, resumeJSON) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(jobUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // NOTE: Write selectors for the job site’s Easy Apply form
    await page.type('input[name="full_name"]', resumeJSON.bio.firstName + " " + resumeJSON.bio.lastName);
    await page.type('input[name="email"]', resumeJSON.bio.email);
    await page.type('textarea[name="summary"]', resumeJSON.summary);
    await page.type('textarea[name="skills"]', resumeJSON.skills.join(", "));

    // Optional: Upload PDF if required
    // await page.uploadFile('input[type="file"]', resumePDFPath);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await browser.close();
    return true;
  } catch (err) {
    console.error("❌ Puppeteer apply error:", err.message);
    return false;
  }
}

module.exports = { autoApplyToJob };
