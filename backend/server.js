const express = require("express");
const path = require("path");
require("pg");
const sequelize = require("./config/db");
require("dotenv").config();
const resumeRoutes = require("../backend/routes/resumeRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const app = express();
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const ResumeExperience = require("../backend/models/ResumeExperience");
const ResumeSkills = require("../backend/models/ResumeSkill");
const ResumeEducation = require("../backend/models/ResumeEducation");
const Resume = require("../backend/models/Resume");
const ResumeExtraSection = require("../backend/models/ResumeExtraSection");
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allows sending cookies with cross-origin requests
  })
);
app.use(cookieParser("RamKashyap"));

app.use(express.json());

const passport = require("./config/passportConfig");

app.use(
  session({
    secret: process.env.SECRET_KEY || "RamKashyap",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRoutes);
app.use("/resume", resumeRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "dist", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please Activate Production"));
}

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });
