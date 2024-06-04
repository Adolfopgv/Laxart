const express = require("express");
const router = express.Router();
const {
  checkoutOrder,
  registerOrder,
  getOrders,
  changeOrderState,
} = require("../controllers/orderController");

router.post("/checkout-order", checkoutOrder);
router.post("/register-order", registerOrder);
router.get("/get-orders", getOrders);
router.post("/change-order-state/:orderid", changeOrderState);

module.exports = router;
