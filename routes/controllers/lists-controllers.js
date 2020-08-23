// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Local
const CustomError = require("../../models/custom-error");
const List = require("../../models/list");
const User = require("../../models/user");

// ================================================================================================================== //
// ====================================== CONTROLLER FUNCTIONS FOR LISTS ROUTES ===================================== //
// ================================================================================================================== //

const createList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const { authorId, title, list } = req.body;
  const newList = new List({
    authorId,
    title,
    list,
  });

  let user;
  try {
    user = await User.findById(authorId);
  } catch (err) {
    return next(new CustomError("Failed to create list, please try again later.", 500));
  }

  if (!user) {
    return next(new CustomError("Could not find user with provided author ID.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newList.save({ session: sess });
    user.lists.push(newList);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new CustomError("Failed to add new list to database.", 500));
  }

  res.json({ list: newList.toObject({ getters: true }) });
};

// ================================================================================================================== //
// ================================================================================================================== //

const getListById = async (req, res, next) => {
  const id = req.params.id;

  let foundList;
  try {
    foundList = await List.findById(id);
  } catch (err) {
    return next(new CustomError("Failed to get list, please try again.", 500));
  }

  if (!foundList) {
    return next(new CustomError("Could not find list with that ID.", 404));
  }

  if (foundList.authorId.toString() !== req.userData.userId) {
    return next(new CustomError("You are not authorized to access this resource.", 403));
  }

  // Convert "foundList" to JS object. "getters: true" sets _id property to id.
  res.json(foundList.toObject({ getters: true }));
};

// ================================================================================================================== //
// ================================================================================================================== //

const getListsByAuthorId = async (req, res, next) => {
  const authorId = req.params.authorId;

  if (authorId !== req.userData.userId) {
    return next(new CustomError("You are not authorized to access this resource.", 403));
  }

  let foundLists;
  try {
    foundLists = await List.find({ authorId: authorId });
  } catch (err) {
    return next(new CustomError("Failed to retrieve lists, please try again", 500));
  }

  if (!foundLists || foundLists.length === 0) {
    return next(new CustomError("Could not find any lists for that authorId.", 404));
  }

  res.json(foundLists.map((list) => list.toObject({ getters: true })));
};

// ================================================================================================================== //
// ================================================================================================================== //

const updateList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const id = req.params.id;
  const { newList } = req.body;

  let foundList;
  try {
    foundList = await List.findById(id);
  } catch (err) {
    return next(new CustomError("Failed to get list, please try again.", 500));
  }

  if (!foundList) {
    return next(new CustomError("Could not find a list for that ID.", 404));
  }

  if (foundList.authorId.toString() !== req.userData.userId) {
    return next(new CustomError("You are not authorized to access this resource.", 403));
  }

  foundList.list = [...newList];

  try {
    await foundList.save();
  } catch (err) {
    return next(new CustomError("Failed to complete list update, please try again", 500));
  }

  res.status(200).json(foundList.toObject({ getters: true }));
};

// ================================================================================================================== //
// ================================================================================================================== //

const deleteList = async (req, res, next) => {
  const id = req.params.id;

  let foundList;
  try {
    foundList = await List.findById(id).populate("authorId");
  } catch (err) {
    return next(new CustomError("Failed to delete list, please try again.", 500));
  }

  if (!foundList) {
    return next(new CustomError("Could not find list for that ID.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await foundList.remove({ session: sess });
    foundList.authorId.lists.pull(foundList);
    await foundList.authorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new CustomError("Could not complete list deletion, please try again.", 500));
  }

  res.status(200).json({ message: "Deleted list" });
};

// ================================================================================================================== //
// ===================================================== EXPORTS ==================================================== //
// ================================================================================================================== //

exports.createList = createList;

exports.getListById = getListById;

exports.getListsByAuthorId = getListsByAuthorId;

exports.updateList = updateList;

exports.deleteList = deleteList;
