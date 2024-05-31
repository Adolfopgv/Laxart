const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, getCartProducts } = require("../controllers/cartController")

router.post("/add-to-cart/:userid/:product", addToCart);
router.delete("/remove-from-cart/:userid/:product", removeFromCart)
router.get("/get-cart-products/:userid", getCartProducts)

module.exports = router