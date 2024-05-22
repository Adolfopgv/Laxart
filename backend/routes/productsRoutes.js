const express = require("express");
const router = express.Router();
const cors = require("cors");
const {uploadProduct} = require("../controllers/productsController");

router.use(
    cors({
      credentials: true,
      origin: `${process.env.BASE_URL}`,
    })
  );

  router.post("/uploadProduct", uploadProduct);

  module.exports = router;