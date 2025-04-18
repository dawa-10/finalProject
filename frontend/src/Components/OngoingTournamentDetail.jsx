import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/OngoingDetail.css";

const OngoingTournamentDetail = () => {
  const { tournamentName } = useParams();
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentName) return;
      try {
        const encodedName = encodeURIComponent(tournamentName);
        const res = await axios.get(`http://localhost:3000/api/tournaments/ongoing/${encodedName}`);
        setTournament(res.data.tournament);
      } catch (err) {
        console.error("Error fetching tournament details:", err);
        setError("Tournament not found or server error.");
      }
    };

    fetchTournament();
  }, [tournamentName]);

  if (error) return <p className="error-msg">{error}</p>;
  if (!tournament) return <p className="loading-msg">Loading tournament data...</p>;

  const { leagueInfo, matches, standings } = tournament;


  const maxGames = Math.max(...standings.map(team => team.games.length));

  return (
    
    <div className="container">
        <Navbar />
      <h2 className="tournament-name">{leagueInfo.name}</h2>

      <div className="info-grid">
        <div><strong>Series:</strong> {leagueInfo.series}</div>
        <div><strong>Organizers:</strong> {leagueInfo.organizers.join(", ")}</div>
        <div><strong>Game Version:</strong> {leagueInfo.gameVersion}</div>
        <div><strong>Game Mode:</strong> {leagueInfo.gameMode}</div>
        <div><strong>Type:</strong> {leagueInfo.type}</div>
        <div><strong>Location:</strong> {leagueInfo.location}</div>
        <div><strong>Venue:</strong> {leagueInfo.venue}</div>
        <div><strong>Prize Pool:</strong> ${leagueInfo.prizePool.USD.toLocaleString()}</div>
        <div><strong>Tier:</strong> {leagueInfo.tier}</div>
        <div><strong>Start Date:</strong> {new Date(leagueInfo.startDate).toLocaleDateString()}</div>
        <div><strong>End Date:</strong> {new Date(leagueInfo.endDate).toLocaleDateString()}</div>
      </div>

      <div className="standings">
        
  <h3>Standings</h3>
  <div className="tournaments-table-wrapper">
    <table className="tournaments-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Total Points</th>
          {Array.from({ length: maxGames }, (_, i) => (
            <th key={i}>Game {i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {standings.map((team, idx) => (
          <tr key={idx}>
            <td>{team.rank}</td>
            <td>{team.team}</td>
            <td>{team.totalPoints}</td>
            {Array.from({ length: maxGames }, (_, i) => (
              <td key={i}>{team.games[i] ?? "-"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default OngoingTournamentDetail;
