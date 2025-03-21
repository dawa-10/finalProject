import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../Styles/Recent.css";

const RecentTournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3000/api/recent-tournaments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const filteredTournaments = response.data.filter(
            (tournament) =>
              tournament.tournamentName !== "Unknown Tournament" &&
              tournament.tournamentName.trim() !== ""
          );
          setTournaments(filteredTournaments);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((err) => {
          setError("Failed to fetch tournaments");
          setLoading(false); // Set loading to false even if there's an error
        });
    }
  }, [navigate]);

  return (
    
    <div className="recent-tournaments-container">
      <Navbar/>
      <h1>Recent Tournaments</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading...</p> // Show loading text while fetching data
      ) : (
        <div className="tournaments-table-wrapper">
          <table className="tournaments-table">
            <thead>
              <tr>
                <th>Tournament Name</th>
                <th>Winner</th>
                <th>Date</th>
                <th>Prize Pool</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="error-message">
                    No tournaments available
                  </td>
                </tr>
              ) : (
                tournaments.map((tournament, index) => (
                  <tr key={index}>
                    <td>{tournament.tournamentName}</td>
                    <td>{tournament.winner}</td>
                    <td>{tournament.date}</td>
                    <td>{tournament.prizePool}</td>
                    <td>
                      <a
                        href={tournament.tournamentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      )}
      <p><a href="/upcoming-tournaments">hi</a></p>
    </div>
    
  );
};

export default RecentTournamentPage;
