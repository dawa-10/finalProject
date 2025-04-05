// /frontend/src/components/OngoingTournamentPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import NotificationBell from "./NotificationBell";
import "../Styles/Ongoing.css";

const OngoingTournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3000/api/tournaments/ongoing", {
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
    const username = localStorage.getItem("username");
    axios
      .post("http://localhost:3000/api/tournament/ongoing", { username, tournamentId })
      .then(() => alert("Tournament followed!"))
      .catch(() => alert("Error following tournament"));
  };

  return (
    <div>
      <Navbar />
      <NotificationBell />
      <div className="ongoing-tournaments-container">
        <h1>Ongoing Tournaments</h1>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="tournaments-table-wrapper">
            <table className="tournaments-table">
              <thead>
                <tr>
                  <th>Tournament Name</th>
                  <th>Link</th>
                  <th>Follow</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="error-message">No ongoing tournaments available</td>
                  </tr>
                ) : (
                  tournaments.map((tournament) => (
                    <tr key={tournament._id}>
                      <td>{tournament.tournamentName}</td>
                      <td>
                        <a href={tournament.tournamentLink} target="_blank" rel="noopener noreferrer">View</a>
                      </td>
                      <td>
                        <button onClick={() => handleFollow(tournament._id)}>Follow</button>
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

export default OngoingTournamentPage;
