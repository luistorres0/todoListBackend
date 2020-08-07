// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

// Local
const CustomError = require("../../models/custom-error");

// ================================================================================================================== //
// ============================================= DUMMY DATA FOR TESTING ============================================= //
// ================================================================================================================== //

let DUMMY_LISTS = [
  {
    id: "2342342",
    authorId: "u1",
    title: "today",
    list: ["work", "eat", "sleep"],
  },
  {
    id: "342342",
    authorId: "u2",
    title: "workout",
    list: ["pushups", "pullups", "situps"],
  },
];

// ================================================================================================================== //
// ====================================== CONTROLLER FUNCTIONS FOR LISTS ROUTES ===================================== //
// ================================================================================================================== //

const createList = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const { authorId, title, list } = req.body;
  const newList = {
    id: uuid(),
    authorId,
    title,
    list,
  };

  DUMMY_LISTS.push(newList);
  console.log(DUMMY_LISTS);

  res.json(newList);
};

// ================================================================================================================== //
// ================================================================================================================== //

const getList = (req, res, next) => {
  const id = req.params.id;
  const foundList = DUMMY_LISTS.find((item) => item.id === id);
  if (!foundList) {
    return next(new CustomError("Could not find list for that ID", 404));
  }

  res.json(foundList);
};

// ================================================================================================================== //
// ================================================================================================================== //

const updateList = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs passed, please check your data.", 422));
  }

  const id = req.params.id;
  const { newList } = req.body;

  const listIndex = DUMMY_LISTS.findIndex((item) => item.id === id);

  DUMMY_LISTS[listIndex].list = newList;

  console.log(DUMMY_LISTS);
  res.status(200).json({ message: "Updated list" });
};

// ================================================================================================================== //
// ================================================================================================================== //

const deleteList = (req, res, next) => {
  const id = req.params.id;

  DUMMY_LISTS = DUMMY_LISTS.filter((item) => item.id !== id);

  console.log(DUMMY_LISTS);

  res.status(200).json({ message: "Deleted list" });
};

// ================================================================================================================== //
// ===================================================== EXPORTS ==================================================== //
// ================================================================================================================== //

exports.createList = createList;

exports.getList = getList;

exports.updateList = updateList;

exports.deleteList = deleteList;
