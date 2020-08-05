const { v4: uuid } = require("uuid");

const DUMMY_USERS = [];

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  const newUser = {
    id: uuid(),
    email,
    password,
  };

  DUMMY_USERS.push(newUser);
  console.log(DUMMY_USERS);
  res.json({message: "User created."});
};

exports.createUser = createUser;
