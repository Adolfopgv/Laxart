const express = require("express");
const router = express.Router();
const {
  uploadProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  getProductsByQuery,
} = require("../controllers/productsController");

router.post("/upload-product", uploadProduct);
router.get("/get-products", getProducts);
router.delete("/delete-product/:id", deleteProduct);
router.post("/update-product/:id", updateProduct);
router.get("/get-product/:id", getProductById);
router.get("/get-products-by-query", getProductsByQuery);

module.exports = router;
