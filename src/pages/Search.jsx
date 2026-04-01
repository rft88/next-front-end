import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import MatchList from "../components/MatchList";

import IRON from "../assets/IRON.png";
import BRONZE from "../assets/BRONZE.png";
import SILVER from "../assets/SILVER.png";
import GOLD from "../assets/GOLD.png";
import PLATINUM from "../assets/PLATINUM.png";
import EMERALD from "../assets/EMERALD.png";
import DIAMOND from "../assets/DIAMOND.png";
import MASTER from "../assets/MASTER.png";
import GRANDMASTER from "../assets/GRANDMASTER.png";
import CHALLENGER from "../assets/CHALLENGER.png";
import next from "../assets/next.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://next-front-end.onrender.com/api";

const MATCHES_PAGE_SIZE = 10;

const REGION_OPTIONS = [
  { value: "na1", label: "NA" },
  { value: "euw1", label: "EUW" },
  { value: "eun1", label: "EUN" },
  { value: "kr", label: "KR" },
  { value: "jp1", label: "JP" },
  { value: "br1", label: "BR" },
  { value: "tr1", label: "TR" },
  { value: "tw2", label: "TW" },
  { value: "vn2", label: "VN" },
  { value: "sg2", label: "SEA" },
];

const TIER_ICONS = {
  IRON,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
  EMERALD,
  DIAMOND,
  MASTER,
  GRANDMASTER,
  CHALLENGER,
};

