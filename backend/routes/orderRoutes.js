const express = require("express");
const router = express.Router();
const {
  checkoutOrder,
  registerOrder,
  getOrders,
  changeOrderState,
  getOrderByUser,
} = require("../controllers/orderController");

router.post("/checkout-order", checkoutOrder);
router.post("/register-order", registerOrder);
router.get("/get-orders", getOrders);
router.post("/change-order-state/:orderid", changeOrderState);
router.get("/get-orders/:userid", getOrderByUser);

module.exports = router;
