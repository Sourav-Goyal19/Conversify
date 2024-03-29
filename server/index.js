require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUser, setUser } = require("./services/auth");
const conversationRouter = require("./routes/conversation.routes");
const messageRouter = require("./routes/message.routes");
const passportConfig = require("./services/passport");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");
const usersRouter = require("./routes/users.routes");
const settingsRouter = require("./routes/settings.routes");

passportConfig(passport);

app.use(
  cors({
    origin: ["https://newconversify.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "SouravG",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve("./public")));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/users", usersRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/settings", settingsRouter);

app
  .get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/success",
      failureRedirect: "/auth/failure",
    })
  )
  .get("/success", async (req, res) => {
    if (req.user) {
      const user = await User.findOne({ email: req.user.emails[0].value });
      const token = setUser(user);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.redirect(process.env.CLIENT_URL);
    }
  })
  .get("/failure", (req, res) => {
    return res.redirect(process.env.CLIENT_URL);
  })
  .get("/login/success", async (req, res) => {
    if (req.user) {
      const user = await User.findOne({ email: req.user.emails[0].value });
      res.status(200).json({ msg: "User Logged In successfully", user: user });
    } else {
      res.status(401).json({ msg: "User Not Found" });
    }
  });

app.get("/authorization", async (req, res) => {
  const userToken = req.cookies?.token;
  if (!userToken) return res.status(401).json({ msg: "Unauthorized" });
  const jwtUser = getUser(userToken);
  const user = await User.findOne({ email: jwtUser.email });
  if (!user) return res.status(401).json({ msg: "Unauthorized" });
  return res.status(200).json({ user, msg: "Authorized" });
});

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

const server = app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // Allow requests from any origin for Socket.IO
  },
});
