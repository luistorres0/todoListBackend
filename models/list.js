const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: { type: String, required: true },
  authorId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  list: { type: Array, required: true },
});

module.exports = mongoose.model("List", listSchema);
