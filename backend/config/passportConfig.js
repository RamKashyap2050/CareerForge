const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Store the user ID in the session
  console.log("Serializing user with ID:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await User.findByPk(id); // Fetch user from the DB
    if (user) {
      done(null, user); // Pass user to req.user
    } else {
      done(null, false); // No user found
    }
  } catch (err) {
    done(err); // Handle errors
  }
});


module.exports = passport;
