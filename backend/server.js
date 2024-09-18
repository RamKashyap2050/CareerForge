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
const PgSession = require("connect-pg-simple")(session); // Import connect-pg-simple
const pg = require("pg");
const cookieParser = require("cookie-parser");

app.use(cors());
// Your CORS setup (customize as per your environment)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://careerforgedhere.vercel.app"
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser("RamKashyap"));

app.use(express.json());

const passport = require("./config/passportConfig");
const pgPool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // For self-signed SSL
  },
});
// Configure session middleware with PostgreSQL store
app.use(
  session({
    store: new PgSession({
      pool: pgPool, // Use your PostgreSQL pool
      tableName: "session", // Optional: default is 'session'
      createTableIfMissing: true, // Automatically create the session table if it's missing
    }),
    secret: process.env.SECRET_KEY || "mysecret",
    resave: false, // Avoid resaving the session if not modified
    saveUninitialized: false, // Don’t save uninitialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      secure: process.env.NODE_ENV === "production", // Ensure cookie is sent over HTTPS in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      sameSite: "None", // Required for cross-origin requests
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
