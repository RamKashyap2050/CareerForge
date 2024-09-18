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
var SQLiteStore = require("connect-sqlite3")(session);

app.use(cors());
// Your CORS setup (customize as per your environment)
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "https://careerforgedhere.vercel.app" 
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser("RamKashyap"));

app.use(express.json());

const passport = require("./config/passportConfig");

app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite" }), // SQLite for session storage
    secret: process.env.SECRET_KEY || "mysecretkey", // Replace with your secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      sameSite: "lax", // Cookie same-site setting
    },
  })
);
app.use(passport.authenticate("session"));

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
