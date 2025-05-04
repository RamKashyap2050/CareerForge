const express = require("express");
const {
  createOrUpdateResumeBio,
  updateResumeSummary,
  getUserDraftResumes,
  getDraftUserSingleResume,
  updateResumeSkills,
  updateResumeExperience,
  deleteresumeexperience,
  updateResumeEducation,
  askswiftlet,
  parsenadcreatecustomresume,
  mockinterviews,
  getUserGeneratedResumes
} = require("../controllers/resumecontroller");
const { isAuthenticated } = require("../controllers/usercontroller");
const router = express.Router();
const generatePDFBuffer = require("../utlis/generatePDFBuffer");
const { uploadImageToS3 } = require("../s3/s3");

router.route("/resume-bio").put(isAuthenticated, createOrUpdateResumeBio);
router.route("/resume-summary").put(isAuthenticated, updateResumeSummary);
router.route("/resumes").get(isAuthenticated, getUserDraftResumes);
router.route("/resume-skills").put(isAuthenticated, updateResumeSkills);
router.route("/resume-experience").put(isAuthenticated, updateResumeExperience);
router
  .route("/deleteresumeexperience/:id")
  .delete(deleteresumeexperience, isAuthenticated);
router.route("/resumes/:resumeId").get(getDraftUserSingleResume);
router.route("/resume-education").put(isAuthenticated, updateResumeEducation);
router.route("/chats").post(askswiftlet);
router.route("/parseresume").post(parsenadcreatecustomresume);
router.route("/mockinterviews").post(mockinterviews);
router.route("/getresumesforuser").get(getUserGeneratedResumes)
router.post("/test-resume-pdf-upload", async (req, res) => {
  try {
    const resumeData = req.body;
    console.log(resumeData)
    // Step 1: Generate the PDF
    const pdfBuffer = await generatePDFBuffer(resumeData);

    // Step 2: Upload to S3 with timestamped name
    const fileName = `${resumeData.bio.firstName.replace(/\s+/g, "")}_${Date.now()}.pdf`;
    const fileToUpload = {
      name: fileName,
      data: pdfBuffer,
      mimetype: "application/pdf",
    };
    const s3Url = await uploadImageToS3(fileToUpload);

    // Step 3: Return result
    return res.json({ success: true, s3Url });
  } catch (err) {
    console.error("❌ Test PDF Upload Failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "PDF test failed." });
  }
});
module.exports = router;
