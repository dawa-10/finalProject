const express = require("express");
const router = express.Router();
const { createUser, login } = require("../Controllers/authController");

router.post("/create-user", createUser);
router.post("/login", login);

module.exports = router;
