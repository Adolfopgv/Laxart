const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
require("./helpers/db"); // Database connection
const cookieParser = require("cookie-parser");
const app = express();
app.disable("x-powered-by");
const bodyParser = require("body-parser");

// middleware
app.use(cookieParser());
app.use(express.urlencoded({ extend: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/productsRoutes"));

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
