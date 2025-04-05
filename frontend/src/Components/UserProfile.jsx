// components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <h2>Followed Tournaments</h2>
      {profile.followedTournaments && profile.followedTournaments.length > 0 ? (
        profile.followedTournaments.map((tournament) => (
          <div key={tournament._id}>
            <h3>{tournament.tournamentName}</h3>
            <p>{tournament.date}</p>
          </div>
        ))
      ) : (
        <p>No followed tournaments yet.</p>
      )}
    </div>
  );
};

export default UserProfile;
