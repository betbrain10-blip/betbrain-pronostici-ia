import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://www.worldfootball.net";

export async function scrapeTeamForm(teamName) {
  try {
    const slug = teamName
      .toLowerCase()
      .replace(/ fc| calcio| club/g, "")
      .replace(/\s+/g, "-");

    const url = `${BASE}/teams/${slug}/`;

    console.log("🌍 Fetch:", url);

    const { data: html } = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);

    const title = $("title").text();
    console.log("📄 Title:", title);

    // prendiamo ultimi risultati tabella
    const results = [];

    $("table.standard_tabelle tr").each((i, el) => {
      const tds = $(el).find("td");

      if (tds.length >= 6 && results.length < 5) {
        const score = $(tds[4]).text().trim();
        results.push(score);
      }
    });

    return {
      lastResults: results,
      sample: title,
    };
  } catch (err) {
    console.error("❌ scrapeWorldFootball:", err.message);
    return null;
  }
}
