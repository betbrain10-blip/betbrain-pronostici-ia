import { useParams, Link } from "react-router-dom";
import matches from "../data/matches";
import "../App.css";

export default function Match() {
  const { id } = useParams();

  const match = matches.find((m) => String(m.id) === id);

  if (!match) return <p>Evento non trovato</p>;

  return (
    <div className="match-page">
      <Link to="/" className="back-link">
        ← Torna
      </Link>

      <div className="match-card-full">
        <h1>
          {match.home} vs {match.away}
        </h1>

        <div className="details-box">
          <div>🏆 {match.competition}</div>

          <div>
            📅{" "}
            {new Date(match.utcDate).toLocaleDateString("it-IT")} — 🕒{" "}
            {new Date(match.utcDate).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <div>
            🔥 Confidenza: <strong>{match.confidence}%</strong>
          </div>

          {match.objective && (
            <>
              <div>📊 Corner Index: {match.objective.cornerIndex}</div>
              <div>🟨 Cards Index: {match.objective.cardsIndex}</div>
            </>
          )}
        </div>

        <h2>📊 Pronostici IA</h2>

        <div className="picks-box">
          {match.picks.map((p, i) => (
            <div className="pick-row" key={i}>
              <strong>
                {p.type} — {p.value}
              </strong>
              <p>{p.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
