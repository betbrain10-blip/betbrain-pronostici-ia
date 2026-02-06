import { useParams, Link } from "react-router-dom";
import matches from "../data/matches";

export default function Match() {
  const { id } = useParams();

  const match = matches.find((m) => String(m.id) === id);

  if (!match) return <p>Evento non trovato</p>;

  const explanation =
    match.reason ||
    (match.picks && match.picks.length > 0 && match.picks[0].explanation);

  return (
    <div className="match-page">

      <Link to="/" className="back-link">← Torna</Link>

      <div className="match-card-full">

        <h1 className="match-title">
          {match.home} vs {match.away}
        </h1>

        <div className="details-box">

          <div className="detail-line">
            <strong>Confidenza:</strong> {match.confidence || match.aiConfidence}%
          </div>

          <div className="detail-line">
            🏆 {match.competition || match.league}
          </div>

          <div className="detail-line">
            📅 {new Date(match.utcDate || match.date).toLocaleString("it-IT")}
          </div>

          {/* PICK */}
          {match.market && (
            <div className="detail-line highlight">
              🎯 Pick consigliata: {match.market}
            </div>
          )}

          {/* DESCRIZIONE */}
          {explanation && (
            <div className="detail-line">
              🧠 {explanation}
            </div>
          )}

          <span className={`stake-pill ${match.stake}`}>
            Stake consigliato: {match.stake}
          </span>

        </div>
      </div>
    </div>
  );
}
