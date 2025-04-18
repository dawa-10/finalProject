
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/homepage" className="logo">Game Nepal</Link>
      <div className="nav-links">
        <Link to="/recent-tournaments">Recent</Link>
        <Link to="/ongoing-tournaments">Ongoing</Link>
        <Link to="/upcoming-tournaments">Upcoming</Link>
        <Link to="/user">User</Link>
      </div>
    </nav>
  );
};

export default Navbar;
