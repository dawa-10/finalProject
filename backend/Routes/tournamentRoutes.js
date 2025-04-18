// routes/tournamentRoutes.js
const express = require("express");
const router = express.Router();
const { 
  getRecentTournaments,
  getUpcomingTournaments,
  getOngoingTournaments,
  getStandings,
  followTournament,
  getTournamentStandings,
  deleteTournament,
  getTournamentById,
  getUpcomingTournamentByName,
  getOngoingTournamentByName
} = require("../Controllers/tournamentController");


const { verifyToken } = require("../Middlewares/auth");


router.delete("/:tournamentId", verifyToken, deleteTournament);
router.get("/recent", getRecentTournaments);
router.get("/upcoming", getUpcomingTournaments);
router.get("/upcoming/:tournamentName", getUpcomingTournamentByName);
router.get("/ongoing", getOngoingTournaments);
router.get("/standings", getStandings);
router.get('/standings/:tournamentName', getTournamentStandings);
router.post("/follow", verifyToken, followTournament);
router.get("/:id", getTournamentById);
router.get("/ongoing/:tournamentName", getOngoingTournamentByName);

module.exports = router;
