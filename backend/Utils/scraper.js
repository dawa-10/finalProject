const puppeteer = require("puppeteer");

exports.launchBrowser = async () => {
  return await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
  });
};
