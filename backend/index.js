const express = require("express");

process.env.NODE_ENV !== "production" &&
  require("dotenv").config({ path: __dirname + "/.env" });

const cors = require("cors");

process.env.NODE_ENV !== "test" && require("./helpers/db");

const cookieParser = require("cookie-parser");
const app = express();
app.disable("x-powered-by");
const bodyParser = require("body-parser");
const path = require("path");

app.use(
  cors({
    origin: [
      process.env.NODE_ENV !== "production"
        ? "http://localhost:5173"
        : process.env.BASE_URL,
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// middleware
app.use(cookieParser());
app.use(express.urlencoded({ extend: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/productsRoutes"));
app.use("/", require("./routes/cartRoutes"));
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/orderRoutes"));

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`)
  );
}

module.exports = { app };
