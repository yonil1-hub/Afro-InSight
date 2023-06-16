const User = require("../models/Model").User;
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!(await User.findById(decoded.id))) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = decoded;
    req.user.token = token;
    next();
  }
};
