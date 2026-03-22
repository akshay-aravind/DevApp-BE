const express = require("express");
const authRouter = express.Router()
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require('../middlewares/auth')

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, mailID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      mailID,
      password: hashedPassword,
    });
    
    await user.save();
    res.status(200).send("User added successfully");
  } catch (err) {
    console.log("User Signup error", err);
    res.status(400).send("Error signing up user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { mailID, password } = req.body;

    const user = await User.findOne({ mailID: mailID });

    if (!user) {
      res.status(404).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      const token = await user.getJwt()
      console.log(token, "TokenLog");
      res.cookie("token", token, { expires: new Date(Date.now() + 10000000) });
      res.status(200).send("User Authenticated");
    } else {
      res.status(401).send("Invalid credentials");
    }
    // res.status(200).send("User added successfully");
  } catch (err) {
    console.log("User Signup error", err);
    res.status(400).send("Error signing up user: " + err.message);
  }
});

authRouter.post('/logout',userAuth, async (req,res) => {
  res.clearCookie('token')
  res.status(200).send("User logged Out")
})


authRouter.post("/forgotpassword", userAuth, async (req, res) => {
  try {
    if (req.user) {
      if(bcrypt.compare(req.body.oldPassword, req.user.password)) {
         const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
         req.user.password = hashedPassword;
         await req.user.save();
         res.status(200).send("Password changed successfully");
      } else {
        res.status(401).send("Old password is incorrect");
      }
    } else {
      res.status(401).send("No user found");
    }
  } catch (err) {
    console.log("User Signup error", err);
    res.status(400).send("Error signing up user: " + err.message);
  }
});
module.exports = authRouter;
