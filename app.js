const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const listsRoutes = require("./routes/lists-routes");

const app = express();
app.use(bodyParser.json());
app.use("/api/users", usersRoutes);
app.use("/api/lists", listsRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
