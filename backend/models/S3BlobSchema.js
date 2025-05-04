// models/S3Blob.js
const mongoose = require("mongoose");

const S3BlobSchema = new mongoose.Schema({
  sqlUserId: {
    type: Number,
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MongoScrapedDetails", // Your scraped jobs collection
    required: true,
  },
  sourceJobUrl: {
    type: String,
    required: true,
  },
  resumePdfUrl: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    default: null,
  },
  resumeFormat: {
    type: String,
    enum: ["default", "modern", "classic", "Default-GenAI-V1"], // Allow for future template support
    default: "Default-GenAI-V1",
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("S3Blob", S3BlobSchema);
