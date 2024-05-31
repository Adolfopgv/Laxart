const express = require("express");
const router = express.Router();
const { checkoutOrder } = require("../controllers/checkoutController");

router.post("/checkout", checkoutOrder);

module.exports = router;
