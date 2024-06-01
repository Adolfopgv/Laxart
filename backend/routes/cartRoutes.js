const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, getCartProducts, removeAllProducts } = require("../controllers/cartController")

router.post("/add-to-cart/:userid/:product", addToCart);
router.delete("/remove-from-cart/:userid/:product", removeFromCart)
router.get("/get-cart-products/:userid", getCartProducts)
router.delete("/remove-all-cart/:userid", removeAllProducts)

module.exports = router