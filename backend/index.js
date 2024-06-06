const express = require("express");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}
const cors = require("cors");
const db = require("./helpers/db"); // Database connection
const cookieParser = require("cookie-parser");
const app = express();
app.disable("x-powered-by");
const bodyParser = require("body-parser");
const path = require('path');

app.use(
  cors({
    credentials: true,
    origin: [process.env.NODE_ENV !== "production" ? "http://localhost:5173" : process.env.BASE_URL],
    methods: ["POST", "GET", "DELETE"],
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

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
