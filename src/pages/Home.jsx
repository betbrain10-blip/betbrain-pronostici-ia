import matches from "../data/matches";
import { Link } from "react-router-dom";

/* ================================
   CONFIG FILTRI
================================ */

const MIN_CONFIDENCE = 80;

/* ================================
   UTILS
================================ */

function getCountryCode(match) {
  const text = `${match.competition || ""} ${match.home || ""} ${match.away || ""}`.toLowerCase();

  if (text.includes("serie a") || text.includes("italia")) return "it";
  if (text.includes("premier") || text.includes("england")) return "gb";
  if (text.includes("bundesliga")) return "de";
  if (text.includes("liga")) return "es";
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
   FORMAT PICK
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

/* ================================
   HOME
================================ */

export default function Home() {
  const now = new Date();
  const limit = new Date();
  limit.setHours(limit.getHours() + 72);

  const filteredMatches = matches
    .filter((m) => {
      const d = new Date(m.utcDate || m.date);

      if (d < now || d > limit) return false;

      if (m.confidence < MIN_CONFIDENCE) return false;

      if (!m.picks?.length) return false;

      const value = m.picks[0].value.toLowerCase();

      // ❌ elimina Over/Under 1.5
      if (
        value.includes("over 1.5") ||
        value.includes("under 1.5")
      )
        return false;

      return true;
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
        Solo eventi con affidabilità ≥ 80%
      </p>

      {filteredMatches.length === 0 && (
        <p style={{ marginTop: 40 }}>
          Nessun evento che rispetta i criteri attuali.
        </p>
      )}

      <div className="matches-grid">

        {filteredMatches.map((m) => {
          const pick = m.picks[0];
          const country = getCountryCode(m);

          return (
            <div key={m.id} className="match-card">

              {/* CONFIDENCE */}
              <span className="confidence-badge">
                {m.confidence}%
              </span>

              {/* MERCATO */}
              <div className="market-pill">
                🎯 {formatPick(pick)}
              </div>

              {/* MATCH */}
              <h3 className="match-title-small">
                <Flag code={country} />
                {m.home} vs {m.away}
              </h3>

              {/* DATA */}
              <div className="meta-row">
                {new Date(m.utcDate).toLocaleString("it-IT")}
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
