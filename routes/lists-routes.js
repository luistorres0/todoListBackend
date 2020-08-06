const express = require("express");
const { createList, getList, updateList, deleteList } = require("./controllers/lists-controllers");

const router = express.Router();

router.post("/", createList);

router.get("/:id", getList);

router.patch("/:id", updateList);

router.delete("/:id", deleteList);

module.exports = router;
