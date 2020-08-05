const express = require("express");
const { createList } = require("./controllers/lists-controllers");

const router = express.Router();

router.post("/", createList);


module.exports = router;
