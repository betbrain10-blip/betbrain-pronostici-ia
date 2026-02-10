import matches from "../data/matches";

const map = {
  GOALS: "Gol",
  CORNERS: "Corner",
  CARDS: "Cartellini",
  "1X2": "Esito"
};

function formatPick(pick) {
  return `${pick.value} ${map[pick.type] || ""}`;
}

export default function Home() {

  const nowTs = Date.now();
  const limitTs = nowTs + 1000 * 60 * 60 * 24 * 3;

  const upcomingMatches = matches
    .filter((m) => {
      const ts = new Date(m.utcDate).getTime();
      return ts > nowTs && ts < limitTs;
    })
    .sort((a, b) =>
      new Date(a.utcDate) - new Date(b.utcDate)
    );

  console.log("NOW:", new Date(nowTs).toString());
  console.log("EVENTI FUTURI:", upcomingMatches.length);

  return (
    <div className="home">

      <h1 className="title">🤖 BetBrain — Pronostici IA</h1>

      <p className="subtitle">
        Analisi avanzate basate su intelligenza artificiale
      </p>

      {upcomingMatches.length === 0 && (
        <p style={{ opacity: 0.6 }}>
          Nessuna partita in programma nei prossimi giorni.
        </p>
      )}

      <div className="matches-grid">

        {upcomingMatches.map((m) => {

          const pick = m.picks[0];

          return (
            <div key={m.id} className="match-card">

              <span className="confidence-badge">
                {m.confidence}%
              </span>

              <h3>
                {m.home} vs {m.away}
              </h3>

              <p>
                {new Date(m.utcDate).toLocaleString("it-IT")}
              </p>

              <p className="pick">
                🎯 {formatPick(pick)}
              </p>

              <button className="analyze-btn">
                Analizza →
              </button>

            </div>
          );
        })}

      </div>
    </div>
  );
}
