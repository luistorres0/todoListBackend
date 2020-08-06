const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const listsRoutes = require("./routes/lists-routes");
const CustomError = require("./models/custom-error");

const app = express();

app.use(bodyParser.json());
app.use("/api/users", usersRoutes);
app.use("/api/lists", listsRoutes);

// Catch non-supported routes.
app.use((req, res, next) => {
  next(new CustomError("Could not find route", 404));
});

// Custom error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred." });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
