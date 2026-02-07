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
const MAX_MATCHES = 30;

// ============================
// MERCATI DISPONIBILI
// ============================

const MARKET_POOL = [
  {
    type: "GOALS",
    values: ["Over 2.5", "Over 3.5", "Under 2.5"],
  },
  {
    type: "CORNERS",
    values: [
      "Over 8.5",
      "Over 9.5",
      "Over 10.5",
      "Under 9.5",
      "Under 10.5",
    ],
  },
  {
    type: "CARDS",
    values: [
      "Over 3.5",
      "Over 4.5",
      "Under 4.5",
      "Under 5.5",
    ],
  },
  {
    type: "1X2",
    values: ["1", "X", "2"],
  },
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
  if (conf >= 90) return "Alto";
  if (conf >= 80) return "Medio";
  return "Basso";
}

// ============================
// DESCRIZIONI REALISTICHE
// ============================

function explanationGoals(value) {
  if (value.startsWith("Over"))
    return pickRandom([
      "Media gol elevata e tendenza a partite aperte.",
      "Difese vulnerabili e ritmo offensivo previsto.",
      "Storico recente favorevole a più reti.",
    ]);

  return pickRandom([
    "Difese compatte e ritmo controllato.",
    "Storico recente povero di reti.",
    "Gara tattica con poche occasioni pulite.",
  ]);
}

function explanationCorners(value) {
  if (value.startsWith("Over"))
    return pickRandom([
      "Gioco sulle fasce frequente e molti cross.",
      "Pressione costante prevista.",
      "Alto volume offensivo laterale.",
    ]);

  return pickRandom([
    "Possesso palla prudente e poche discese laterali.",
    "Ritmo basso sulle corsie.",
    "Squadre poco portate al cross.",
  ]);
}

function explanationCards(value) {
  if (value.startsWith("Over"))
    return pickRandom([
      "Match teso e fisico.",
      "Rivalità storica tra le squadre.",
      "Arbitro severo e molti contrasti.",
    ]);

  return pickRandom([
    "Arbitro permissivo e gara corretta.",
    "Stile di gioco disciplinato.",
    "Bassa intensità nei contrasti.",
  ]);
}

function explanation1X2(value) {
  if (value === "X")
    return pickRandom([
      "Squadre equilibrate nei valori.",
      "Previsione di gara bloccata.",
      "Differenza tecnica minima.",
    ]);

  return pickRandom([
    "Differenza di forma evidente.",
    "Superiorità tecnica recente.",
    "Storico favorevole alla squadra indicata.",
  ]);
}

function buildExplanation(type, value) {
  if (type === "GOALS") return explanationGoals(value);
  if (type === "CORNERS") return explanationCorners(value);
  if (type === "CARDS") return explanationCards(value);
  if (type === "1X2") return explanation1X2(value);

  return "Analisi statistica favorevole.";
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
  console.log("⚽ Aggiorno eventi Football-Data...");

  const dateFrom = todayISO();
  const dateTo = futureISO(DAYS_AHEAD);

  const data = await api(
    `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );

  if (!data.matches || !data.matches.length) {
    console.log("⚠ Nessuna partita trovata");
    return;
  }

  const matches = data.matches
    .slice(0, MAX_MATCHES)
    .map((m) => {
      const market = pickRandom(MARKET_POOL);
      const value = pickRandom(market.values);

      const confidence = Math.floor(75 + Math.random() * 20);

      const explanation = buildExplanation(
        market.type,
        value
      );

      return {
        id: m.id,
        utcDate: m.utcDate,
        home: m.homeTeam.name,
        away: m.awayTeam.name,
        competition: m.competition.name,

        confidence,
        stake: stakeFromConfidence(confidence),
        topPick: confidence >= 88,

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
