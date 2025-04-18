const mongoose = require("mongoose");
const { launchBrowser } = require("../utils/scraper");
const Tournament = require("../Models/tournament");
const Standings = require('../Models/standings');
const User = require("../Models/user");
const UpcomingTournament =require("../Models/upcomingTournament");
const OngoingTournament =require("../Models/ongoing")


exports.getRecentTournaments = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.goto("https://liquipedia.net/pubgmobile/Recent_Tournament_Results", {
      waitUntil: "domcontentloaded",
      timeout: 300000
    });

    await page.waitForSelector(".gridTable");
    const recentTournaments = await page.$$(".gridTable > div");
    console.log("Found recent tournaments:", recentTournaments.length);

    const tournamentsData = [];

    for (const tournament of recentTournaments) {
      const tournamentElement = await tournament.$(".gridCell.Tournament.Header > a");
      const tournamentName = tournamentElement
        ? await page.evaluate((el) => el.textContent.trim(), tournamentElement)
        : "Unknown Tournament";
      if (!tournamentName || tournamentName === "Unknown Tournament") continue;

      const tournamentLink = tournamentElement
        ? await page.evaluate((el) => el.href, tournamentElement)
        : "No link available";

      let location = "Unknown location";
      try {
        const locationElement = await tournament.$(".gridCell.EventDetails.Location.Header");
        location = locationElement
          ? await page.evaluate((el) => el.textContent.trim(), locationElement)
          : "Unknown location";
      } catch (err) {
        console.error("Error scraping location:", err);
      }

      let participants = "Unknown";
      try {
        const participantsElement = await tournament.$(".gridCell.EventDetails.PlayerNumber.Header");
        if (participantsElement) {
          participants = await page.evaluate(el => {
            const span = el.querySelector('span:nth-child(1)');
            return span ? span.textContent.trim() : "Unknown";
          }, participantsElement);
        }
      } catch (err) {
        console.error("Error scraping participants:", err);
      }

      let tier = "Unknown";
      try {
        const tierElement = await tournament.$('div.gridCell.Series abbr');
        if (tierElement) {
          const rawTier = await page.evaluate(el => el.textContent.trim(), tierElement);
          tier = ['S', 'A', 'B', 'C'].includes(rawTier) ? rawTier : "Unknown";
        }
      } catch (err) {
        console.error("Error scraping tier:", err);
      }

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

      let secondPlace = "No second place listed";
      try {
        const secondPlaceElement = await tournament.$(
          ".gridCell.Placement.SecondPlace > span.Participants > div > span.name > a"
        );
        secondPlace = secondPlaceElement
          ? await page.evaluate((el) => el.textContent.trim(), secondPlaceElement)
          : "No second place listed";
      } catch (err) {
        console.error("Error scraping second place:", err);
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

     
      if (
        tournamentName === "Unknown Tournament" ||
        winner === "No winner listed" ||
        date === "Unknown date" ||
        prizePool === "Unknown prize pool"
      ) {
        console.warn(` Skipping incomplete tournament: ${tournamentName}`);
        continue;
      }

      const tournamentData = {
        tier,
        tournamentName,
        location,
        participants,
        winner,
        secondPlace,
        date,
        prizePool,
        tournamentLink,
        type: "recent"
      };

      const savedTournament = await Tournament.findOneAndUpdate(
        { tournamentName: tournamentData.tournamentName },
        tournamentData,
        { upsert: true, new: true }
      );
      console.log(" Saved recent tournament:", savedTournament.tournamentName);
      tournamentsData.push(savedTournament);
    }

    await browser.close();
    res.status(200).json(tournamentsData);
  } catch (error) {
    console.error("Error in getRecentTournaments:", error);
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

      
      if (
        !tournamentName || tournamentName === "Unknown Tournament" ||
        !tournamentLink || tournamentLink === "No link available"
      ) {
        console.warn(` Skipping incomplete upcoming tournament: ${tournamentName}`);
        continue;
      }

      const tournamentData = {
        tournamentName,
        winner: "TBD",
        date: "TBD",
        prizePool: "TBD",
        tournamentLink,
        type: "upcoming"
      };

      try {
        const savedTournament = await Tournament.findOneAndUpdate(
          { tournamentName },
          tournamentData,
          { upsert: true, new: true }
        );
        console.log(" Saved upcoming tournament:", savedTournament.tournamentName);
        tournamentsData.push(savedTournament);
      } catch (err) {
        console.error(" Error saving upcoming tournament:", tournamentName, err.message);
      }
    }

    await browser.close();
    io.emit("tournamentUpdate", { type: "upcoming", data: tournamentsData });
    res.json(tournamentsData);
  } catch (error) {
    console.error(" Error in getUpcomingTournaments:", error.message);
    next(error);
  }
};


exports.getOngoingTournaments = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    await page.goto("https://liquipedia.net/pubgmobile/Portal:Tournaments", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('#tournaments-menu-ongoing li a', { timeout: 5000 });

    const ongoingTournaments = await page.$$('#tournaments-menu-ongoing li a');
    console.log("Found ongoing tournaments:", ongoingTournaments.length);

    const tournamentsData = [];

    for (const tournament of ongoingTournaments) {
      const tournamentName = await page.evaluate(el => el.textContent.trim(), tournament);
      const tournamentLink = await page.evaluate(el => el.href, tournament);

      const tournamentData = {
        tournamentName,
        winner: "TBD",
        date: "Ongoing",
        prizePool: "TBD",
        tournamentLink,
        type: "ongoing"
      };

      

      try {
        const savedTournament = await Tournament.findOneAndUpdate(
          { tournamentName },
          tournamentData,
          { upsert: true, new: true }
        );
        console.log("Saved ongoing tournament:", savedTournament.tournamentName);
        tournamentsData.push(savedTournament);
      } catch (err) {
        console.error("Error saving ongoing tournament:", tournamentName, err);
      }
    }

    await browser.close();
    io.emit("tournamentUpdate", { type: "ongoing", data: tournamentsData });
    res.json(tournamentsData);
  } catch (error) {
    console.error("Error in getOngoingTournaments:", error);
    next(error);
  }
};



