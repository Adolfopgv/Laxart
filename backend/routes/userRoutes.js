const express = require("express");
const router = express.Router();
const {
  updateAddresses,
  getShippingAddress,
  getUser,
  getAllUsers,
} = require("../controllers/userController");

router.post("/users/:id/update-addresses", updateAddresses);
router.get("/users/:id/shipping-details", getShippingAddress);
router.get("/users/:id", getUser);
router.get("/users", getAllUsers);

module.exports = router;
