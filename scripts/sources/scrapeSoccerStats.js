import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://www.soccerstats.com";

async function findTeamUrl(teamName) {
  const searchUrl = `${BASE}/search.asp?search=${encodeURIComponent(
    teamName
  )}`;

  console.log("🔎 Search:", searchUrl);

  const { data: html } = await axios.get(searchUrl, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(html);

  const first = $("a")
    .filter((_, el) =>
      $(el).attr("href")?.includes("team.asp")
    )
    .first();

  const href = first.attr("href");

  if (!href) return null;

  return BASE + "/" + href;
}

export async function scrapeTeamForm(teamName) {
  try {
    const teamUrl = await findTeamUrl(teamName);

    if (!teamUrl) {
      console.log("❌ Squadra non trovata:", teamName);
      return null;
    }

    console.log("➡ Team page:", teamUrl);

    const { data: html } = await axios.get(teamUrl, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);

    const title = $("title").text();
    console.log("📄 Title:", title);

    // fallback temporaneo (per ora stampiamo)
    return {
      form: "WDLWW",
      goalsFor: 1.7,
      goalsAgainst: 1.2,
    };
  } catch (err) {
    console.error("❌ scrapeTeamForm ERROR:", err.message);
    return null;
  }
}
