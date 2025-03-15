import React from "react";
import { Link } from "react-router-dom";


const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to Game Nepal</h1>
        <p>Your go-to platform for PUBG Mobile tournaments</p>
      </header>
      <div className="home-content">
        <section className="home-section">
          <h2>Recent Tournaments</h2>
          <p>Check out the most recent PUBG Mobile tournaments and their results.</p>
          <Link to="/recent-tournaments" className="btn-primary">
            View Recent Tournaments
          </Link>
        </section>
        <section className="home-section">
          <h2>Upcoming Tournaments</h2>
          <p>Stay updated on upcoming PUBG Mobile tournaments and their details.</p>
          <Link to="/upcoming-tournaments" className="btn-primary">
            View Upcoming Tournaments
          </Link>
        </section>
        <section className="home-section">
          <h2>Your Profile</h2>
          <p>Manage your account and settings.</p>
          <Link to="/user" className="btn-primary">
            Go to Your Profile
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
