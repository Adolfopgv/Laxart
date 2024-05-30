const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  updateAddresses,
  getShippingAddress,
} = require("../controllers/userController");

router.use(
  cors({
    credentials: true,
    origin: `${process.env.BASE_URL}`,
  })
);

router.post("/users/:id/update-addresses", updateAddresses);
router.get("/users/:id/shipping-details", getShippingAddress);

module.exports = router;