exports.getTournamentStandings = async (req, res) => {
  try {
    const tournamentNameParam = decodeURIComponent(req.params.tournamentName)
      .trim()
      .replace(/\s+/g, ' '); 
    console.log("Fetching standings for:", tournamentNameParam);

    const regex = new RegExp(`^${tournamentNameParam}$`, 'i');

    
    const standingsData = await Standings.findOne({
      tournament: { $regex: regex }
    });

    if (!standingsData) {
      console.log("No standings found for:", tournamentNameParam);
      return res.status(404).json({
        success: false,
        message: `Standings not found for tournament: ${tournamentNameParam}`
      });
    }

    res.json({
      success: true,
      standings: {
        tournamentName: standingsData.tournament,
        teams: standingsData.standings,
        mvp: standingsData.mvp
      }
    });
  } catch (error) {
    console.error("Error fetching tournament standings:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};




exports.getStandings = async (req, res) => {
  const { tournamentName, date, standings } = req.body;

  try {
    const newStandings = new Standings({
      tournamentName,
      date,
      standings
    });

    await newStandings.save();
    res.status(201).json({ message: 'Standings added successfully', newStandings });
  } catch (error) {
    res.status(500).json({ message: 'Error adding standings', error });
  }
};


exports.followTournament = async (req, res, next) => {
  try {
    const { tournamentId } = req.body;
    if (!tournamentId) {
      return res.status(400).json({ message: "Tournament ID is required" });
    }
    const User = require("../Models/user");
   
    const user = await User.findById(req.userId);
    const tournament = await Tournament.findById(tournamentId);

    if (!user || !tournament) {
      return res.status(404).json({ message: "User or Tournament not found" });
    }

    if (user.followedTournaments.includes(tournamentId)) {
      return res.status(400).json({ message: "Tournament already followed" });
    }

    user.followedTournaments.push(tournamentId);
    await user.save();
    res.status(200).json({ message: "Tournament followed successfully", user });
  } catch (error) {
    next(error);
  }
};

exports.deleteTournament = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({
        error: 'Invalid ID format',
        receivedId: tournamentId,
        expectedFormat: 'MongoDB ObjectID'
      });
    }

   
    const objectId = new mongoose.Types.ObjectId(tournamentId);

    
    const tournament = await Tournament.findById(objectId);
    if (!tournament) {
      return res.status(404).json({
        error: 'Tournament not found',
        tournamentId: objectId,
        collectionStats: {
          totalTournaments: await Tournament.countDocuments(),
          sampleIds: (await Tournament.find().limit(2)).map(t => t._id)
        }
      });
    }

   
    const deletionResult = await Tournament.deleteOne({ _id: objectId });
    
    
    await User.updateMany(
      { followedTournaments: objectId },
      { $pull: { followedTournaments: objectId } }
    );

    res.json({
      success: true,
      deletionResult,
      affectedUsers: await User.countDocuments({ followedTournaments: objectId })
    });

  } catch (error) {
    console.error('Full Error:', error);
    res.status(500).json({
      error: 'Server Error',
      errorDetails: {
        message: error.message,
        stack: error.stack,
        mongooseState: mongoose.connection.readyState
      }
    });
  }
};

exports.getTournamentById = async (req, res, next) => {
  try {
    const tournamentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({ message: "Invalid Tournament ID format" });
    }
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json({ success: true, tournament });
  } catch (error) {
    console.error("Error fetching tournament details:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




exports.getUpcomingTournamentByName = async (req, res) => {
  try {
    const rawName = req.params.tournamentName;
    const tournamentName = decodeURIComponent(rawName);
    
   
    const tournament = await UpcomingTournament.findOne({
      tournament_name: new RegExp(`^\\s*${tournamentName}\\s*$`, 'i')
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: `Tournament not found: ${tournamentName}`
      });
    }

    res.json({
      success: true,
      tournament: {
        _id: tournament._id,
        tournamentName: tournament.tournament_name,
        leagueInformation: tournament.league_information,
        organizers: tournament.organizers,
        gameVersion: tournament.game_version,
        gameMode: tournament.game_mode,
        type: tournament.type,
        location: tournament.location,
        prizePool: tournament.prize_pool,
        startDate: tournament.start_date,
        endDate: tournament.end_date,
        liquipediaTier: tournament.liquipedia_tier
      }
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

exports.getOngoingTournamentByName = async (req, res) => {
  try {
    const tournamentName = decodeURIComponent(req.params.tournamentName).trim();
    console.log("Searching for:", tournamentName);

    const regex = new RegExp(`^${tournamentName}$`, 'i');

    const tournament = await OngoingTournament.findOne({
      "leagueInfo.name": { $regex: regex }
    });

    if (!tournament) {
      const all = await OngoingTournament.find({}, "leagueInfo.name");
      console.log("All ongoing names in DB:", all.map(t => t.leagueInfo?.name || "[missing name]"));

      return res.status(404).json({
        success: false,
        message: `Tournament "${tournamentName}" not found in ongoing collection`
      });
    }

    res.json({
      success: true,
      tournament: {
        leagueInfo: tournament.leagueInfo,
        matches: tournament.matches,
        standings: tournament.standings
      }
    });

  } catch (err) {
    console.error("Error fetching ongoing tournament by name:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};
