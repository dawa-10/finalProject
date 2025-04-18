const mongoose = require("mongoose");
const standingsSchema = new mongoose.Schema({
    tier: String,
    tournament: { type: String, required: true, unique: true },
    stage: String,
    url: String,
    standings: [{
      rank: Number,
      teamName: String,
      total: Number
    }],
    mvp: {
      playerName: String,
      team: String,
      country: String
    }
  });
  const Standings = mongoose.model('Standings', standingsSchema);
  module.exports = Standings;