const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middlewares/auth");
const {
  getNotifications,
  createNotification,
  getProfile
} = require("../Controllers/userController");

router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
