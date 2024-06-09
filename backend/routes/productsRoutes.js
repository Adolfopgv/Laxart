const express = require("express");
const router = express.Router();
const {
  uploadProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  getProductsByQuery,
  addReview,
  getReviews,
} = require("../controllers/productsController");

router.post("/upload-product", uploadProduct);
router.get("/get-products", getProducts);
router.delete("/delete-product/:id", deleteProduct);
router.post("/update-product/:id", updateProduct);
router.get("/get-product/:id", getProductById);
router.get("/get-products-by-query", getProductsByQuery);
router.post("/add-review/:userid/:productid", addReview);
router.get("/get-reviews/:productid", getReviews);

module.exports = router;
