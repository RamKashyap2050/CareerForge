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
  console.log("Serializing user ID:", user.id); // Only store the user ID
  done(null, user.id); // Store the user ID in the session
});

console.log("User model:", User);

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id); // Should be the ID, not the whole user object
  try {
    const user = await User.findByPk(id); // Fetch user by ID
    if (user) {
      done(null, user); // Attach user to req.user
    } else {
      done(null, false); // No user found
    }
  } catch (err) {
    done(err); // Handle errors
  }
});

module.exports = passport;
