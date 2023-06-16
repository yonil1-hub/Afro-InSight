exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const path = Object.keys(err.errors)[0];
    const kind = err.errors[path].kind;

    if (kind === "required") {
      res.status(400).json({
        success: false,
        message: `${err.name}: The field ${path} is required`,
      });
    } else if (kind === "minlength") {
      res.status(400).json({
        success: false,
        message: `${err.name}: The minimum length error for ${path}`,
      });
    } else if (kind === "maxlength") {
      res.status(400).json({
        success: false,
        message: `The maximum allowed length error for ${path}`,
      });
    } else if (kind === "regexp") {
      const field = Object.keys(err.errors)[0];
      res.status(400).json({
        success: false,
        message: `Invalid value for ${field}: ${err.errors[field].value}`,
      });
    }
  } else if (err.code === 11000) {
    console.log(err.name);
    const keyValue = Object.keys(err.keyValue)[0];
    res.status(409).json({
      success: false,
      message: `Duplicate Key of ${keyValue}: ${err.keyValue[keyValue]}`,
    });
  } else if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid resource id",
    });
  } else if (err.message.includes("not found")) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  } else if (err.name === "MongoError") {
    res.status(500).json({
      success: false,
      message: "There was an error connecting to the database",
    });
  } else if (err.type === "custom") {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
  } else if (err.name === "JsonWebTokenError") {
    res.status(400).json({
      success: false,
      message: "Invalid token signature",
    });
  } else if (err.name === "TokenExpiredError") {
    res.status(400).json({
      success: false,
      message:
        "Your access Token is expired, please Login and generate new Access Token",
    });
  } else if (
    err.message ===
    `Cannot read properties of undefined (reading 'accessToken')`
  ) {
    res.status(400).json({
      success: false,
      message:
        "Missing Access Token: please provide access token either on Auth Header or Cookie",
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error" + err.message,
    });
  }
};
