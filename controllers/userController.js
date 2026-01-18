const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { constants } = require("../constants");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("User already exists");
  }

  const user = await User.create({ username, email, password });
  res.status(201).json({ token: generateToken(user) });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({ token: generateToken(user) });
});

// Current user
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
});

module.exports = { registerUser, loginUser, currentUser };