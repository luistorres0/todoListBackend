const express = require("express");

const { createUser, authenticateUser } = require("./controllers/users.controllers");

const router = express.Router();

router.post("/signup", createUser);

router.get("/auth", authenticateUser);

module.exports = router;
