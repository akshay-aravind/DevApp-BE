const express = require("express");

const connectDB = require("./config/database");
const cookieparser = require("cookie-parser");
const app = express();
const { userAuth } = require("./middlewares/auth");
const  authRouter = require('./routes/authRoutes')
const profileRouter = require('./routes/profileRoutes')
const requestRouter = require('./routes/requestRoutes');
const userRouter = require("./routes/userRoutes");
app.use(express.json());
app.use(cookieparser());

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

app.use("/",authRouter, (err, req, res, next) => {
  console.log(err);
});



connectDB()
  .then(() => {
    console.log("Connected");
    app.listen(4000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => {
    console.log("Connection error", err);
  });
