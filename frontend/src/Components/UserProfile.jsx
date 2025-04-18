import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../Styles/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }
    axios
      .get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
      });
  }, []);


const handleDelete = async (tournamentId) => {
  try {
    const token = localStorage.getItem("token");
    
 
    if (!tournamentId.match(/^[0-9a-fA-F]{24}$/)) {
      alert('Invalid tournament ID format');
      return;
    }

    const response = await axios.delete(
      `http://localhost:3000/api/tournaments/${tournamentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000 // 5-second timeout
      }
    );

    if (response.data.success) {
      setProfile(prev => ({
        ...prev,
        followedTournaments: prev.followedTournaments.filter(
          t => t._id !== tournamentId
        )
      }));
      alert('Successfully deleted tournament');
    }
  } catch (error) {
    let message = 'Unknown error';
    if (error.response) {
      message = `Server Error: ${error.response.data.error}`;
      if (error.response.data.collectionStats) {
        console.error('Database Status:', error.response.data.collectionStats);
      }
    } else if (error.request) {
      message = 'No response from server';
    } else {
      message = error.message;
    }
    alert(`Delete Failed: ${message}`);
  }
};

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="loading-message">Loading profile...</div>;

  return (
    <>
      <Navbar username={profile.username} />
      <div className="profile-container">
        <div className="profile-header">
          <h1>{profile.username}'s Profile</h1>
        </div>

        <div className="followed-tournaments">
          <h2>Followed Tournaments</h2>
          {profile.followedTournaments && profile.followedTournaments.length > 0 ? (
            profile.followedTournaments.map((tournament) => (
              <div className="tournament-card" key={tournament._id}>
                <h3 className="tournament-name">{tournament.tournamentName}</h3>
                <p className="tournament-date">{tournament.date}</p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(tournament._id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No followed tournaments yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
