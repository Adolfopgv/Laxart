const express = require("express");
const router = express.Router();
const {
  updateAddresses,
  getShippingAddress,
} = require("../controllers/userController");

router.post("/users/:id/update-addresses", updateAddresses);
router.get("/users/:id/shipping-details", getShippingAddress);

module.exports = router;
