const express = require("express");
const router = express.Router();
const {
  updateAddresses,
  getShippingAddress,
  getUser,
  getAllUsers,
  changeUserAvatar,
  changeUsername,
  changePassword,
  deleteUser,
} = require("../controllers/userController");

router.post("/users/:id/update-addresses", updateAddresses);
router.get("/users/:id/shipping-details", getShippingAddress);
router.get("/users/:id", getUser);
router.get("/users", getAllUsers);
router.post("/users/:id/change-avatar", changeUserAvatar);
router.post("/users/:id/change-username", changeUsername);
router.post("/users/:id/change-password", changePassword);
router.delete("/users/delete-user/:id", deleteUser);

module.exports = router;
