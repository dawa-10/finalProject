// routes/tournamentRoutes.js
const express = require("express");
const router = express.Router();
const { 
  getRecentTournaments,
  getUpcomingTournaments,
  getOngoingTournaments,
  followTournament
} = require("../Controllers/tournamentController");

const { verifyToken } = require("../Middlewares/auth");

// Scraping endpoints (these may remain public)
router.get("/recent", getRecentTournaments);
router.get("/upcoming", getUpcomingTournaments);
router.get("/ongoing", getOngoingTournaments);

// Protected follow endpoint
router.post("/follow", verifyToken, followTournament);

module.exports = router;
