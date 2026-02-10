import { Link } from "react-router-dom";

export default function MatchCard({ match }) {
  const date = new Date(match.utcDate || match.date).toLocaleString("it-IT");

  return (
    <div className="match-card">

      {/* BADGE TOP */}
      {match.topPick && (
        <div className="badge-ai">🔥 TOP AI</div>
      )}

      <h3>
        {match.home} vs {match.away}
      </h3>

      {/* PICKS MULTIPLI */}
      {match.picks && match.picks.length > 0 && (
        <div className="picks-box">
          {match.picks.map((p, i) => (
            <div key={i} className={`pick-pill ${p.type.toLowerCase()}`}>
              {p.type}: <strong>{p.value}</strong>
            </div>
          ))}
        </div>
      )}

      {/* INDICI */}
      {match.objective && (
        <div className="indexes">
          <span>🚩 Corner Index: {match.objective.cornerIndex}</span>
          <span>🟨 Cards Index: {match.objective.cardsIndex}</span>
        </div>
      )}

      <p className="confidence">
        AI Confidence: {match.confidence}%
      </p>

      <p className="date">📅 {date}</p>

      <Link to={`/match/${match.id}`} className="btn">
        Analizza →
      </Link>
    </div>
  );
}
