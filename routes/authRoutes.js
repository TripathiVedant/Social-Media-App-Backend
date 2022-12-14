// const express = require('express')
// const router = express.Router()

// const User = require('../models/userModel')

// router.get('/register', (req, res) => {
//     res.send('Register')
// })

// module.exports = router

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

const Profile = require("../models/profileModel");
const Follower = require("../models/followerModel");
const Following = require("../models/followingModel");

const verifyAuthentication = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email)
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
      });
    } else {
        // console.log("ji")
        // console.log(req.body)
        let user = await new User(req.body);
        // console.log(user)
        const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(user.password, salt);
      user = await user.save();

      const token = generateAuthToken(user._id);
      const profile = await new Profile({ userId: user._id });
      const followers = await new Follower({ userId: user._id });
      const followings = await new Following({ userId: user._id });
      await profile.save();
      await followers.save();
      await followings.save();
      return res.status(201).json({
        message: "User created successfully.",
        response: {
          name: user.name,
          email: user.email,
          _id: user._id,
          token,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
});

router.get("/users", verifyAuthentication, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      response: {
        users,
      },
      message: "Users fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(403).json({
        message: "Incorrect email or password!",
      });
    } else {
      const isPasswordValid = bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) {
        return res.status(403).json({
          message: "Incorrect email or password.",
        });
      }

      const token = generateAuthToken(foundUser._id);

      return res.status(200).json({
        message: "Logged in successfully.",
        response: {
          token,
          name: foundUser.name,
          email: foundUser.email,
          _id: foundUser._id,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
});

module.exports = router;
