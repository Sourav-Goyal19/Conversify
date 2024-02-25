const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const { handleSignUp, handleLogin } = require("../controllers/auth");
const User = require("../models/user");
const Account = require("../models/account");
const cors = require("cors");

userRouter.use(
  cors({
    origin: ["*", process.env.CLIENT_URL],
  })
);

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
  .get("/success", async (req, res) => {
    const { name, email, picture } = req.user._json;
    try {
      const user = await User.create({
        name: name,
        email: email,
        image: picture,
        account: true,
      });
      const googleAccount = await Account.create({
        userId: user._id,
        provider: req.user.provider,
        providerAccountId: req.user.id,
        type: "oauth",
      });
      if (googleAccount && user) {
        return res.status(201).redirect(process.env.CLIENT_URL);
      }
    } catch (error) {
      console.error("Error creating user or account:", error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .get("/failure", (req, res) => {
    return res.status(401).json({ msg: "Authentication failed" });
  })
  .get("/login/success", async (req, res) => {
    if (req.user) {
      const user = await User.findOne({ email: req.user.emails[0].value });
      res.status(200).json({ msg: "User Logged In successfully", user: user });
    } else {
      res.status(401).json({ msg: "User Not Found" });
    }
  });

module.exports = userRouter;
