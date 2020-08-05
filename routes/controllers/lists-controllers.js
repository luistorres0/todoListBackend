const DUMMY_LISTS = [
  {
    id: 2342342,
    title: "today",
    list: ["work", "eat", "sleep"],
  },
  {
    id: 342342,
    title: "workout",
    list: ["pushups", "pullups", "situps"],
  }
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

exports.createList = createList;
