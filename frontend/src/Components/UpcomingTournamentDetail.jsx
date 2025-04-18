import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "../Styles/UpcomingTournamentDetail.css";

const UpcomingTournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tournaments/upcoming/${encodeURIComponent(id)}`
        );
        
        if (res.data.success) {
          setT(res.data.tournament);
        } else {
          setError("Tournament not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching details");
      }
      setLoading(false);
    };
  
    fetchTournament();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="tournament-detail-page">
      <Navbar />
      <div className="tournament-detail-container">
        <h1>{t?.tournamentName || "N/A"}</h1>

        <div className="detail-section">
          <h2>League Information</h2>
          <p><strong>Series:</strong> {t?.leagueInformation || "N/A"}</p>
        </div>

        <div className="detail-section">
          <h2>Organization</h2>
          <p><strong>Organizers:</strong> {t?.organizers?.join(", ") || "N/A"}</p>
        </div>

        <div className="detail-section">
          <h2>Game Details</h2>
          <p><strong>Version:</strong> {t?.gameVersion || "N/A"}</p>
          <p><strong>Mode:</strong> {t?.gameMode || "N/A"}</p>
          <p><strong>Type:</strong> {t?.type || "N/A"}</p>
        </div>

        <div className="detail-section">
          <h2>Event Details</h2>
          <p><strong>Location:</strong> {t?.location || "N/A"}</p>
          <p><strong>Prize Pool:</strong> {t?.prizePool || "N/A"}</p>
          <p><strong>Dates:</strong> {formatDate(t?.startDate)} - {formatDate(t?.endDate)}</p>
        </div>

        <div className="detail-section">
          <h2>Tournament Tier</h2>
          <p><strong>Liquipedia Tier:</strong> {t?.liquipediaTier || "N/A"}</p>
        </div>

        {t?.tournamentLink && (
          <div className="external-link">
            <a href={t.tournamentLink} target="_blank" rel="noopener noreferrer">
              View full details on Liquipedia
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingTournamentDetail;