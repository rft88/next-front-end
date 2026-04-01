import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CHALLENGER from "../assets/next.png";
import "./Home.css";

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

function Home() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [country, setCountry] = useState("na1");

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedSearch = searchText.trim();
    if (!trimmedSearch) return;

    navigate("/search", {
      state: {
        searchText: trimmedSearch,
        country,
      },
    });
  }

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center "
      style={{ minHeight: "100vh" }}
    >
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ width: "100%", maxWidth: "900px", padding: "24px" }}
      >
        <img
          src={CHALLENGER}
          alt="Home Banner"
          style={{
            width: "100%",
            maxWidth: "420px",
            height: "auto",
            objectFit: "contain",
            marginBottom: "32px",
          }}
        />

        <form
          onSubmit={handleSubmit}
          className="d-flex gap-2 align-items-center w-100"
          style={{ maxWidth: "700px" }}
        >
          <select
            className="form-select w-auto"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {REGION_OPTIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="form-control flex-grow-1"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Summoner name#tag"
          />

          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
