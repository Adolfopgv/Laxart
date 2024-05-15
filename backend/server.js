const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
require("./helpers/db"); // Database connection
const cookieParser = require("cookie-parser");
const app = express();
app.disable("x-powered-by");

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extend: false }));

app.use("/", require("./routes/authRoutes"));

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
