const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    console.log(req.cookies.token);
    const token = await jwt.verify(req.cookies.token, "akshay");
    const user = await User.findById({ _id: token.id });
    if (!user) {
      throw new Error("No user found");
    }
    console.log(user, "User Found")
    req.user = user
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("User authentication failed", error.message);
  }
};

const userValidation = (async = (req, res, next) => {
  try {
    const allowedChanges = [
      "firstName",
      "photoUrl",
      "lastName",
      "age",
      "skills",
      "about",
    ];
    Object.keys(req.body).map((key) => {
      if (!allowedChanges.includes(key)) {
        throw new Error("Payload not supported");
      } 
    });
    next()
  } catch (error) {
    console.log('User validation failed', error)
    res.status(400).send("User Validation failed");
  }
});

module.exports = { userAuth, userValidation };
