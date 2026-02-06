import matches from "../data/matches";
import { Link } from "react-router-dom";

/* ================================
   MAPPA CAMPIONATO → PAESE
================================ */

function getCountryCode(match) {
  const text = `${match.competition || ""} ${match.home || ""} ${match.away || ""}`.toLowerCase();

  if (text.includes("brasil") || text.includes("brasileiro")) return "br";
  if (text.includes("serie a") || text.includes("italia")) return "it";

  if (
    text.includes("spain") ||
    text.includes("espana") ||
    text.includes("españa") ||
    text.includes("spagna") ||
    text.includes("la liga") ||
    text.includes("primera") ||
    text.includes("osasuna") ||
    text.includes("celt")
  ) return "es";

  if (text.includes("bundesliga") || text.includes("german")) return "de";
  if (text.includes("premier") || text.includes("england")) return "gb";
  if (text.includes("ligue")) return "fr";
  if (text.includes("eredivisie")) return "nl";
  if (text.includes("portugal")) return "pt";
  if (text.includes("libertadores")) return "ar";

  return null;
}

/* ================================
   BANDIERA
================================ */

function Flag({ code }) {
  if (!code) return null;

  return (
    <img
      src={`https://flagcdn.com/w20/${code}.png`}
      alt={code}
      loading="lazy"
      style={{
        width: 20,
        height: 14,
        objectFit: "cover",
        borderRadius: 3,
        marginRight: 6,
        boxShadow: "0 0 6px rgba(0,0,0,.6)",
      }}
    />
  );
}

/* ================================
   FORMATTA PICK
================================ */

function formatPick(pick) {
  if (!pick) return "";

  const map = {
    GOALS: "Gol",
    CORNERS: "Corner",
    CARDS: "Cartellini",
    "1X2": "Esito",
  };

  return `${pick.value} ${map[pick.type] || ""}`;
}

export default function Home() {
  const now = new Date();
  const limit = new Date();
  limit.setHours(limit.getHours() + 48);

  const upcomingMatches = matches
    .filter((m) => {
      const d = new Date(m.utcDate || m.date);
      return d > now && d < limit;
    })
    .sort(
      (a, b) =>
        new Date(a.utcDate || a.date) -
        new Date(b.utcDate || b.date)
    );

  return (
    <div className="home">

      {/* HEADER */}
      <h1 className="title">🤖 BetBrain — Pronostici IA</h1>
      <p className="subtitle">
        Analisi avanzate basate su intelligenza artificiale
      </p>

      <div className="matches-grid">
        {upcomingMatches.map((m) => {
          const pick = m.picks?.[0];
          const country = getCountryCode(m);

          return (
            <div key={m.id} className="match-card">

              {/* CONFIDENCE */}
              <span className="confidence-badge">
                {m.confidence || m.aiConfidence}%
              </span>

              {/* ESITO */}
              {pick && (
                <div className="market-pill">
                  🎯 {formatPick(pick)}
                </div>
              )}

              {/* MATCH */}
              <h3 className="match-title-small">
                <Flag code={country} />
                {m.home} vs {m.away}
              </h3>

              {/* DATA */}
              <div className="meta-row">
                {new Date(m.utcDate || m.date).toLocaleString("it-IT")}
              </div>

              <Link to={`/match/${m.id}`} className="analyze-btn">
                Analizza →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
