const express = require("express");
const connectDB = require("./utils/connectDB");
require("dotenv").config();
require("express-async-errors");
const mainRouter = require("./routes/main");
const { error404 } = require("./middlewares/error404");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", mainRouter);
app.use(errorHandler);
app.use(error404);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port: http://localhost:${port}`);
});
