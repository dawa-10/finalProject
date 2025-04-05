const mongoose = require("mongoose");
require("dotenv").config();
const Tournament = require("./Models/tournament")
const { connectDB } = require("./Config/db");

(async () => {
  try {
    // Connect to the DB
    await connectDB();

    // Create a test tournament document
    const testTournament = new Tournament({
      tournamentName: "Manual Test Tournament",
      winner: "Test Winner",
      date: "April 4, 2025",
      prizePool: "$1000",
      tournamentLink: "https://example.com",
      type: "recent"
    });

    // Save the document
    const saved = await testTournament.save();
    console.log("Test tournament saved:", saved);
  } catch (error) {
    console.error("Error saving test tournament:", error);
  } finally {
    // Close the DB connection
    mongoose.connection.close();
  }
})();
