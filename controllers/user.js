const User = require("../models/Model").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Create a new user
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - response object
 * @throws {Error} - error
 * @example
 */

exports.createUser = async (req, res) => {
  const { username, email, password, type } = req.body;

  if (!username || !email || !password || !type) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res
      .status(400)
      .json({ message: "User with this username already exists" });
  }

  const newUser = await User.create({ username, email, password, type });
  res.status(201).json({ message: "User created", data: newUser });
};

/**
 * Generate a new token for a user
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - response object
 * @throws {Error} - error
 */

exports.generateToken = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const acccessToken = jwt.sign(
    {
      email: user.email,
      username: user.username,
      id: user._id,
      type: user.type,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.status(200).json({
    message: "User logged in",
    acccessToken,
  });
};
