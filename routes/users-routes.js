const express = require("express");

const { createUser } = require("./controllers/users.controllers");

const router = express.Router();

router.post("/signup", createUser);

module.exports = router;
