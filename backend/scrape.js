const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeAdditionalTable() {
    const url = 'https://liquipedia.net/pubgmobile/Peacekeeper_Elite_League/2024/Fall';

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract all rows from the second table
        const tableData = await page.evaluate(() => {
            const tableSelector = '#mw-content-text > div > div:nth-child(41) > table > tbody';
            const table = document.querySelector(tableSelector);
            if (!table) return null;

            const rows = table.querySelectorAll('tr');
            const data = [];

            rows.forEach(row => {
                const columns = row.querySelectorAll('td');
                if (columns.length > 0) {
                    data.push({
                        rank: columns[0]?.innerText.trim() || '',
                        team: columns[1]?.querySelector('span.team-template-text')?.innerText.trim() || '',
                        points: columns[2]?.innerText.trim() || '',
                        kills: columns[3]?.innerText.trim() || '',
                        totalScore: columns[4]?.innerText.trim() || ''
                    });
                }
            });

            return data;
        });

        console.log('Extracted Additional Table Data:', tableData);

        if (tableData) {
            await fs.writeFile('pel_2024_fall_extra.json', JSON.stringify(tableData, null, 2));
            console.log('Data saved to pel_2024_fall_extra.json');
        }

    } catch (error) {
        console.error('Error scraping data:', error);
    } finally {
        await browser.close();
    }
}

scrapeAdditionalTable();
