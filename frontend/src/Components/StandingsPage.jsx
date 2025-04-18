
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../Styles/Standings.css';

const StandingsPage = () => {
  const { tournamentName } = useParams();
  console.log("Route param tournamentName:", tournamentName); 

  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        
        const normalizedName = decodeURIComponent(tournamentName).trim().replace(/\s+/g, ' ');
        console.log("Normalized tournament name:", normalizedName);

        const encodedName = encodeURIComponent(normalizedName);
        const response = await axios.get(
          `http://localhost:3000/api/tournaments/standings/${encodedName}`
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setStandings(response.data.standings);
      } catch (err) {
        console.error("Error fetching standings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [tournamentName]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="standings-page">
      <Navbar />
      <div className="container">
        <h1>{standings.tournamentName} Standings</h1>
        {standings && (
          <div className="standings-table">
            <div className="table-header">
              <div>Rank</div>
              <div>Team</div>
              <div>Points</div>
            </div>
            {standings.teams && standings.teams.map((team) => (
              <div className="table-row" key={team.rank}>
                <div>{team.rank}</div>
                <div>{team.teamName}</div>
                <div>{team.total}</div>
              </div>
            ))}
          </div>
        )}
        {standings.mvp && (
          <div className="mvp-section">
            <h3>MVP: {standings.mvp.playerName}</h3>
            <p>Team: {standings.mvp.team}</p>
            <p>Country: {standings.mvp.country}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandingsPage;
