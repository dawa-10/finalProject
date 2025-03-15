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
const puppeteer = require("puppeteer");

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

// Create User Route
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

// Login Route
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

// Scraping Route for Recent Tournaments
server.get("/api/recent-tournaments", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://liquipedia.net/pubgmobile/Recent_Tournament_Results", {
      waitUntil: "domcontentloaded",
    });

    const recentTournaments = await page.$$(".gridTable > div");
    const tournamentsData = [];

    for (const tournament of recentTournaments) {
      const tournamentElement = await tournament.$(".gridCell.Tournament.Header > a");
      const tournamentName = tournamentElement
        ? await page.evaluate(el => el.textContent.trim(), tournamentElement)
        : "Unknown Tournament";

      if (!tournamentName) continue;

      const tournamentLink = tournamentElement
        ? await page.evaluate(el => el.href, tournamentElement)
        : "No link available";

      let winner = "No winner listed";
      try {
        const winnerElement = await tournament.$(".gridCell.Placement.FirstPlace > span.Participants > div > span.name > a");
        winner = winnerElement ? await page.evaluate(el => el.textContent.trim(), winnerElement) : "No winner listed";
      } catch (err) {}

      let date = "Unknown date";
      try {
        const dateElement = await tournament.$(".gridCell.EventDetails.Date.Header");
        date = dateElement ? await page.evaluate(el => el.textContent.trim(), dateElement) : "Unknown date";
      } catch (err) {}

      let prizePool = "Unknown prize pool";
      try {
        const prizeElement = await tournament.$(".gridCell.EventDetails.Prize.Header");
        prizePool = prizeElement ? await page.evaluate(el => el.textContent.trim(), prizeElement) : "Unknown prize pool";
      } catch (err) {}

      tournamentsData.push({
        tournamentName,
        winner,
        date,
        prizePool,
        tournamentLink
      });
    }

    await browser.close();
    res.json(tournamentsData); // Send the scraped data to the frontend
  } catch (error) {
    res.status(500).json({ error: "Error scraping data" });
  }
});




// Endpoint to fetch upcoming tournaments
server.get("/api/upcoming-tournaments", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://liquipedia.net/pubgmobile/Portal:Tournaments#Qualifier", {
      waitUntil: "domcontentloaded",
    });

    // Select the upcoming tournaments list using the CSS selector
    const upcomingTournaments = await page.$$(
      "#tournaments-menu-upcoming > li"
    );

    const tournamentsData = [];

    for (const tournament of upcomingTournaments) {
      // Extract the tournament name and link
      const tournamentElement = await tournament.$("a");
      const tournamentName = tournamentElement
        ? await page.evaluate(el => el.textContent.trim(), tournamentElement)
        : "Unknown Tournament";

      const tournamentLink = tournamentElement
        ? await page.evaluate(el => el.href, tournamentElement)
        : "No link available";

      tournamentsData.push({
        tournamentName,
        tournamentLink,
      });
    }

    await browser.close();
    res.json(tournamentsData); // Send the scraped upcoming tournaments data to the frontend
  } catch (error) {
    res.status(500).json({ error: "Error scraping upcoming tournaments" });
  }
});

server.get("/api/ongoing-tournaments", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://liquipedia.net/pubgmobile/Portal:Tournaments", {
      waitUntil: "domcontentloaded",
    });

    // Select the ongoing tournaments
    const ongoingTournaments = await page.$$("#tournaments-menu-ongoing > li > a");

    const tournamentsData = [];

    for (const tournament of ongoingTournaments) {
      const tournamentName = await page.evaluate(el => el.textContent.trim(), tournament);
      const tournamentLink = await page.evaluate(el => el.href, tournament);

      tournamentsData.push({
        tournamentName,
        tournamentLink,
      });
    }

    await browser.close();
    res.json(tournamentsData); // Send the scraped ongoing tournaments to the frontend
  } catch (error) {
    res.status(500).json({ error: "Error scraping ongoing tournaments" });
  }
});
