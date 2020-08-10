// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

// Local
const CustomError = require("../../models/custom-error");
const User = require("../../models/user");

// ================================================================================================================== //
// ====================================== CONTROLLER FUNCTIONS FOR USERS ROUTES ===================================== //
// ================================================================================================================== //

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new CustomError("Signup failed, please try again.", 500));
  }

  if (existingUser) {
    return next(new CustomError("User already exists, please login instead.", 422));
  }

  const newUser = new User({
    email,
    password,
    lists: "nothing yet",
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new CustomError("Signup failed, please try again", 500));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

// ================================================================================================================== //
// ================================================================================================================== //

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new CustomError("Login failed, please try again later", 500));
  }

  if (!foundUser || foundUser.password !== password) {
    return next(new CustomError("Invalid credentials", 401));
  }

  res.json({ message: "User logged in" });
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

  try {
    await foundUser.remove();
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
