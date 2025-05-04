const mongoose = require("mongoose");

const GeneratedResumesJSONSchema = new mongoose.Schema(
  {
    sqlUserId: {
      type: Number,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MongoScrapedDetails",
      required: true,
    },
    sourceJobUrl: {
      type: String,
      required: true,
    },
    resumeJSON: {
      bio: {
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        linkedin: String,
        github: String,
        website: String,
        location: String,
      },
      summary: String,
      skills: [String],
      experiences: [
        {
          companyName: String,
          roleTitle: String,
          startDate: Date,
          endDate: Date,
          experienceDetails: [String],
        },
      ],
      education: [
        {
          institution: String,
          degreeType: String,
          startDate: Date,
          endDate: Date,
          educationDetails: [String],
        },
      ],
    },
    atsScore: {
      type: Number,
      default: null,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "GeneratedResumesJSON",
    timestamps: true,
  }
);

module.exports = mongoose.model("GeneratedResumesJSON", GeneratedResumesJSONSchema);
