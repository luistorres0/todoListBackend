// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

// Local
const CustomError = require("../../models/custom-error");

// ================================================================================================================== //
// ============================================= DUMMY DATA FOR TESTING ============================================= //
// ================================================================================================================== //

let DUMMY_USERS = [
  {
    id: uuid(),
    email: "luis@email.com",
    password: "coder123",
  },
  {
    id: uuid(),
    email: "jeanette@email.com",
    password: "baker123",
  },
];

// ================================================================================================================== //
// ====================================== CONTROLLER FUNCTIONS FOR USERS ROUTES ===================================== //
// ================================================================================================================== //

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const { email, password } = req.body;

  if (DUMMY_USERS.find((user) => user.email === email)) {
    return next(new CustomError("User already exists", 422));
  }

  const newUser = {
    id: uuid(),
    email,
    password,
  };

  DUMMY_USERS.push(newUser);
  console.log(DUMMY_USERS);
  res.json({ message: "User created." });
};

// ================================================================================================================== //
// ================================================================================================================== //

const login = (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = DUMMY_USERS.find((user) => user.email === email);
  if (!foundUser || foundUser.password !== password) {
    return next(new CustomError("Invalid credentials", 404));
  }

  res.json({ message: "User logged in" });
};

// ================================================================================================================== //
// ================================================================================================================== //

const deleteUser = (req, res, next) => {
  const id = req.params.uid;

  if (!DUMMY_USERS.find((user) => user.id === id)) {
    return next(new CustomError("Could not find user with that id", 404));
  }

  DUMMY_USERS = DUMMY_USERS.filter((user) => user.id !== id);

  console.log(DUMMY_USERS);
  res.json({ message: "Deleted user" });
};

// ================================================================================================================== //
// ===================================================== EXPORTS ==================================================== //
// ================================================================================================================== //

exports.signup = signup;

exports.login = login;

exports.deleteUser = deleteUser;
