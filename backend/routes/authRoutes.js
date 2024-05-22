const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  verifyEmailToken,
} = require("../controllers/authController");

router.use(
  cors({
    credentials: true,
    origin: `${process.env.BASE_URL}`,
  })
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.get("/users/:id/verify/:token", verifyEmailToken);

module.exports = router;
