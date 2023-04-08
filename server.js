const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");

const { DB_HOST } = process.env;
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
