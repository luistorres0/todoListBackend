const jwt = require("jsonwebtoken");

const CustomError = require("../models/custom-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed.");
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    next();
  } catch (err) {
    return next(new CustomError("Authentication failed.", 401));
  }
};
