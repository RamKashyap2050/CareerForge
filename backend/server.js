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

app.use(cors());
// Define allowed origins dynamically based on environment
// CORS Configuration for Development
const devCors = cors({
  origin: "http://localhost:5173", // Development frontend
  credentials: true, // Allows cookies to be sent with cross-origin requests
});

// CORS Configuration for Production
const prodCors = cors({
  origin: "https://careerforgedhere.vercel.app", // Production frontend
  credentials: true, // Allows cookies to be sent with cross-origin requests
});

// Use the appropriate CORS based on the environment
if (process.env.NODE_ENV === "production") {
  console.log("Production environment detected, using prod CORS.");
  app.use(prodCors); // Uncomment this for production
} else {
  console.log("Development environment detected, using dev CORS.");
  app.use(devCors); // Uncomment this for development
}

app.use(cookieParser("RamKashyap"));

app.use(express.json());

const passport = require("./config/passportConfig");

app.use(
  session({
    secret: process.env.SECRET_KEY || "RamKashyap",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only in production
      sameSite: "lax", // Helps prevent CSRF while allowing cookies in same-origin
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRoutes);
app.use("/resume", resumeRoutes);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
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
