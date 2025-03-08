import puppeteer from "puppeteer";

(async () => {
  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://liquipedia.net/pubgmobile/Recent_Tournament_Results", {
      waitUntil: "domcontentloaded",
    });

    // Selecting tournament rows
    const recentTournaments = await page.$$(".gridTable > div");

    for (const tournament of recentTournaments) {
      try {
        // Extract tournament name
        const tournamentElement = await tournament.$(".gridCell.Tournament.Header > a");
        const tournamentName = tournamentElement
          ? await page.evaluate(el => el.textContent.trim(), tournamentElement)
          : "Unknown Tournament";

        if (!tournamentName) continue; // Skip if no tournament name

        // Extract tournament link
        const tournamentLink = tournamentElement
          ? await page.evaluate(el => el.href, tournamentElement)
          : "No link available";

        // Extract winner
        let winner = "No winner listed";
        try {
          const winnerElement = await tournament.$(".gridCell.Placement.FirstPlace > span.Participants > div > span.name > a");
          winner = winnerElement ? await page.evaluate(el => el.textContent.trim(), winnerElement) : "No winner listed";
        } catch (err) {}

        // Extract date
        let date = "Unknown date";
        try {
          const dateElement = await tournament.$(".gridCell.EventDetails.Date.Header");
          date = dateElement ? await page.evaluate(el => el.textContent.trim(), dateElement) : "Unknown date";
        } catch (err) {}

        // Extract prize pool
        let prizePool = "Unknown prize pool";
        try {
          const prizeElement = await tournament.$(".gridCell.EventDetails.Prize.Header");
          prizePool = prizeElement ? await page.evaluate(el => el.textContent.trim(), prizeElement) : "Unknown prize pool";
        } catch (err) {}

        console.log(`🏆 ${tournamentName} → Winner: ${winner} | 📅 Date: ${date} | 💰 Prize Pool: ${prizePool} | 🔗 Link: ${tournamentLink}`);
      } catch (err) {
        // Skip if there's an issue with this row
      }
    }

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
