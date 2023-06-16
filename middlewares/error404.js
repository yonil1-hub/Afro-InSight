exports.error404 = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "The requested resource could not be found",
  });
};
