require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUser } = require("./services/auth");
const conversationRouter = require("./routes/conversation.routes");
const messageRouter = require("./routes/message.routes");
const Conversation = require("./models/conversation");
const passportConfig = require("./passport");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");
const usersRouter = require("./routes/users.routes");
const settingsRouter = require("./routes/settings.routes");

passportConfig(passport);

app.use(
  cors({
    origin: ["*", process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use(
  session({
    secret: "SouravG",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
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

app.get("/authorization", async (req, res) => {
  const userToken = req.cookies?.token;
  if (!userToken) return res.status(401).json({ msg: "Unauthorized" });
  const jwtUser = getUser(userToken);
  const user = await User.findOne({ email: jwtUser.email });
  if (!user) return res.status(401).json({ msg: "Unauthorized" });
  return res.status(200).json({ user, msg: "Authorized" });
});

const server = app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (user) => {
    socket.join(user?._id);
    socket.emit("connected");
    console.log("User Id", user?._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room " + room);
  });

  socket.on("new message", async (newMessageRecieved) => {
    const conversation = newMessageRecieved?.conversationId;
    console.log("Socket new Message", newMessageRecieved);
    if (conversation?.userIds?.length < 2) {
      return console.log("conversation.userIds not defined");
    }

    conversation?.userIds?.forEach((userId) => {
      // if (userId === newMessageRecieved?.sender?._id) return;
      console.log(userId);
      socket.in(userId).emit("message recieved", newMessageRecieved);
    });
  });
});
