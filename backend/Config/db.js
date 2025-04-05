const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to DB", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
