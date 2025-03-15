import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css"


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo">
          Game Nepal
        </Link>
      </div>
      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/recent-tournaments">Recent Tournaments</Link>
          </li>
          <li>
            <Link to="/upcoming-tournaments">Upcoming Tournaments</Link>
          </li>
          <li>
            <Link to="/user">User</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
