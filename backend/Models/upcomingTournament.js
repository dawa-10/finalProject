const mongoose = require("mongoose");

const upcomingTournamentSchema = new mongoose.Schema({
  tournament_name: { type: String, required: true },
  league_information: { type: String },
  organizers: { type: Array },
  game_version: String,
  game_mode: String,
  type: String,
  location: String, 
  prize_pool: String,
  start_date: String,
  end_date: String,
  liquipedia_tier: String
}, { 
  collection: "upcoming" 
});

module.exports = mongoose.model("UpcomingTournament", upcomingTournamentSchema);