const express = require("express");

const { authRateLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.post("/login", authRateLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented" });
});

router.post("/register", authRateLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented" });
});

router.post("/forgot-password", authRateLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented" });
});

router.post("/reset-password", authRateLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented" });
});

router.post("/verify-otp", authRateLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented" });
});

module.exports = router;
