const { v4: uuid } = require("uuid");
const CustomError = require("../../models/custom-error");

const DUMMY_USERS = [
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

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  const newUser = {
    id: uuid(),
    email,
    password,
  };

  DUMMY_USERS.push(newUser);
  console.log(DUMMY_USERS);
  res.json({ message: "User created." });
};

const authenticateUser = (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = DUMMY_USERS.find((user) => user.email === email);
  let isAuthenticated = false;
  if(foundUser) {
    if(foundUser.password === password) {
        isAuthenticated = true;
    }
  } else {
      return next(new CustomError("Could not find user", 404))
  }
  res.json({ authenticated: isAuthenticated });
};

exports.createUser = createUser;
exports.authenticateUser = authenticateUser;
