// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local
const CustomError = require("../../models/custom-error");
const User = require("../../models/user");
const List = require("../../models/list");

// ================================================================================================================== //
// ====================================== CONTROLLER FUNCTIONS FOR USERS ROUTES ===================================== //
// ================================================================================================================== //

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new CustomError("Signup failed, please try again.", 500));
  }

  if (existingUser) {
    return next(new CustomError("User already exists, please login instead.", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new CustomError("Signup failed, please try again.", 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    lists: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new CustomError("Signup failed, please try again.", 500));
  }

  let token;
  try {
    token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.SECRET, {
      expiresIn: "1hr",
    });
  } catch (err) {
    return next(new CustomError("Signup failed, please try again.", 500));
  }

  res.status(201).json({ userId: newUser.id, name: newUser.name, token: token });
};

// ================================================================================================================== //
// ================================================================================================================== //

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new CustomError("Login failed, please try again later.", 500));
  }

  if (!foundUser) {
    return next(new CustomError("Invalid credentials, please try again.", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, foundUser.password);
  } catch (err) {
    return next(new CustomError("Login failed, please try again.", 500));
  }

  if (!isValidPassword) {
    return next(new CustomError("Invalid credentials, please try again.", 401));
  }

  let token;
  try {
    token = jwt.sign({ userId: foundUser.id, email: foundUser.email }, process.env.SECRET, {
      expiresIn: "1hr",
    });
  } catch (err) {
    return next(new CustomError("Signup failed, please try again.", 500));
  }

  res.status(201).json({ userId: foundUser.id, name: foundUser.name, token: token });
};

// ================================================================================================================== //
// ================================================================================================================== //

const deleteUser = async (req, res, next) => {
  const id = req.params.uid;

  let foundUser;
  try {
    foundUser = await User.findById(id);
  } catch (err) {
    return next(new CustomError("Failed to delete user, try again later.", 500));
  }

  if (!foundUser) {
    return next(new CustomError("User not found for this ID.", 404));
  }

  if (foundUser.id !== req.userData.userId) {
    return next(new CustomError("You are not authorized to access this resource.", 403));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await foundUser.remove({ session: sess });
    await List.deleteMany({ authorId: id }, { session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new CustomError("Failed to delete user, try again later.", 500));
  }

  res.json({ message: "Deleted user" });
};

// ================================================================================================================== //
// ===================================================== EXPORTS ==================================================== //
// ================================================================================================================== //

exports.signup = signup;

exports.login = login;

exports.deleteUser = deleteUser;
