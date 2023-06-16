const express = require("express");
const userRouter = require("./users");
const siteRouter = require("./sites");

const mainRouter = express.Router();
mainRouter.use("/user", userRouter);
mainRouter.use("/sites", siteRouter);

module.exports = mainRouter;
