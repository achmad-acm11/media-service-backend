require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var mediaRouter = require("./routes/medias");
const { apiResponse } = require("./responses/apiResponse");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/media", mediaRouter);

// catch 404 routes and forward to error handler
app.use(function (req, res, next) {
  const response = apiResponse("Not Found", "error", 404, {
    message: "API Endpoint Not Found",
  });
  return res.sendStatus(404, "application/json", response);
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  const response = apiResponse("Internal Server Error", "error", 500, {
    message: "Something went wrong !",
  });

  res.sendStatus(500, "application/json", response);
});

// Default Response
app.response.sendStatus = function (statusCode, type, message) {
  this.contentType(type).status(statusCode).send(message);
};

module.exports = app;
