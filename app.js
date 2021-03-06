// ================================================================================================================== //
// ================================================== DEPENDENCIES ================================================== //
// ================================================================================================================== //

// External
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Local
const usersRoutes = require("./routes/users-routes");
const listsRoutes = require("./routes/lists-routes");
const CustomError = require("./models/custom-error");

// ================================================================================================================== //
// =================================================== ROUTE SETUP ================================================== //
// ================================================================================================================== //

const app = express();

app.use(bodyParser.json());

// Set up headers for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

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

// ================================================================================================================== //
// ===================================== DATABASE CONNECTION AND SERVER START UP ==================================== //
// ================================================================================================================== //

const port = process.env.PORT || 5001;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.clhvc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
