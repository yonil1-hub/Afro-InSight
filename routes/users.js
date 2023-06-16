const express = require("express");

const { createUser, generateToken } = require("../controllers/user");
const userRouter = express.Router();
const { hashPassword } = require("../middlewares/password_hasher");
userRouter.post("/register", hashPassword, createUser);
userRouter.post("/login", generateToken);

module.exports = userRouter;
