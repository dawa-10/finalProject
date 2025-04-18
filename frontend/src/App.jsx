import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/Homepage";
import LoginPage from "./Components/LoginPage";
import CreateUser from "./Components/CreateUser";
import RecentTournamentPage from "./Components/RecentTournaments";
import UpcomingTournamentPage from "./Components/UpcomingTournament";
import UpcomingTournamentDetail from "./Components/UpcomingTournamentDetail";
import OngoingTournamentPage from "./Components/OngoingTournamentPage";
import StandingsPage from "./Components/StandingsPage";
import UserProfile from "./Components/UserProfile";
import PrivateRoute from "./Components/PrivateRoute";
import OngoingTournamentDetail from './Components/OngoingTournamentDetail';


function App() {
  return (
    <Routes>
     
      <Route path="/"                 element={<LoginPage />} />
      <Route path="/login"            element={<LoginPage />} />
      <Route path="/homepage"         element={<HomePage />} />
      <Route path="/create-user"      element={<CreateUser />} />
      <Route path="/upcoming/:id"     element={<UpcomingTournamentDetail />} />
<Route path="/ongoing/:tournamentName" element={<OngoingTournamentDetail />} />
      <Route 
        path="/recent-tournaments" 
        element={
          <PrivateRoute>
            <RecentTournamentPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/upcoming-tournaments" 
        element={
          <PrivateRoute>
            <UpcomingTournamentPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/ongoing-tournaments" 
        element={
          <PrivateRoute>
            <OngoingTournamentPage />
          </PrivateRoute>
        } 
      />
      <Route path="/standings/:tournamentName" element={<StandingsPage />} />
      <Route 
        path="/user" 
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;
