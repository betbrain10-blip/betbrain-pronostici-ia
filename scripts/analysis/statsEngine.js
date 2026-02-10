import fetch from "node-fetch";

const API = "https://api.football-data.org/v4";

// ============================
// API WRAPPER
// ============================

async function api(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }

  return res.json();
}

// ============================
// TEAM FORM STATS
// ============================

export async function buildTeamStats(teamId) {
  const data = await api(
    `/teams/${teamId}/matches?limit=12&status=FINISHED`
  );

  const matches = data.matches || [];

  let gf = 0;
  let ga = 0;
  let wins = 0;

  matches.forEach((m) => {
    const home = m.homeTeam.id === teamId;

    const goalsFor = home
      ? m.score.fullTime.home
      : m.score.fullTime.away;

    const goalsAgainst = home
      ? m.score.fullTime.away
      : m.score.fullTime.home;

    gf += goalsFor;
    ga += goalsAgainst;

    if (goalsFor > goalsAgainst) wins++;
  });

  const played = matches.length || 1;

  return {
    played,
    avgGoalsFor: Number((gf / played).toFixed(2)),
    avgGoalsAgainst: Number((ga / played).toFixed(2)),
    winRate: Number((wins / played).toFixed(2)),
  };
}

// ============================
// CORNER INDEX
// ============================

export function calcCornerIndex(home, away) {
  const tempo =
    home.avgGoalsFor +
    away.avgGoalsFor +
    home.avgGoalsAgainst +
    away.avgGoalsAgainst;

  const pressure =
    home.winRate * 2 +
    away.winRate * 2;

  const index = tempo + pressure;

  return Number(index.toFixed(2));
}

// ============================
// CARDS INDEX
// ============================

export function calcCardsIndex(home, away) {
  const intensity =
    home.avgGoalsAgainst +
    away.avgGoalsAgainst;

  const balance =
    Math.abs(home.winRate - away.winRate);

  const index = intensity * 2 + balance * 1.5;

  return Number(index.toFixed(2));
}

// ============================
// DECISIONI MERCATO
// ============================

export function decideCorners(index) {
  if (index >= 5.8)
    return {
      market: "CORNERS",
      value: "Over 8.5",
    };

  if (index <= 4.2)
    return {
      market: "CORNERS",
      value: "Under 8.5",
    };

  return null;
}

export function decideCards(index) {
  if (index >= 4.8)
    return {
      market: "CARDS",
      value: "Over 4.5",
    };

  return null;
}
