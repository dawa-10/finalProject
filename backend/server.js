const express = require("express");
const server = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Models/user");
require("dotenv").config();
const { DB_URI, JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Connected to DB\nServer is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

server.get("/", (request, response) => {
  response.send("LIVE!");
});





server.post("/create-user", async (request, response) => {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    await newUser
      .save()
      .then((result) =>
        response.send(`Congrats! created username ${username}`)
      );
  } catch (error) {
    response.send(`Cannot add user: error ${error.message}`);
  }
});

server.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const jwtToken = jwt.sign({ id: username }, JWT_SECRET);

  const user = await User.findOne({ username }).then((user) => {
    if (!user) {
      return response.send({ message: "Username not found" });
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        return response.send({ message: "An error occured" });
      }
      if (result) {
        return response.send({
          message: "User authenticated",
          token: jwtToken,
        });
      } else {
        return response.send("Incorrect username or password");
      }
    });
  });
});