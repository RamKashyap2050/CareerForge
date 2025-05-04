const mongoose = require("mongoose");

const MongoUserSchema = new mongoose.Schema(
  {
    sqlUserId: {
      type: Number,
      required: [true, "Please enter the SQL User ID for linkage"],
      unique: true,
    },
    username: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default:
        "https://murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg",
    },
    bio: {
      type: String,
      default: "",
    },
    defaultResumeId: {
      type: Number,
      default: null,
    },
    jobPreferences: {
      role: { type: String, default: "" },
      remote: { type: Boolean, default: false },
      location: { type: String, default: "" },
      salaryRange: { type: String, default: "" },
    },
    linkedAccounts: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    isSubscriber: {
      type: Boolean,
      default: false,
    },
    glassdoorCookies: {
      type: Array,
      default: [],
    },
  },
  {
    collection: "MongoUsers",
    timestamps: true,
  }
);

module.exports = mongoose.model("MongoUser", MongoUserSchema);
