const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const { handleSignUp, handleLogin } = require("../controllers/auth");

userRouter
  .post("/signup", handleSignUp)
  .post("/login", handleLogin)
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )
  .get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/success",
      failureRedirect: "/auth/failure",
    })
  )
  .get("/success", (req, res) => {
    if (req.user) {
      console.log(req.user);
      res.send(`Hey there, ${req.user.displayName}`);
    }
  })
  .get("/failure", (req, res) => {
    if (req.user) {
      console.log(req.user);
      res.send("Hey there");
    }
  });

module.exports = userRouter;
