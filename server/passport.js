const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
      },
      function (accessToken, refreshToken, profile, callback) {
        callback(null, profile);
      }
    )
  );

  passport.serializeUser((user, callback) => {
    callback(null, user);
  });

  passport.deserializeUser((user, callback) => {
    callback(null, user);
  });
}

module.exports = configurePassport;
