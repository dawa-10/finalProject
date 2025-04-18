
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import NotificationBell from "./NotificationBell";
import "../Styles/Recent.css";
import { Link } from "react-router-dom";

const RecentTournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("you are not logged in")
      navigate("/login");
      return
    } else {
      axios
        .get("http://localhost:3000/api/tournaments/recent", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setTournaments(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch tournaments");
          setLoading(false);
        });
    }
  }, [navigate]);

  const handleFollow = (tournamentId) => {
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:3000/api/tournaments/follow", { tournamentId }, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        alert("Error following tournament: " + error.response.data.message);
      });
  };
  
  
  return (
    <div>
      <Navbar />
      <NotificationBell />
      <div className="recent-tournaments-container">
        <h1>Recent Tournaments</h1>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="tournaments-table-wrapper">
            <table className="tournaments-table">
              <thead>
                <tr>
                  <th>Tournament Name</th>
                  <th>Winner</th>
                  <th>Date</th>
                  <th>Prize Pool</th>
                  <th>Standings</th>
                  <th>Follow</th>
                </tr>
              </thead>
              <tbody>
  {tournaments.length === 0 ? (
    <tr>
      <td colSpan="6" className="error-message">
        No tournaments available
      </td>
    </tr>
  ) : (
    tournaments.map((tournament, index) => (
      <tr key={tournament._id || index}>
        <td>{tournament.tournamentName}</td>
        <td>{tournament.winner}</td>
        <td>{tournament.date}</td>
        <td>{tournament.prizePool}</td>
        <td>
        <Link to={`/standings/${encodeURIComponent(tournament.tournamentName)}`}>
  View Standings
</Link>
        </td>
        <td>
          <button onClick={() => handleFollow(tournament._id)}>
            Follow
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTournamentPage;
