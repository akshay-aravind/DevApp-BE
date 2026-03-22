const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
    },
    mailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email not valid");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 80,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Validation error");
        }
      },
    },
    about: {
      type: String,
      default: "I am awesome",
    },
    photoUrls: {
      type: String,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skill limit exceeds, poda kazhiveri");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      id: user._id,
    },
    "akshay",
    {
      expiresIn: "7d",
    },
  );
  return token;
};

userSchema.methods.validatePassword  = async function (password) {
  const user  = this
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid
}

const User = mongoose.model("userModel", userSchema);

module.exports = User;
