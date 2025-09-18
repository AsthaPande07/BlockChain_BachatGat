import React, { useState, useEffect } from "react";
import "../styles/CommunityDashboard.css";
import { useNavigate } from "react-router-dom";

function CommunityDashboard() {
  const [showWarning, setShowWarning] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // animate progress bar on load
    setTimeout(() => {
      setProgress(75);
    }, 500);
  }, []);

  return (
    <div className="dashboard-body">
      {/* Warning Banner */}
      {showWarning && (
        <div className="warning-banner">
          <div className="warning-content">
            <span className="warning-icon">⚠</span>
            <span>
              You're viewing something built by another Figma user. Be careful
              when entering any personal information.
            </span>
            <span className="learn-more">Learn more</span>
          </div>
          <button
            className="close-warning"
            onClick={() => setShowWarning(false)}
          >
            ×
          </button>
        </div>
      )}

    

      {/* Main Container */}
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Community Dashboard</h1>
          <p className="welcome-text">
            Welcome back, Priya Sharma! <span className="welcome-emoji">👋</span>
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card wallet">
            <div className="stat-header">
              <div className="stat-title">Wallet Balance</div>
              <div className="stat-icon wallet">💰</div>
            </div>
            <div className="stat-amount">₹2,500</div>
            <div className="stat-change">+2.4% from last month</div>
          </div>

          <div className="stat-card monthly">
            <div className="stat-header">
              <div className="stat-title">This Month</div>
              <div className="stat-icon check">✓</div>
            </div>
            <div className="stat-amount">Paid</div>
            <div className="stat-subtitle">₹500 on Dec 1</div>
          </div>

          <div className="stat-card community">
            <div className="stat-header">
              <div className="stat-title">Community Pool</div>
              <div className="stat-icon trend">📈</div>
            </div>
            <div className="stat-amount">₹3,000</div>
            <div className="stat-subtitle">6/8 members paid</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <div className="progress-title">
              <div className="progress-icon">📅</div>
              <span>December 2024 Collection Progress</span>
            </div>
            <div className="progress-percentage">75% Complete</div>
          </div>
          <div className="progress-subtitle">
            6 of 8 members have contributed this month
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="progress-details">
            <span>₹3000 collected</span>
            <span>₹4000 target</span>
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <div className="members-header">
            <div className="members-icon">👥</div>
            <div className="members-title">Community Members</div>
          </div>

          <div className="members-grid">
            {[
              { name: "Priya Sharma", amount: "₹500", status: "paid", color: "blue" },
              { name: "Raj Patel", amount: "₹500", status: "paid", color: "orange" },
              { name: "Anita Singh", amount: "₹500", status: "paid", color: "purple" },
              { name: "Kumar Reddy", amount: "₹0", status: "pending", color: "orange" },
              { name: "Meera Joshi", amount: "₹500", status: "paid", color: "green" },
              { name: "Vijay Kumar", amount: "₹500", status: "paid", color: "yellow" },
              { name: "Sita Devi", amount: "₹0", status: "pending", color: "blue" },
              { name: "Arjun Das", amount: "₹500", status: "paid", color: "orange" },
            ].map((member, index) => (
              <div className="member-item" key={index}>
                <div className="member-info">
                  <div className={`member-avatar ${member.color}`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-details">
                    <div className="member-name">{member.name}</div>
                    <div className="member-amount">{member.amount}</div>
                  </div>
                </div>
                <div className="member-status">
                  <div
                    className={`status-badge ${
                      member.status === "paid" ? "paid" : "pending"
                    }`}
                  >
                    <span>{member.status === "paid" ? "✓" : "🕒"}</span>
                    <span>
                      {member.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/contribution")}
          >
            <div className="btn-title">📊 Manage Contribution</div>
            <div className="btn-subtitle">
              Set up auto-debit & check reputation
            </div>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/contribution")}
          >
            <div className="btn-title">📈 View Payout Process</div>
            <div className="btn-subtitle">See how fair selection works</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityDashboard;
