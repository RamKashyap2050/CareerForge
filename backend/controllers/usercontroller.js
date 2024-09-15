const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const expressAsyncHandler = require("express-async-handler");
const router = express.Router();
const passport = require("passport");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const signup = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password, profilePhoto } = req.body;
    console.log(email, password, profilePhoto);
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    console.log("Request Body:", req.body);

    const user = await User.create({
      email: email,
      password: hashedPassword,
      image: profilePhoto,
    });

    console.log("User creation result:", user);
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        message: "User registered and logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          profilePhoto: user.ProfilePhoto,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    await new Promise((resolve) => setTimeout(resolve, 5000));

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
    await new Promise((resolve) => setTimeout(resolve, 5000));

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
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
});
module.exports = {
  login,
  signup,
  skillsuggest,
  experienceSuggest,
  logout,
  isAuthenticated,
};
