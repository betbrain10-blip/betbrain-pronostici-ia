import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import "dotenv/config";

// ============================
// CONFIG
// ============================

const API_URL = "https://api.football-data.org/v4";
const OUTPUT_PATH = path.resolve("src/data/matches.js");

const DAYS_AHEAD = 3;
const MAX_MATCHES = 15;

// mercati
const MARKET_POOL = [
  { type: "CORNERS", values: ["Over 8.5", "Over 9.5", "Over 10.5"] },
  { type: "1X2", values: ["1", "X", "2"] },
];

// ============================
// UTILS
// ============================

const pickRandom = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const todayISO = () =>
  new Date().toISOString().split("T")[0];

const futureISO = (days) =>
  new Date(Date.now() + days * 86400000)
    .toISOString()
    .split("T")[0];

function stakeFromConfidence(conf) {
  if (conf >= 87) return "Alto";
  if (conf >= 74) return "Medio";
  return "Basso";
}

// ============================
// DESCRIZIONI
// ============================

function drawExplanation(confidence) {
  const base = [
    "Squadre molto equilibrate nei valori offensivi e difensivi.",
    "Entrambe arrivano da risultati simili nelle ultime giornate.",
    "Storicamente scontro chiuso e bloccato.",
    "Differenza tecnica ridotta tra le rose.",
    "Match tattico con poche occasioni pulite previste.",
  ];

  let txt = pickRandom(base);

  if (confidence < 75) {
    txt += " Quota interessante ma rischio medio-alto.";
  } else {
    txt += " Scenario favorevole al segno X.";
  }

  return txt;
}

function genericExplanation(type) {
  if (type === "CORNERS")
    return "Media corner elevata e gioco sulle fasce da entrambe le squadre.";
  if (type === "1X2")
    return "Forma recente favorevole alla squadra indicata.";
  return "Analisi statistica favorevole alla selezione proposta.";
}

// ============================
// API
// ============================

async function api(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt}`);
  }

  return res.json();
}

// ============================
// MAIN
// ============================

async function run() {
  console.log("⚽ Aggiorno eventi...");

  const dateFrom = todayISO();
  const dateTo = futureISO(DAYS_AHEAD);

  const data = await api(
    `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );

  const matches = data.matches
    .slice(0, MAX_MATCHES)
    .map((m) => {
      const market = pickRandom(MARKET_POOL);
      const value = pickRandom(market.values);

      const confidence = Math.floor(68 + Math.random() * 27);

      let explanation = "";

      if (market.type === "1X2" && value === "X") {
        explanation = drawExplanation(confidence);
      } else {
        explanation = genericExplanation(market.type);
      }

      const topPick = confidence >= 87;

      return {
        id: m.id,
        utcDate: m.utcDate,
        home: m.homeTeam.name,
        away: m.awayTeam.name,
        competition: m.competition.name,

        confidence,
        stake: stakeFromConfidence(confidence),
        topPick,

        picks: [
          {
            type: market.type,
            value,
            explanation,
          },
        ],
      };
    });

  const file = `const matches = ${JSON.stringify(
    matches,
    null,
    2
  )};

export default matches;
`;

  fs.writeFileSync(OUTPUT_PATH, file);

  console.log(`✅ Salvate ${matches.length} partite`);
}

run().catch((err) => {
  console.error("❌ ERRORE:", err.message);
});
