const mongoose = require("mongoose");

const FetchedJobUrlsSchema = new mongoose.Schema(
  {
    sqlUserId: {
      type: Number,
      required: [true, "SQL User ID is required"],
    },
    desiredRole: {
      type: String,
      required: true
    },
    location :{
      type: String,
      required: true 
    },
    fetchedUrls: {
      type: [String], // Array of job listing URLs
      required: [true, "Fetched URLs are required"],
      default: [],
    },
  },
  {
    collection: "FetchedJobUrls",
    timestamps: true,
  }
);

module.exports = mongoose.model("FetchedJobUrls", FetchedJobUrlsSchema);
