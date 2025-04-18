const mongoose = require("mongoose");

const OngoingTournamentSchema = new mongoose.Schema({
  leagueInfo: {
    name: String,
   
  },
  matches: {
    dates: [Date],
    gamesPerDay: Number
  },
  standings: [
    {
      rank: Number,
      team: String,
      totalPoints: Number,
      games: [Number]
    }
  ]
}, { collection: "ongoing" }); 

module.exports = mongoose.model("OngoingTournament", OngoingTournamentSchema);
