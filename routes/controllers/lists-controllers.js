// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

// Local
const CustomError = require("../../models/custom-error");
const List = require("../../models/list");

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

  try {
    await newList.save();
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

  // Convert "foundList" to JS object. "getters: true" sets _id property to id.
  res.json(foundList.toObject({ getters: true }));
};

// ================================================================================================================== //
// ================================================================================================================== //

const getListsByAuthorId = async (req, res, next) => {
  const authorId = req.params.authorId;

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
    foundList = await List.findById(id);
  } catch (err) {
    return next(new CustomError("Could not find list, please try again.", 500));
  }

  try {
    await foundList.remove();
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
