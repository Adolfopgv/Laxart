const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  uploadProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
} = require("../controllers/productsController");

router.use(
  cors({
    credentials: true,
    origin: `${process.env.BASE_URL}`,
  })
);

router.post("/upload-product", uploadProduct);
router.get("/get-products", getProducts);
router.delete("/delete-product/:id", deleteProduct);
router.post("/update-product/:id", updateProduct);
router.get("/get-product/:id", getProductById);

module.exports = router;
