const CustomError = require("../../models/custom-error");

const DUMMY_LISTS = [
  {
    id: "2342342",
    title: "today",
    list: ["work", "eat", "sleep"],
  },
  {
    id: "342342",
    title: "workout",
    list: ["pushups", "pullups", "situps"],
  },
];

const createList = (req, res, next) => {
  const { id, title, list } = req.body;
  const newList = {
    id,
    title,
    list,
  };

  DUMMY_LISTS.push(newList);
  res.json(newList);
};

const getList = (req, res, next) => {
  const listId = req.params.id;
  const foundList = DUMMY_LISTS.find((item) => item.id === listId);
  if (!foundList) {
    return next(new CustomError("Could not find list for that ID", 404));
  }

  res.json(foundList);
};

exports.createList = createList;
exports.getList = getList;
