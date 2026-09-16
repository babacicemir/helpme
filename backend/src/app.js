const dotenv = require("dotenv");
dotenv.config(); 

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { createDatabaseConnection } = require("./config/database");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

createDatabaseConnection()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

module.exports = { app };