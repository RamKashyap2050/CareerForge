const express = require("express");
const path = require("path");
require("pg");
// const initAssociations = require("./models/initAssociations")
const sequelize = require("./config/db");
require("dotenv").config();
const resumeRoutes = require("../backend/routes/resumeRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const mockinterviewsRoutes = require("../backend/routes/mockInterview");
const app = express();
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store); // Use Sequelize to store sessions
const pg = require("pg");
const Session = require("./models/Session"); // The Session model
const fileupload = require("express-fileupload");
const { applyAssociations } = require("./models/associations");
const ScrapperRoutes = require("../backend/routes/ScrapperRoutes");
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
app.use(fileupload());
app.use(express.json());

const passport = require("./config/passportConfig");
// Create a new PostgreSQL pool
const pgPool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
});
applyAssociations();
app.use(
  session({
    secret: process.env.SECRET_KEY || "RamKashyap",
    store: new SequelizeStore({
      db: sequelize,
      table: "Session",
      modelKey: "Session",
      extendDefaultFields: (defaults, session) => {
        console.log(
          "Saving session for user:",
          session.passport ? session.passport.user : "No user"
        );
        return {
          data: defaults.data,
          expires: defaults.expires,
          userId:
            session.passport && session.passport.user
              ? session.passport.user
              : null, // Store the userId
        };
      },
    }),
    proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)

    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use((req, res, next) => {
  console.log(
    "Session data after login:",
    JSON.stringify(req.session, null, 2)
  );
  next();
});

app.use(passport.authenticate("session"));

app.use(passport.initialize());
app.use(passport.session());
// initAssociations();  // This sets up the relationships after models are loaded

app.use("/users", userRoutes);
app.use("/resume", resumeRoutes);
app.use("/scrapping", ScrapperRoutes);
app.use("/api/mock", mockinterviewsRoutes);
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
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });

module.exports = app;
