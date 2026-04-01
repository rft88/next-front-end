import { useState } from "react";
import MatchCard from "./MatchCard";
import "./MatchList.css";

function MatchList({ matches, puuid, runeMap, onPlayerClick }) {
  const [openMatch, setOpenMatch] = useState(null);

  if (!matches || matches.length === 0) {
    return <p>No matches found</p>;
  }

  return (
    <div className="container mt-4 my-dark-theme-fonts my-dark-theme-bg-1">
      <h5>Recent Matches</h5>

      {matches.map((match) => (
        <MatchCard
          key={match.matchId}
          match={match}
          puuid={puuid}
          runeMap={runeMap}
          isOpen={openMatch === match.matchId}
          onClick={() =>
            setOpenMatch(openMatch === match.matchId ? null : match.matchId)
          }
          onPlayerClick={onPlayerClick}
        />
      ))}
    </div>
  );
}

export default MatchList;
