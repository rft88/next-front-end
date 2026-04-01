import { useMemo, useState } from "react";

function MatchDetails({ match, puuid, runeMap, onPlayerClick }) {
  const [activeTab, setActiveTab] = useState("details");

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

  const getItemImg = (id) =>
    id
      ? `https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/${id}.png`
      : null;

  const getPlayerRiotId = (player) => {
    const gameName = player.riotIdGameName || player.gameName;
    const tagLine = player.riotIdTagline || player.tagLine;
    return gameName && tagLine ? `${gameName}#${tagLine}` : null;
  };

  const searchedPlayer = useMemo(() => {
    const allPlayers = [...(match.myTeam || []), ...(match.enemyTeam || [])];
    return allPlayers.find((player) => player.puuid === puuid) || null;
  }, [match, puuid]);

  const renderPlayerRow = (player) => {
    const isMe = player.puuid === puuid;
    const items = [
      player.item0,
      player.item1,
      player.item2,
      player.item3,
      player.item4,
      player.item5,
    ];

    const spell1 = getSpellName(player.summoner1Id);
    const spell2 = getSpellName(player.summoner2Id);

    return (
      <div
        key={player.puuid}
        className="d-flex align-items-center justify-content-between py-1 px-2"
        style={{
          fontSize: "12px",
          background: isMe ? "rgb(203, 139, 0)" : "transparent",
          borderRadius: "6px",
          borderTop: "1px solid #59595991",
          borderBottom: "1px solid #59595991",
        }}
      >
        <div
          className="d-flex align-items-center gap-2"
          style={{ width: "190px" }}
        >
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${player.championName}.png`}
            width={28}
            style={{
              border: isMe ? "2px solid gold" : "1px solid #444",
              borderRadius: "50%",
            }}
            alt={player.championName}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              const gameName = player.riotIdGameName || player.gameName;
              const tagLine = player.riotIdTagline || player.tagLine;

              if (gameName && tagLine) {
                onPlayerClick?.(gameName, tagLine);
              }
            }}
            style={{
              fontWeight: isMe ? "bold" : "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              textAlign: "left",
              color: "#d3d3d3",
              textDecoration: "none",
              cursor: getPlayerRiotId(player) ? "pointer" : "default",
            }}
            disabled={!getPlayerRiotId(player)}
            title={getPlayerRiotId(player) || "Missing Riot ID"}
          >
            {getPlayerRiotId(player) ||
              player.riotIdGameName ||
              player.summonerName ||
              "Unknown"}
          </button>
        </div>

        <div style={{ width: "90px", textAlign: "center" }}>
          <strong>
            {player.kills}/{player.deaths}/{player.assists}
          </strong>
        </div>

        <div
          className="d-flex align-items-center gap-2"
          style={{ width: "120px" }}
        >
          <div className="d-flex flex-column">
            {spell1 ? (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/spell/${spell1}.png`}
                width={16}
                alt="Summoner Spell 1"
              />
            ) : (
              <div
                style={{ width: 16, height: 16, background: "#222" }}
                title="Unknown spell"
              />
            )}

            {spell2 ? (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/spell/${spell2}.png`}
                width={16}
                alt="Summoner Spell 2"
              />
            ) : (
              <div
                style={{ width: 16, height: 16, background: "#222" }}
                title="Unknown spell"
              />
            )}
          </div>

          <div className="d-flex flex-column align-items-center">
            {getRuneIcon(player.perks.styles[0].selections[0].perk) && (
              <img
                src={getRuneIcon(player.perks.styles[0].selections[0].perk)}
                width={16}
                alt="Primary Rune"
              />
            )}

            <div className="d-flex gap-1 mt-1">
              {getRuneIcon(player.perks.styles[1].style) && (
                <img
                  src={getRuneIcon(player.perks.styles[1].style)}
                  width={12}
                  style={{ opacity: 0.8 }}
                  alt="Secondary Style"
                />
              )}
            </div>
          </div>
        </div>

        <div
          className="d-flex align-items-center gap-2"
          style={{ width: "220px" }}
        >
          <div className="d-flex flex-wrap gap-1">
            {items.map((item, i) =>
              item ? (
                <img
                  key={i}
                  src={getItemImg(item)}
                  width={20}
                  alt={`Item ${i + 1}`}
                />
              ) : (
                <div
                  key={i}
                  style={{ width: 20, height: 20, background: "#222" }}
                />
              ),
            )}
          </div>

          <div>
            {player.roleBoundItem ? (
              <img
                src={getItemImg(player.roleBoundItem)}
                width={20}
                title="Boots"
                style={{ border: "1px solid gold", borderRadius: "4px" }}
                alt="Boots"
              />
            ) : (
              <div style={{ width: 20, height: 20, background: "#222" }} />
            )}
          </div>

          <div>
            {player.item6 ? (
              <img
                src={getItemImg(player.item6)}
                width={20}
                title="Trinket"
                alt="Trinket"
              />
            ) : (
              <div style={{ width: 20, height: 20, background: "#222" }} />
            )}
          </div>
        </div>

        <div style={{ width: "140px" }}>
          <div style={{ fontSize: "11px" }}>
            {player.totalDamageDealtToChampions}
          </div>
          <div
            style={{
              height: "5px",
              background: "#333",
              borderRadius: "3px",
              marginTop: "2px",
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  player.totalDamageDealtToChampions / 1000,
                  100,
                )}%`,
                height: "100%",
                background: "#e74c3c",
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderRunesPanel = () => {
    if (!searchedPlayer) {
      return <div className="mt-3 text-muted">No rune data found.</div>;
    }

    const primaryStyle = searchedPlayer.perks?.styles?.[0];
    const secondaryStyle = searchedPlayer.perks?.styles?.[1];

    return (
      <div className="mt-3">
        <div
          className="border-2 rounded p-3"
          style={{ background: "rgba(255, 217, 0, 0)" }}
        >
          <div className="d-flex flex-wrap gap-4">
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  color: "#dbdbdb",
                }}
              >
                Primary
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {getRuneIcon(primaryStyle?.style) && (
                  <img
                    src={getRuneIcon(primaryStyle.style)}
                    width={28}
                    height={28}
                    title="Primary Tree"
                    alt="Primary Tree"
                  />
                )}

                {primaryStyle?.selections?.map((selection, i) =>
                  getRuneIcon(selection.perk) ? (
                    <img
                      key={i}
                      src={getRuneIcon(selection.perk)}
                      width={26}
                      height={26}
                      title={`Primary Rune ${i + 1}`}
                      alt={`Primary Rune ${i + 1}`}
                    />
                  ) : null,
                )}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  color: "#dbdbdb",
                }}
              >
                Secondary
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {getRuneIcon(secondaryStyle?.style) && (
                  <img
                    src={getRuneIcon(secondaryStyle.style)}
                    width={28}
                    height={28}
                    title="Secondary Tree"
                    alt="Secondary Tree"
                  />
                )}

                {secondaryStyle?.selections?.map((selection, i) =>
                  getRuneIcon(selection.perk) ? (
                    <img
                      key={i}
                      src={getRuneIcon(selection.perk)}
                      width={22}
                      height={22}
                      title={`Secondary Rune ${i + 1}`}
                      alt={`Secondary Rune ${i + 1}`}
                    />
                  ) : null,
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="col-12">
      <div
        className="d-flex align-items-center"
        style={{
          gap: "6px",
          borderBottom: "1px solid #595959", // change color here
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className="btn btn-sm"
          style={{
            borderRadius: "8px 8px 0 0",
            background: activeTab === "details" ? "#fff" : "#e9ecef",
            border: "1px solid #dee2e6",
            borderBottom:
              activeTab === "details" ? "1px solid #fff" : "1px solid #dee2e6",
            fontWeight: activeTab === "details" ? 700 : 500,
          }}
        >
          Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("runes")}
          className="btn btn-sm"
          style={{
            borderRadius: "8px 8px 0 0",
            background: activeTab === "runes" ? "#fff" : "#e9ecef",
            border: "1px solid #dee2e6",
            borderBottom:
              activeTab === "runes" ? "1px solid #fff" : "1px solid #dee2e6",
            fontWeight: activeTab === "runes" ? 700 : 500,
          }}
        >
          Runes
        </button>
      </div>

      {activeTab === "details" && (
        <div className="mt-3">
          <div className="mb-3">
            <h6 style={{ color: "#4dabf7" }}>Blue Team</h6>
            <div className="d-flex flex-column gap-1">
              {match.myTeam.map(renderPlayerRow)}
            </div>
          </div>

          <div>
            <h6 style={{ color: "#ff6b6b" }}>Red Team</h6>
            <div className="d-flex flex-column gap-1">
              {match.enemyTeam.map(renderPlayerRow)}
            </div>
          </div>
        </div>
      )}

      {activeTab === "runes" && renderRunesPanel()}
    </div>
  );
}

export default MatchDetails;
