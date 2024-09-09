const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");

const createResumeBio = expressAsyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    countryCode,
    phoneNumber,
    email,
    linkedinProfile,
    githubLink,
    websiteLink,
    location,
  } = req.body;

  console.log(
    firstName,
    lastName,
    countryCode,
    phoneNumber,
    email,
    linkedinProfile,
    githubLink,
    websiteLink,
    location
  );
});

module.exports = { createResumeBio };
