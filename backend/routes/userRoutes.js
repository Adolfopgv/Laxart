const express = require("express");
const router = express.Router();
const {
  updateAddresses,
  getShippingAddress,
  getUser,
} = require("../controllers/userController");

router.post("/users/:id/update-addresses", updateAddresses);
router.get("/users/:id/shipping-details", getShippingAddress);
router.get("/users/:id", getUser)

module.exports = router;
