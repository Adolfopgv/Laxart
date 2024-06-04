const { mongoose } = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "ecommerceDB",
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database not connected", err));