import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "../styles/FrontPage.css";

const FrontPage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Navigate to CommunityDashboard page
  const joinCommunity = () => {
    navigate("/dashboard"); // 👈 change the path to your route
  };

  // Animate feature cards on load
  useEffect(() => {
    const cards = document.querySelectorAll(".feature-card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.transition = "all 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 200);
    });
  }, []);

  return (
    <div className="container">
      {/* Logo */}
      <div className="logo">
        <div className="logo-circle">
          <div className="logo-inner">🌍</div>
          <div className="logo-accent">💰</div>
        </div>
      </div>

      <h1>Blockchain Bachat Chat</h1>
      <div className="subtitle">Save Together, Grow Together.</div>

      <p className="description">
        Join a trusted community where neighbors help neighbors. Pool your savings,
        earn fair returns, and access funds when you need them most.
      </p>

      {/* Features */}
      <div className="features">
        <div className="feature-card community">
          <div className="feature-icon">👥</div>
          <h3 className="feature-title">Community First</h3>
          <p className="feature-description">
            Built by the community, for the community. Everyone contributes, everyone benefits.
          </p>
        </div>

        <div className="feature-card blockchain">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Blockchain Secured</h3>
          <p className="feature-description">
            Transparent, immutable records ensure fair play and complete accountability.
          </p>
        </div>

        <div className="feature-card returns">
          <div className="feature-icon">📈</div>
          <h3 className="feature-title">Growing Returns</h3>
          <p className="feature-description">
            Earn better returns through collective savings and smart fund allocation.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <button className="join-btn" onClick={joinCommunity}>Join Community</button>
        <div className="pricing-info">
          Start with just ₹500/month • No hidden fees • Cancel anytime
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
