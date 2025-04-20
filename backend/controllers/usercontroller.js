const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const expressAsyncHandler = require("express-async-handler");
const router = express.Router();
const passport = require("passport");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const MongoUser = require("../models/MongoUser"); // MongoDB model
const { uploadImageToS3 } = require("../s3/s3");

const signup = expressAsyncHandler(async (req, res, next) => {
  try {
    const { email, password, profilePhoto, username } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create SQL user
    const user = await User.create({
      email: email,
      password: hashedPassword,
      image: profilePhoto,
    });

    // Create MongoDB user profile linked by sqlUserId
    const mongoUser = await MongoUser.create({
      sqlUserId: user.id,
      username: username || email.split("@")[0], // fallback to email prefix if username not given
      profilePhoto: profilePhoto,
      bio: "",
      defaultResumeId: null,
      jobPreferences: {
        role: "",
        remote: false,
        location: "",
        salaryRange: "",
      },
      linkedAccounts: {
        github: "",
        linkedin: "",
      },
    });

    console.log("Mongo User Created:", mongoUser);

    // Auto login
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json({
        message: "User registered and logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          profilePhoto: user.image,
        },
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = signup;

const login = expressAsyncHandler(async (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          profilePhoto: user.ProfilePhoto,
        },
      });
    });
  })(req, res, next);
});

const skillsuggest = expressAsyncHandler(async (req, res) => {
  const { prompt } = req.query;
  console.log(prompt);

  try {
    // Introduce a delay of 5 seconds before processing
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `You are assisting in building a resume's skill set section. Given the field or skill prompt "${prompt}", provide only a list of directly related skills in clear, concise bullet points. Do not include any additional explanations, notes, or comments. Focus exclusively on small, relevant skill names.`;

    const result = await model.generateContent(fullPrompt);
    const text = await result.response.text();
    console.log(text);
    return res.json({ skills: text });
  } catch (error) {
    console.error("Error fetching from Gemini API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const experienceSuggest = expressAsyncHandler(async (req, res) => {
  const { title } = req.query;
  console.log(title);

  try {
    // Introduce a delay of 5 seconds before processing
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `You are generating a list of key responsibilities and achievements for the job title "${title}". Each bullet point should start with a strong action verb, clearly describe the task or responsibility, and include a quantifiable result or impact where possible. Avoid any introductions, explanations, or extra commentary—focus exclusively on concise, impactful bullet points that demonstrate accomplishment and value.`;

    const result = await model.generateContent(fullPrompt);
    const text = await result.response.text();
    console.log(text);
    return res.json({ duties: text });
  } catch (error) {
    console.error("Error fetching from Gemini API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const SummarySuggest = expressAsyncHandler(async (req, res) => {
  const { prompt } = req.query;
  console.log(prompt);

  try {
    // Introduce a delay of 5 seconds before processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `You are creating a concise and impactful professional summary for the role of "${prompt}". The summary should:
1. Highlight key skills, experiences, and accomplishments relevant to this role.
2. Use clear, professional language without jargon or overly complex terms.
3. Be between 3 to 5 sentences long, focusing on the value the person brings to the role.
4. Avoid generic statements or clichés—make the summary feel personalized and results-driven.
5. Include specific, quantifiable achievements or key areas of expertise where applicable.

The goal is to deliver a strong, professional overview that makes a compelling case for the individual in the role of "${prompt}".
`;

    const result = await model.generateContent(fullPrompt);
    const text = await result.response.text();
    console.log(text);
    return res.json({ summary: text });
  } catch (error) {
    console.error("Error fetching from Gemini API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const logout = expressAsyncHandler((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});
// Middleware to protect routes
const isAuthenticated = expressAsyncHandler((req, res, next) => {
  console.log("Session data:", JSON.stringify(req.session, null, 2)); // Log the session data here
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Session ID:", req.sessionID); // For session-based auth
  console.log("Token:", req.headers.cookie); // For token-based auth
  res.status(401).json({ message: "Unauthorized" });
});

const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const sqlUserId = req.user.id; // assuming you store SQL ID in session/JWT

  try {
    const updatedData = req.body;
    console.log(updatedData);
    // Ensure nested fields are respected using $set
    await MongoUser.updateOne({ sqlUserId }, { $set: updatedData });

    const updatedUser = await MongoUser.findOne({ sqlUserId });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("MongoDB Profile Update Failed:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

const updateProfilePhoto = expressAsyncHandler(async (req, res) => {
  const sqlUserId = req.user.id;

  try {
    if (!req.files || !req.files.profilePhoto) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.files.profilePhoto;
    const imageUrl = await uploadImageToS3(file);

    await MongoUser.updateOne(
      { sqlUserId },
      { $set: { profilePhoto: imageUrl } }
    );

    const updatedUser = await MongoUser.findOne({ sqlUserId });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

const getUserProfile = expressAsyncHandler(async (req, res) => {
  const sqlUserId = req.user?.id; // Ensure this is populated by middleware (e.g. Passport/JWT)

  if (!sqlUserId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No SQL User ID found." });
  }

  const mongoProfile = await MongoUser.findOne({ sqlUserId });

  if (!mongoProfile) {
    return res.status(404).json({ message: "Profile not found in MongoDB" });
  }

  res.status(200).json(mongoProfile);
});

module.exports = {
  login,
  signup,
  skillsuggest,
  experienceSuggest,
  logout,
  isAuthenticated,
  SummarySuggest,
  updateUserProfile,
  getUserProfile,
  updateProfilePhoto,
};
