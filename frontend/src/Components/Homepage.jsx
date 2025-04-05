import React from "react";
import { Link } from "react-router-dom";
import "../Styles/HomePage.css";

const HomePage = () => {
 

  return (
    
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Game Nepal</h1>
          <p>Your premier platform for PUBG Mobile esports in Nepal</p>
          <div className="hero-buttons">
            
            <Link to="/login" className="btn btn-secondary">Register Now</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="features-container">
        <h2 className="section-title">What We Offer</h2>
        <div className="features-row">
          {/* Live Tournament Card */}
          <div className="feature-card live-card">
            <div className="live-badge">LIVE</div>
            <div className="feature-icon">🔴</div>
            <h3>Live Tournament</h3>
            <div className="tournament-details">
              <p>Track your favrouite tournaments data live.</p>
            </div>
            <Link to="/ongoing-tournaments" className="btn-card">
              Watch Now
            </Link>
          </div>

          {/* Regular Feature Cards */}
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Recent Tournaments</h3>
            <p>Explore results and statistics from completed PUBG Mobile tournaments.</p>
            <Link to="/recent-tournaments" className="btn-card">
              View Results
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Upcoming Events</h3>
            <p>Discover and register for upcoming PUBG Mobile competitions.</p>
            <Link to="/upcoming-tournaments" className="btn-card">
              See Schedule
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Player Profile</h3>
            <p>Manage your account, stats, and tournament registrations.</p>
            <Link to="/user" className="btn-card">
              Your Profile
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Are you Ready?</h2>
        <p>Join Nepal's fastest growing PUBG Mobile community today</p>
        <Link to="/login" className="btn-primary btn-large">
          Register Now
        </Link>
      </div>
    </div>

   
  );
};

export default HomePage;