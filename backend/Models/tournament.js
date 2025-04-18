const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  tournamentName: String, 
  winner: String,
  date: String,
  prizePool: String,
  tournamentLink: String,
  type: String,
});

const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
