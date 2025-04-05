import React, { useEffect, useState } from "react";
import TournamentCard from "./TournamentCard";

const TournamentList = ({ userId }) => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/tournaments");
                const data = await response.json();
                setTournaments(data);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            }
        };

        fetchTournaments();
    }, []);

    return (
        <div>
            <h2>Available Tournaments</h2>
            {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                    <TournamentCard key={tournament._id} tournament={tournament} userId={userId} />
                ))
            ) : (
                <p>No tournaments available.</p>
            )}
        </div>
    );
};

export default TournamentList;
