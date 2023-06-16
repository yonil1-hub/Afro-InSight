const User = require("../models/Model").User;

exports.isUser = async (req, res, next) => {
  const { id, type } = req.user;

  if (type === "user") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Admins are not allowed to perform this action" });
  }
};

exports.isAdmin = async (req, res, next) => {
  const { id } = req.user;
  const user = User.findById(id);

  if (user.type === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Users are not allowed to perform this action" });
  }
};
