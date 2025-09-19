import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "../styles/FairPayoutSelection.css";

function FairPayoutSelection() {
  const navigate = useNavigate();
  const [showWinner, setShowWinner] = useState(false);

  // Timer logic
  useEffect(() => {
    let totalSeconds = 2 * 3600 + 45 * 60 + 32; // 2:45:32
    const hoursElement = document.querySelector(".payout-amount");

    function tick() {
      if (totalSeconds <= 0) return;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      if (hoursElement) {
        hoursElement.textContent = `${h}:${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`;
      }
      totalSeconds--;
    }

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Start selection -> show winner
  const startSelection = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    setShowWinner(true);
  };

  return (
    <div>
      

      {/* Container */}
      <div className="container">
        <div className="page-title">
          <h1>Fair Payout Selection</h1>
        </div>
        <p className="page-subtitle">
          Transparent, blockchain-verified random selection process
        </p>

        {/* Priority Alert */}
        <div className="priority-alert">
          <div className="alert-icon">⚠</div>
          <div className="alert-content">
            <div className="alert-title">
              🔺 Emergency Claim Priority
              <span className="emergency-badge">Emergency Priority</span>
            </div>
            <div className="alert-subtitle">
              Raj Patel • Emergency Fund Request
            </div>
            <div className="alert-description">
              Emergency claims receive automatic priority to the selection
              process to ensure community members get help when they need it
              most.
            </div>
          </div>
        </div>

        {/* Selection Info */}
        <div className="selection-info">
          <div className="info-icon">🕒</div>
          <div className="selection-details">
            <div className="selection-title">December 2024 Selection</div>
            <div className="selection-amount">Pool Amount: ₹2,000</div>
          </div>
          <div>
            <div className="payout-amount">2:45:32</div>
            <div className="payout-label">Time Until Selection</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Selection Gift Box / Winner */}
          <div className="selection-section">
            <h3 className="section-title">
              <div className="section-icon">🎁</div>
              Selection Gift Box
            </h3>

            {!showWinner ? (
              <div className="gift-box-container">
                <div className="gift-box" onClick={startSelection}>
                  <div className="gift-box-base"></div>
                  <div className="gift-box-lid"></div>
                  <div className="gift-ribbon-h"></div>
                  <div className="gift-ribbon-v"></div>
                  <div className="gift-bow"></div>
                </div>
                <button className="start-selection-btn" onClick={startSelection}>
                  Start Selection
                </button>
              </div>
            ) : (
              <div className="winner-section">
                <h2 className="winner-name">🎉 Raj Patel 🎉</h2>
                <button
                  className="pay-now-btn"
                  onClick={() => navigate("/confirmation")}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="participants-section">
            <div className="participants-header">
              <div className="participants-icon">👥</div>
              <h3 className="section-title" style={{ margin: 0 }}>
                Eligible Participants
              </h3>
            </div>

            {[
              { name: "Priya Sharma", percent: "20%" },
              { name: "Raj Patel", percent: "35%", emergency: true },
              { name: "Arjun Singh", percent: "18%" },
              { name: "Meera Joshi", percent: "15%" },
              { name: "Aryan Das", percent: "12%" },
            ].map((p, i) => (
              <div className="participant-item" key={i}>
                <div className="participant-info">
                  <div className="participant-avatar">{p.name[0]}</div>
                  <div className="participant-name">{p.name}</div>
                </div>
                <div className="participant-status">
                  {p.emergency && (
                    <span className="status-badge status-emergency">
                      Emergency
                    </span>
                  )}
                  <span className="percentage">{p.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h3>How Fair Selection Works</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon reputation">⭐</div>
              <div className="feature-title">Reputation Weighted</div>
              <div className="feature-description">
                Members with higher contributions get fairer selection odds
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon emergency">⚠</div>
              <div className="feature-title">Emergency Priority</div>
              <div className="feature-description">
                Verified emergency claims receive automatic priority selection
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon blockchain">🔗</div>
              <div className="feature-title">Blockchain Verified</div>
              <div className="feature-description">
                All selections are recorded on blockchain for complete
                transparency
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FairPayoutSelection;
