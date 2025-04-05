const { launchBrowser } = require("../utils/scraper");
const Tournament = require("../models/tournament");

exports.getRecentTournaments = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.goto("https://liquipedia.net/pubgmobile/Recent_Tournament_Results", {
      waitUntil: "domcontentloaded",
    });
    
    // Wait for the grid table to load
    await page.waitForSelector(".gridTable");
    
    const recentTournaments = await page.$$(".gridTable > div");
    console.log("Found recent tournaments:", recentTournaments.length);
    
    const tournamentsData = [];
    
    for (const tournament of recentTournaments) {
      const tournamentElement = await tournament.$(".gridCell.Tournament.Header > a");
      const tournamentName = tournamentElement
        ? await page.evaluate((el) => el.textContent.trim(), tournamentElement)
        : "Unknown Tournament";
      if (!tournamentName) continue;
    
      const tournamentLink = tournamentElement
        ? await page.evaluate((el) => el.href, tournamentElement)
        : "No link available";
    
      let winner = "No winner listed";
      try {
        const winnerElement = await tournament.$(
          ".gridCell.Placement.FirstPlace > span.Participants > div > span.name > a"
        );
        winner = winnerElement
          ? await page.evaluate((el) => el.textContent.trim(), winnerElement)
          : "No winner listed";
      } catch (err) {
        console.error("Error scraping winner:", err);
      }
    
      let date = "Unknown date";
      try {
        const dateElement = await tournament.$(".gridCell.EventDetails.Date.Header");
        date = dateElement
          ? await page.evaluate((el) => el.textContent.trim(), dateElement)
          : "Unknown date";
      } catch (err) {}
    
      let prizePool = "Unknown prize pool";
      try {
        const prizeElement = await tournament.$(".gridCell.EventDetails.Prize.Header");
        prizePool = prizeElement
          ? await page.evaluate((el) => el.textContent.trim(), prizeElement)
          : "Unknown prize pool";
      } catch (err) {}
    
      const tournamentData = {
        tournamentName,
        winner,
        date,
        prizePool,
        tournamentLink,
        type: "recent"
      };
    
      console.log("Tournament data to save:", tournamentData);
      tournamentsData.push(tournamentData);
    
      // Save to MongoDB with upsert
      try {
        const savedTournament = await Tournament.findOneAndUpdate(
          { tournamentName },
          tournamentData,
          { upsert: true, new: true }
        );
        console.log("Saved tournament:", savedTournament);
      } catch (dbErr) {
        console.error("Error saving tournament:", tournamentName, dbErr);
      }
    }
    
    await browser.close();
    io.emit("tournamentUpdate", { type: "recent", data: tournamentsData });
    res.json(tournamentsData);
  } catch (error) {
    next(error);
  }
};



exports.getUpcomingTournaments = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.goto(
      "https://liquipedia.net/pubgmobile/Portal:Tournaments#Qualifier",
      { waitUntil: "domcontentloaded" }
    );

    const upcomingTournaments = await page.$$("#tournaments-menu-upcoming > li");
    const tournamentsData = [];

    for (const tournament of upcomingTournaments) {
      const tournamentElement = await tournament.$("a");
      const tournamentName = tournamentElement
        ? await page.evaluate((el) => el.textContent.trim(), tournamentElement)
        : "Unknown Tournament";
      const tournamentLink = tournamentElement
        ? await page.evaluate((el) => el.href, tournamentElement)
        : "No link available";

      const tournamentData = {
        tournamentName,
        winner: "TBD",
        date: "TBD",
        prizePool: "TBD",
        tournamentLink,
        type: "upcoming"
      };

      tournamentsData.push(tournamentData);

      // Save each upcoming tournament to MongoDB
      try {
        const savedTournament = await Tournament.findOneAndUpdate(
          { tournamentName },
          tournamentData,
          { upsert: true, new: true }
        );
        console.log("Saved upcoming tournament:", savedTournament);
      } catch (err) {
        console.error("Error saving upcoming tournament:", tournamentName, err);
      }
    }

    await browser.close();
    io.emit("tournamentUpdate", { type: "upcoming", data: tournamentsData });
    res.json(tournamentsData);
  } catch (error) {
    next(error);
  }
};

exports.getOngoingTournaments = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.goto("https://liquipedia.net/pubgmobile/Portal:Tournaments", {
      waitUntil: "domcontentloaded",
    });

    const ongoingTournaments = await page.$$("#tournaments-menu-ongoing > li > a");
    const tournamentsData = [];

    for (const tournament of ongoingTournaments) {
      const tournamentName = await page.evaluate(
        (el) => el.textContent.trim(),
        tournament
      );
      const tournamentLink = await page.evaluate(
        (el) => el.href,
        tournament
      );

      const tournamentData = {
        tournamentName,
        winner: "TBD",
        date: "Ongoing",
        prizePool: "TBD",
        tournamentLink,
        type: "ongoing"
      };

      tournamentsData.push(tournamentData);

      try {
        const savedTournament = await Tournament.findOneAndUpdate(
          { tournamentName },
          tournamentData,
          { upsert: true, new: true }
        );
        console.log("Saved ongoing tournament:", savedTournament);
      } catch (err) {
        console.error("Error saving ongoing tournament:", tournamentName, err);
      }
    }

    await browser.close();
    io.emit("tournamentUpdate", { type: "ongoing", data: tournamentsData });
    res.json(tournamentsData);
  } catch (error) {
    next(error);
  }
};


exports.followTournament = async (req, res, next) => {
  try {
    const { userId, tournamentId } = req.body;
    if (!userId || !tournamentId) {
      return res
        .status(400)
        .json({ message: "User ID and Tournament ID are required" });
    }
    const User = require("../Models/user");
    const tournament = await Tournament.findById(tournamentId);
    const user = await User.findById(userId);

    if (!user || !tournament) {
      return res
        .status(404)
        .json({ message: "User or Tournament not found" });
    }

    if (user.followedTournaments.includes(tournamentId)) {
      return res
        .status(400)
        .json({ message: "Tournament already followed" });
    }

    user.followedTournaments.push(tournamentId);
    await user.save();
    res.status(200).json({ message: "Tournament followed successfully", user });
  } catch (error) {
    next(error);
  }
};
