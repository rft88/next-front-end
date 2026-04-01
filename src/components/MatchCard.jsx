import MatchDetails from "./MatchDetails";
import "./MatchCard.css";

function MatchCard({ match, puuid, runeMap, isOpen, onClick, onPlayerClick }) {
  const getQueue = (id) => {
    const queues = {
      420: "Ranked Solo",
      440: "Ranked Flex",
      450: "ARAM",
    };
    return queues[id] || "Normal";
  };

  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const getItemImg = (id) =>
    id
      ? `https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/${id}.png`
      : null;

  const getSpellName = (id) => {
    const spells = {
      1: "SummonerBoost",
      3: "SummonerExhaust",
      4: "SummonerFlash",
      6: "SummonerHaste",
      7: "SummonerHeal",
      11: "SummonerSmite",
      12: "SummonerTeleport",
      14: "SummonerDot",
      21: "SummonerBarrier",
      32: "SummonerSnowball",
      39: "SummonerSnowURFSnowball_Mark",
    };

    return spells[id] || null;
  };

  const getRuneIcon = (perkId) => {
    const path = runeMap?.[perkId];
    return path ? `https://ddragon.leagueoflegends.com/cdn/img/${path}` : null;
  };

  const getDisplayName = (player) => {
    if (player.riotIdGameName && player.riotIdTagline) {
      return `${player.riotIdGameName}#${player.riotIdTagline}`;
    }
    if (player.gameName && player.tagLine) {
      return `${player.gameName}#${player.tagLine}`;
    }
    if (player.riotIdGameName) return player.riotIdGameName;
    if (player.summonerName) return player.summonerName;
    return "Unknown";
  };

  const spell1 = getSpellName(match.summoner1Id);
  const spell2 = getSpellName(match.summoner2Id);

  const defaultFontColor = "#d3d3d3";
  const accentColor = match.win ? "#9ecbff" : "#ffb3b3";

  return (
    <div
      className="rounded p-2 mb-2 border-2"
      style={{
        backgroundColor: match.win ? "#253254" : "#4f2c30",
        cursor: "pointer",
        color: defaultFontColor,
      }}
      onClick={onClick}
    >
      <div
        className="d-flex align-items-center gap-2"
        style={{ position: "relative" }}
      >
        <div style={{ width: "260px", flexShrink: 0 }}>
          <div className="d-flex align-items-start gap-2">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${match.champion}.png`}
              width={42}
              height={42}
              style={{ flexShrink: 0 }}
              alt={match.champion}
            />

            <div className="d-flex flex-column gap-1">
              {spell1 ? (
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/spell/${spell1}.png`}
                  width={18}
                  height={18}
                  alt="Summoner Spell 1"
                />
              ) : (
                <div
                  style={{ width: 18, height: 18, background: "#222" }}
                  title="Unknown spell"
                />
              )}

              {spell2 ? (
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/spell/${spell2}.png`}
                  width={18}
                  height={18}
                  alt="Summoner Spell 2"
                />
              ) : (
                <div
                  style={{ width: 18, height: 18, background: "#222" }}
                  title="Unknown spell"
                />
              )}
            </div>

            <div className="d-flex flex-column" style={{ minWidth: 0 }}>
              <strong
                style={{
                  fontSize: "12px",
                  lineHeight: 1.1,
                  color: defaultFontColor,
                }}
              >
                {match.champion}
              </strong>

              <small
                style={{
                  lineHeight: 1.1,
                  marginTop: "2px",
                  color: accentColor,
                  fontWeight: 600,
                }}
              >
                {match.win ? "Victory" : "Defeat"}
              </small>

              <div className="d-flex align-items-center gap-1 mt-1">
                {getRuneIcon(match.primaryRune) && (
                  <img
                    src={getRuneIcon(match.primaryRune)}
                    width={18}
                    height={18}
                    title="Primary Rune"
                    alt="Primary Rune"
                  />
                )}

                {getRuneIcon(match.secondaryStyleId) && (
                  <img
                    src={getRuneIcon(match.secondaryStyleId)}
                    width={12}
                    height={12}
                    style={{ opacity: 0.85 }}
                    title="Secondary Style"
                    alt="Secondary Style"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-1 mt-2 flex-wrap">
            {match.items.map((item, i) =>
              item ? (
                <img
                  key={i}
                  src={getItemImg(item)}
                  width={18}
                  height={18}
                  alt={`Item ${i + 1}`}
                />
              ) : (
                <div
                  key={i}
                  style={{ width: 18, height: 18, background: "#222" }}
                />
              ),
            )}

            {match.item7 ? (
              <img
                src={getItemImg(match.item7)}
                width={18}
                height={18}
                title="Boots"
                style={{ border: "1px solid gold", borderRadius: "4px" }}
                alt="Boots"
              />
            ) : (
              <div style={{ width: 18, height: 18, background: "#222" }} />
            )}

            {match.item6 ? (
              <img
                src={getItemImg(match.item6)}
                width={18}
                height={18}
                title="Trinket"
                alt="Trinket"
              />
            ) : (
              <div style={{ width: 18, height: 18, background: "#222" }} />
            )}
          </div>
        </div>

        <div style={{ width: "80px", flexShrink: 0 }} className="text-center">
          <div
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              lineHeight: 1.1,
              color: defaultFontColor,
            }}
          >
            {match.kills}/{match.deaths}/{match.assists}
          </div>
          <small style={{ color: defaultFontColor, fontSize: "11px" }}>
            KDA
          </small>
        </div>

        <div style={{ width: "130px", flexShrink: 0 }}>
          <small style={{ fontSize: "11px", color: defaultFontColor }}>
            Damage: {match.damage}
          </small>
          <div style={{ height: 5, background: "#ccc", marginTop: 3 }}>
            <div
              style={{
                width: `${Math.min(match.damage / 1000, 100)}%`,
                height: "100%",
                background: "red",
              }}
            />
          </div>
        </div>

        <div style={{ width: "85px", flexShrink: 0 }} className="text-center">
          <small style={{ fontSize: "11px", lineHeight: 1.2 }}>
            <span style={{ color: accentColor, fontWeight: 600 }}>
              {getQueue(match.queueId)}
            </span>
            <br />
            <span style={{ color: defaultFontColor }}>
              {formatDuration(match.duration)}
            </span>
          </small>
        </div>

        <div
          className="d-flex gap-3"
          style={{
            flex: 1,
            minWidth: 0,
            paddingRight: "22px",
          }}
        >
          <div
            className="d-flex flex-column gap-1"
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {match.myTeam.map((p) => (
              <div
                key={p.puuid}
                className="d-flex align-items-center gap-1"
                style={{
                  fontSize: "10px",
                  lineHeight: 1.1,
                  minWidth: 0,
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${p.championName}.png`}
                  width={16}
                  height={16}
                  style={{
                    border: p.puuid === puuid ? "1px solid gold" : "",

                    flexShrink: 0,
                  }}
                  alt={p.championName}
                />

                <span
                  style={{
                    fontWeight: p.puuid === puuid ? "bold" : "normal",
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: defaultFontColor,
                  }}
                >
                  {getDisplayName(p)}
                </span>
              </div>
            ))}
          </div>

          <div
            className="d-flex flex-column gap-1"
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {match.enemyTeam.map((p) => (
              <div
                key={p.puuid}
                className="d-flex align-items-center gap-1"
                style={{
                  fontSize: "10px",
                  lineHeight: 1.1,
                  minWidth: 0,
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${p.championName}.png`}
                  width={16}
                  height={16}
                  style={{
                    flexShrink: 0,
                  }}
                  alt={p.championName}
                />

                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: defaultFontColor,
                  }}
                >
                  {getDisplayName(p)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "16px",
            fontWeight: "bold",
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: 1,
            color: defaultFontColor,
          }}
        >
          {isOpen ? "▼" : "▲"}
        </div>
      </div>

      {isOpen && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <MatchDetails
            match={match}
            puuid={puuid}
            runeMap={runeMap}
            onPlayerClick={onPlayerClick}
          />
        </div>
      )}
    </div>
  );
}

export default MatchCard;
