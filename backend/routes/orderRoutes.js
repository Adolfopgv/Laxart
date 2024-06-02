const express = require("express");
const router = express.Router();
const {
  checkoutOrder,
  registerOrder,
} = require("../controllers/orderController");

router.post("/checkout-order", checkoutOrder);
router.post("/register-order/:userid", registerOrder);

module.exports = router;
