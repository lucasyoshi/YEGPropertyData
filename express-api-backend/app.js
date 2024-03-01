var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var propertiesRouter = require("./routes/properties");
var authRouter = require("./middleware/auth");
var loginRouter = require("./routes/login");

// Load the dotenv package
require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/properties", propertiesRouter);
app.use("/auth", authRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error Page",
    message: "An error occurred",
    error: err,
  });
});
// Step 2: Import the mssql package
const sql = require("mssql");

// Step 3: Create a configuration object
const config = {
  user: "user2015",
  password: "Password2015",
  server: "localhost", // You can use a domain name or IP address
  database: "DMIT2015CourseDB",
  options: {
    encrypt: true,
    trustServerCertificate: true, // Use this if you're on Windows Azure
  },
};

// Step 4: Connect to your database
sql
  .connect(config)
  .then((pool) => {
    // If the connection is successful, log a success message
    if (pool) {
      console.log("Database connection successful");
    }
  })
  .catch((err) => {
    // If there's an error, log it
    console.error("Database connection failed", err);
  });

module.exports = app;
