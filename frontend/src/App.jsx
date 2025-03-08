import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import CreateUser from "./Components/CreateUser"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-user" element={<CreateUser />} />
       
      </Routes>
    </Router>
  );
};

export default App;
