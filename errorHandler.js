const { constants } = require("./constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || constants.SERVER_ERROR;

  if (res.headersSent) {
    return next(err);
  }

  const response = {
    title: "Error",
    message: err.message,
    stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
  };

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      response.title = "Validation Failed";
      break;
    case constants.NOT_FOUND:
      response.title = "Not Found";
      break;
    case constants.UNAUTHORIZED:
      response.title = "Unauthorized";
      break;
    case constants.FORBIDDEN:
      response.title = "Forbidden";
      break;
    case constants.SERVER_ERROR:
      response.title = "Server Error";
      break;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
