const express = require("express");
const router = express.Router();
const {
  checkoutOrder,
  registerOrder,
  getOrders,
} = require("../controllers/orderController");

router.post("/checkout-order", checkoutOrder);
router.post("/register-order/:userid", registerOrder);
router.get("/get-orders", getOrders);

module.exports = router;
