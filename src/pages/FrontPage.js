import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FrontPage.css";

// ✅ import smart contract helpers
import { registerMember, signCommitment } from "../blochain_frontend/contractServices";

const FrontPage = () => {
  const navigate = useNavigate();

  const joinCommunity = async () => {
    try {
      // 1️⃣ Register the user
      const tx1 = await registerMember();
      console.log("✅ Registered:", tx1?.hash);

      // 2️⃣ Sign commitment (500 mock tokens for example)
      const amount = 500; // you can set dynamically
      const tx2 = await signCommitment(amount);
      console.log("✅ Commitment signed:", tx2?.hash);

      alert("🎉 You successfully joined the community!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Failed to join:", err);
      alert("❌ Failed to join. Please approve in MetaMask.");
    }
  };

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
        <button className="join-btn" onClick={joinCommunity}>
          Join Community
        </button>
        <div className="pricing-info">
          Start with just ₹500/month • No hidden fees • Cancel anytime
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