function Search() {
  const location = useLocation();
  const hasAutoSearched = useRef(false);

  const [searchText, setSearchText] = useState(
    location.state?.searchText || "",
  );
  const [platformRegion, setPlatformRegion] = useState(
    location.state?.country || "na1",
  );

  const [playerData, setPlayerData] = useState(null);
  const [summonerData, setSummonerData] = useState(null);
  const [leagueData, setLeagueData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [runeMap, setRuneMap] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingMoreMatches, setLoadingMoreMatches] = useState(false);
  const [error, setError] = useState("");
  const [matchStart, setMatchStart] = useState(0);
  const [hasMoreMatches, setHasMoreMatches] = useState(false);

  const rankedSoloEntry = useMemo(() => {
    if (!leagueData?.length) return null;

    return (
      leagueData.find((entry) => entry.queueType === "RANKED_SOLO_5x5") ||
      leagueData[0]
    );
  }, [leagueData]);

  function resetSearchState() {
    setError("");
    setPlayerData(null);
    setSummonerData(null);
    setLeagueData(null);
    setMatches([]);
    setRuneMap({});
    setMatchStart(0);
    setHasMoreMatches(false);
  }

  const searchForPlayer = useCallback(
    async (event, overrideSearchText = null, overrideRegion = null) => {
      event?.preventDefault?.();

      const currentSearchText = (overrideSearchText ?? searchText).trim();
      const currentPlatformRegion = overrideRegion ?? platformRegion;

      if (!currentSearchText) {
        setError("Enter a Riot ID in the format SummonerName#TAG");
        return;
      }

      setLoading(true);
      resetSearchState();

      try {
        const response = await axios.get(`${API_BASE_URL}/player`, {
          params: {
            riotId: currentSearchText,
            platformRegion: currentPlatformRegion,
            start: 0,
            count: MATCHES_PAGE_SIZE,
          },
        });

        const data = response.data;

        setPlayerData(data.playerData);
        setSummonerData(data.summonerData);
        setLeagueData(data.leagueData);
        setMatches(data.matches || []);
        setRuneMap(data.runeMap || {});
        setMatchStart(data.pagination?.nextStart || 0);
        setHasMoreMatches(Boolean(data.pagination?.hasMoreMatches));
      } catch (err) {
        console.error("Backend Error:", err);
        setError(err.response?.data?.message || "Failed to fetch player data");
      } finally {
        setLoading(false);
      }
    },
    [searchText, platformRegion],
  );

  const handleLoadMoreMatches = useCallback(async () => {
    if (!playerData?.puuid || loadingMoreMatches || !hasMoreMatches) return;

    setLoadingMoreMatches(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/matches`, {
        params: {
          puuid: playerData.puuid,
          platformRegion,
          start: matchStart,
          count: MATCHES_PAGE_SIZE,
        },
      });

      const data = response.data;
      const nextMatches = data.matches || [];

      setMatches((prev) => {
        const existingIds = new Set(prev.map((match) => match.matchId));
        const unique = nextMatches.filter(
          (match) => !existingIds.has(match.matchId),
        );
        return [...prev, ...unique];
      });

      setMatchStart(data.pagination?.nextStart || matchStart);
      setHasMoreMatches(Boolean(data.pagination?.hasMoreMatches));
    } catch (err) {
      console.error("Load more matches error:", err);
      setError(err.response?.data?.message || "Failed to load more matches");
    } finally {
      setLoadingMoreMatches(false);
    }
  }, [
    playerData,
    loadingMoreMatches,
    hasMoreMatches,
    platformRegion,
    matchStart,
  ]);

  const handlePlayerClick = useCallback(
    async (gameName, tagLine) => {
      const riotId = `${gameName}#${tagLine}`;
      setSearchText(riotId);
      await searchForPlayer(null, riotId, platformRegion);
    },
    [platformRegion, searchForPlayer],
  );

  useEffect(() => {
    if (hasAutoSearched.current) return;

    const initialSearchText = location.state?.searchText?.trim();
    const initialRegion = location.state?.country || "na1";

    if (initialSearchText) {
      setSearchText(initialSearchText);
      setPlatformRegion(initialRegion);
      hasAutoSearched.current = true;
      searchForPlayer(null, initialSearchText, initialRegion);
    }
  }, [location.state, searchForPlayer]);

  const rankIcon = rankedSoloEntry?.tier
    ? TIER_ICONS[rankedSoloEntry.tier]
    : null;

  return (
    <div className="container-fluid px-0">
      <nav className="navbar navbar-expand-lg my-dark-theme-bg-1 shadow-sm px-3 px-md-4 mb-4">
        <div className="container-fluid px-0">
          <Link
            to="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <span className="navbar-brand mb-0 h1 my-dark-theme-fonts">
              <img src={next} width={50} height={50} alt="" />
            </span>
          </Link>

          <form
            onSubmit={searchForPlayer}
            className="d-flex gap-2 align-items-center ms-lg-auto"
          >
            <select
              className="form-select"
              style={{ width: "110px" }}
              value={platformRegion}
              onChange={(e) => setPlatformRegion(e.target.value)}
              disabled={loading}
            >
              {REGION_OPTIONS.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="form-control"
              style={{ minWidth: "260px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Summoner name#tag"
              disabled={loading}
            />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </nav>

      <div className="container py-2">
        {error && <div className="alert alert-danger">Error: {error}</div>}
        {loading && <p>Loading...</p>}

        {playerData && summonerData && rankedSoloEntry && !loading && (
          <div className="card p-4 shadow-sm mb-4 my-dark-theme-bg-1">
            <div className="row">
              <div className="col-md-8">
                <div className="d-flex align-items-center gap-4">
                  <div className="text-center">
                    <img
                      className="rounded-circle"
                      width={100}
                      height={100}
                      src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/profileicon/${summonerData.profileIconId}.png`}
                      alt="Profile Icon"
                    />
                    <small className="text-muted d-block mt-1 my-dark-theme-fonts">
                      Level {summonerData.summonerLevel}
                    </small>
                  </div>

                  <div>
                    <h4 className="mb-0 my-dark-theme-fonts">
                      {playerData.gameName}#{playerData.tagLine}
                    </h4>
                  </div>
                </div>

                <hr />

                <div className="d-flex align-items-center gap-4">
                  {rankIcon && (
                    <img
                      src={rankIcon}
                      alt={rankedSoloEntry.tier}
                      height="90"
                    />
                  )}

                  <div>
                    <h5 className="mb-1 my-dark-theme-fonts">
                      {rankedSoloEntry.tier} {rankedSoloEntry.rank}
                    </h5>
                    <p className="mb-1 my-dark-theme-fonts">
                      {rankedSoloEntry.leaguePoints} LP
                    </p>
                    <p className="mb-1 my-dark-theme-fonts">
                      {rankedSoloEntry.wins}W / {rankedSoloEntry.losses}L
                    </p>
                    <p className="mb-0 my-dark-theme-fonts">
                      Win Rate:{" "}
                      {Math.trunc(
                        (rankedSoloEntry.wins * 100) /
                          (rankedSoloEntry.wins + rankedSoloEntry.losses),
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  style={{
                    height: "100%",
                    minHeight: "150px",
                    background: "#f1f1f1",
                    border: "1px dashed #ccc",
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <small className="text-muted">Ad Space</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {matches.length > 0 && (
          <div className="card p-3 shadow-sm my-dark-theme-bg-1">
            <MatchList
              matches={matches}
              puuid={playerData?.puuid}
              runeMap={runeMap}
              onPlayerClick={handlePlayerClick}
            />

            <div className="d-flex justify-content-center mt-3">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={handleLoadMoreMatches}
                disabled={loadingMoreMatches || !hasMoreMatches}
              >
                {loadingMoreMatches
                  ? "Loading more..."
                  : hasMoreMatches
                    ? "Load more matches"
                    : "No more matches"}
              </button>
            </div>
          </div>
        )}

        {!playerData && !loading && !error && (
          <p className="text-muted">No player data</p>
        )}
      </div>
    </div>
  );
}

export default Search;
