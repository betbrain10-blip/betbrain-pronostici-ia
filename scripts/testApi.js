import fetch from "node-fetch";
import "dotenv/config";

const API_URL = "https://api.football-data.org/v4";

async function run() {
  console.log("🔍 Test API...");

  const res = await fetch(`${API_URL}/matches?limit=1`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY,
    },
  });

  const data = await res.json();

  console.log("✅ Match trovato:");
  console.log(data.matches[0]);

  const homeId = data.matches[0].homeTeam.id;

  const teamRes = await fetch(
    `${API_URL}/teams/${homeId}/matches?limit=10`,
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY,
      },
    }
  );

  console.log("📊 Status storico:", teamRes.status);

  const teamData = await teamRes.json();

  console.log("Ultimi match squadra:");
  console.log(teamData.matches?.slice(0, 3));
}

run().catch(console.error);
