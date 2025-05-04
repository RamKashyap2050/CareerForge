const mongoose = require("mongoose");

const MongoScrapedDetails = new mongoose.Schema(
  {
    sqlUserId: {
      type: Number,
      required: [true, "SQL User ID is required"],
    },
    url: {
      type: String,
      required: [true, "Job URL is required"],
    },
    jobTitle: {
      type: String,
      default: "Not available",
    },
    company: {
      type: String,
      default: "Not available",
    },
    jobDescription: {
      type: String,
      default: "Not available",
    },
    pay: {
      type: String,
      default: "Not available",
    },
    benefits: {
      type: String,
      default: "Not available",
    },
    location: {
      type: String,
      default: "Not available",
    },
  },
  {
    collection: "MongoScrapedDetails",
    timestamps: true,
  }
);

module.exports = mongoose.model("MongoScrapedDetails", MongoScrapedDetails);
