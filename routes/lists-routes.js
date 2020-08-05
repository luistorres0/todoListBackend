const express = require("express");
const { createList, getList } = require("./controllers/lists-controllers");

const router = express.Router();

router.post("/", createList);

router.get("/:id", getList);

module.exports = router;
