const express = require("express")

const router = express.Router();

router.post("/signup", (req, res, next) => {
    res.json({message: "User signed up."})
})

module.exports = router;