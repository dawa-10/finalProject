const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followedTournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }],
});

module.exports = mongoose.model("user", UserSchema);
