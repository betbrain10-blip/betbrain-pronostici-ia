import { Link } from "react-router-dom";

export default function MatchCard({ match }) {
  const date = new Date(match.utcDate || match.date).toLocaleString("it-IT");

  const pick = match.picks?.[0];

  return (
    <div className="match-card">
      {/* BADGE IN ALTO */}
      <div className="badge-ai">AI PICK</div>

      <h3>
        {match.home} vs {match.away}
      </h3>

      {pick && (
        <p className="market">
          🎯 {pick.type}: <strong>{pick.value}</strong>
        </p>
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
