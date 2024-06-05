const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  verifyEmailToken,
  recoverPassword,
  verifyRecoveringPage,
  recoverVerifiedPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.get("/users/:id/verify/:token", verifyEmailToken);
router.get("/users/:email/recover-password", recoverPassword);
router.get("/users/recover-password/:id/:token", verifyRecoveringPage);
router.post("/users/recover-password/:id", recoverVerifiedPassword);

module.exports = router;
