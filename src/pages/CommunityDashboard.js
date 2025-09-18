import React, { useState, useEffect } from "react";
import "../styles/CommunityDashboard.css";
import { useNavigate } from "react-router-dom";
import demoData from "../demo_data.json"; // ✅ import demo data

function CommunityDashboard() {
  const [showWarning, setShowWarning] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Community data from JSON
  const community = demoData.community;
  const members = demoData.members;

  useEffect(() => {
    // animate progress bar on load
    setTimeout(() => {
      const percentage = Math.round(
        (community.poolBalance / community.targetBalance) * 100
      );
      setProgress(percentage);
    }, 500);
  }, [community]);

  return (
    <div className="dashboard-body">
      {/* Warning Banner */}
      {showWarning && (
        <div className="warning-banner">
          <div className="warning-content">
            <span className="warning-icon">⚠</span>
            <span>
              You're viewing a prototype with demo data. Do not enter personal info.
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
            Welcome back, {members[0].name}!{" "}
            <span className="welcome-emoji">👋</span>
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card wallet">
            <div className="stat-header">
              <div className="stat-title">Wallet Balance</div>
              <div className="stat-icon wallet">💰</div>
            </div>
            <div className="stat-amount">₹{members[0].contribution + 2000}</div>
            <div className="stat-change">+2.4% from last month</div>
          </div>

          <div className="stat-card monthly">
            <div className="stat-header">
              <div className="stat-title">This Month</div>
              <div className="stat-icon check">✓</div>
            </div>
            <div className="stat-amount">
              {members[0].contribution > 0 ? "Paid" : "Pending"}
            </div>
            <div className="stat-subtitle">
              ₹{members[0].contribution} on Dec 1
            </div>
          </div>

          <div className="stat-card community">
            <div className="stat-header">
              <div className="stat-title">Community Pool</div>
              <div className="stat-icon trend">📈</div>
            </div>
            <div className="stat-amount">₹{community.poolBalance}</div>
            <div className="stat-subtitle">
              {community.membersPaid}/{community.totalMembers} members paid
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <div className="progress-title">
              <div className="progress-icon">📅</div>
              <span>Round {community.currentRound} Collection Progress</span>
            </div>
            <div className="progress-percentage">{progress}% Complete</div>
          </div>
          <div className="progress-subtitle">
            {community.membersPaid} of {community.totalMembers} members have contributed
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="progress-details">
            <span>₹{community.poolBalance} collected</span>
            <span>₹{community.targetBalance} target</span>
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <div className="members-header">
            <div className="members-icon">👥</div>
            <div className="members-title">Community Members</div>
          </div>

          <div className="members-grid">
            {members.map((member) => (
              <div className="member-item" key={member.id}>
                <div className="member-info">
                  <div className={`member-avatar ${member.eligibilityStatus ? "green" : "red"}`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-details">
                    <div className="member-name">{member.name}</div>
                    <div className="member-amount">₹{member.contribution}</div>
                  </div>
                </div>
                <div className="member-status">
                  <div
                    className={`status-badge ${
                      member.contribution > 0 ? "paid" : "pending"
                    }`}
                  >
                    <span>{member.contribution > 0 ? "✓" : "🕒"}</span>
                    <span>{member.contribution > 0 ? "Paid" : "Pending"}</span>
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
            onClick={() => navigate("/fair-payout")}
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
