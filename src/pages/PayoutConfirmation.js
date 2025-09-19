import React from "react";
import "../styles/PayoutConfirmation.css";

export default function PayoutConfirmation() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const viewBlockchain = () => {
    alert(
      "This would typically redirect to a blockchain explorer like Polygonscan to view the transaction details."
    );
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="success-icon"></div>
        <h1>
          <span className="party-emoji">🎉</span> Payout Confirmed!
        </h1>
        <p>The December 2024 community payout has been successfully processed</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-name">Raj Patel</div>
        <div className="winner-badge">December 2024 Winner</div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Member Since</span>
            <span className="stat-value">June 2024</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Wallet Address</span>
            <span className="stat-value">
              0x742d...E8A9
              <button
                className="copy-btn"
                onClick={() => copyToClipboard("0x742d...E8A9")}
              >
                📋
              </button>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Contributions</span>
            <span className="stat-value">6 months</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Reputation</span>
            <span className="stat-value">
              <span className="star-rating">⭐</span> 4.9/5.0
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="transaction-card">
        <div className="card-header">
          <span className="card-icon">📄</span>
          Transaction Details
        </div>

        <div className="transaction-grid">
          <div className="amount-section">
            <div className="amount-label">Payout Amount</div>
            <div className="amount-value">₹25,000</div>
            <div className="amount-currency">USDC Stablecoin</div>
          </div>

          <div className="hash-section">
            <div className="hash-label">🔗 Transaction Hash</div>
            <div className="hash-value">
              0x971471cd7da7e8
              <button
                className="copy-btn"
                onClick={() => copyToClipboard("0x971471cd7da7e8")}
              >
                📋
              </button>
            </div>
            <div className="confirmed-badge">✓ Confirmed on Blockchain</div>
          </div>
        </div>

        <div className="transaction-details">
          <div className="detail-item">
            <span className="detail-label">Transaction Date</span>
            <span className="detail-value">Dec 5, 2024, 2:30 PM</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Processing Time</span>
            <span className="detail-value">2.3 seconds</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Network</span>
            <span className="detail-value">Polygon</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Gas Fee</span>
            <span className="detail-value">₹2.50</span>
          </div>
        </div>
      </div>

      {/* Community Impact */}
      <div className="impact-card">
        <div className="impact-header">Community Impact</div>

        <div className="impact-stats">
          <div className="impact-stat">
            <div className="impact-icon">👥</div>
            <div className="impact-number">8</div>
            <div className="impact-label">Members Contributed</div>
          </div>
          <div className="impact-stat">
            <div className="impact-icon">📈</div>
            <div className="impact-number">₹25,000</div>
            <div className="impact-label">Total Pool Amount</div>
          </div>
          <div className="impact-stat">
            <div className="impact-icon">📅</div>
            <div className="impact-number">6</div>
            <div className="impact-label">Months Active</div>
          </div>
        </div>

        <div className="impact-message">
          This payout helps Raj Patel achieve their financial goals while
          strengthening our community bond. <br />
          Every contribution matters, and together we grow stronger! 💪
        </div>
      </div>

      {/* Next Steps */}
      <div className="next-steps">
        <div className="steps-header">What Happens Next?</div>

        <div className="step-item">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Winner Notification</h4>
            <p>Raj Patel has been notified and funds are transferred</p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>New Cycle Begins</h4>
            <p>January 2025 contribution cycle starts on January 1st</p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Transparent Records</h4>
            <p>
              All transaction details recorded on blockchain for complete
              transparency
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <button className="blockchain-btn" onClick={viewBlockchain}>
        View Blockchain Ledger
      </button>
      <div className="footer-text">
        See complete transaction history and transparency records
      </div>
    </div>
  );
}