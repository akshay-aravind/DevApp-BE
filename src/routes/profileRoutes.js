const express = require('express')
const profileRouter = express.Router()
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userAuth, userValidation } = require('../middlewares/auth')

profileRouter.post("/profile", userAuth, async (req, res) => {
  try {
    if (req.user) {
      res.status(200).send(req.user);
    } else {
      res.status(401).send("No user found");
    }
  } catch (err) {
    console.log("User Signup error", err);
    res.status(400).send("Error signing up user: " + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, userValidation, async (req, res) => {
  try {
    if(req.user) {
      const payload = req.body
      const loggedInUser = req.user
      //  Object.keys(loggedInUser).reduce((acc, key) => {
      //     acc[key] = payload[key] || loggedInUser[key];
      //     return acc;
      //   }, {});
      console.log(loggedInUser.firstName, "Logged in user");
        Object.keys(payload).forEach(key => {
          loggedInUser[key] = payload[key] || loggedInUser[key]
        })
        await loggedInUser.save()
        // const updatedUser = await User.findByIdAndUpdate(req.user._id, user, { returnDocument: "after", runValidators: true })

        // console.log(updatedUser, "Update user")
        if(loggedInUser) {
          res.status(200).send(loggedInUser)
        } else {
          throw new Error("Update failed")
        }
    } else {
        res.status(404).send("No user found");
    }
  } 
  catch (err) {
    console.log("User Signup error", err);
    res.status(400).send("Error signing up user: " + err.message);
  }
})

module.exports = profileRouter