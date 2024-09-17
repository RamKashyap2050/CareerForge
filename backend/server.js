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
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  "https://careerforgedhere.vercel.app", // Production frontend
];

// CORS Configuration - Dynamic based on request origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allows cookies to be sent with cross-origin requests
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
    cookie: {
      httpOnly: true, // Ensures the cookie is only sent over HTTP(S)
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
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
