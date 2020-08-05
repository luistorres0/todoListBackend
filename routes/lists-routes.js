const express = require("express");

const router = express.Router();

router.post("/", (req, res, next) => {
  res.json({ message: "List created." });
});

module.exports = router;
