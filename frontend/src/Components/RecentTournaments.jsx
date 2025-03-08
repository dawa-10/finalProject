import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecentTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    // Fetch the recent tournaments from your backend (scraped data)
    axios
      .get("http://localhost:3000/recent-tournaments")
      .then((response) => {
        setTournaments(response.data); // Set tournaments data
      })
      .catch((error) => {
        console.error("Error fetching tournaments:", error);
      });
  }, []);

  return (
    <div>
      <h1>Recent Tournaments</h1>
      {tournaments.length > 0 ? (
        <table>
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
            {tournaments.map((tournament, index) => (
              <tr key={index}>
                <td>{tournament.tournamentName}</td>
                <td>{tournament.winner}</td>
                <td>{tournament.date}</td>
                <td>{tournament.prizePool}</td>
                <td>
                  <a href={tournament.tournamentLink} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tournaments available.</p>
      )}
    </div>
  );
}
