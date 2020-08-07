const express = require("express");
const { signup, login, deleteUser } = require("./controllers/users.controllers");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.delete("/:uid", deleteUser);

module.exports = router;
