const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./Config/db");
const authRoutes = require("./Routes/authRoutes");
const tournamentRoutes = require("./Routes/tournamentRoutes");
const userRoutes = require("./Routes/userRoutes");
const { errorHandler } = require("./Middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Make io available to our controllers via app locals
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/users", userRoutes);

// Simple root route
app.get("/", (req, res) => {
  res.send("LIVE!");
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed", error);
  });


  const Tournament = require('./Models/tournament');

// Setup change stream on Tournament collection
const changeStream = Tournament.watch();

changeStream.on('change', (change) => {
  if (change.operationType === 'insert') {
    const newTournament = change.fullDocument;
    console.log('New Tournament Added:', newTournament);

    // Notify connected clients via Socket.IO
    io.emit('newTournament', newTournament);
  }
});
