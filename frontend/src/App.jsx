import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import RecentTournamentPage from "./Components/RecentTournaments";
import CreateUser from "./Components/CreateUser";
import UpcomingTournamentPage from "./Components/UpcomingTournament";
import HomePage from "./Components/Homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recent-tournaments" element={<RecentTournamentPage />} />
        <Route path="/create-user" element={<CreateUser/>}/>
        <Route path ="/upcoming-tournaments" element={<UpcomingTournamentPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
