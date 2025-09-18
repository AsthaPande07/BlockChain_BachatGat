import React, { useState, useEffect } from "react";
import "../styles/ContributionReputation.css";

const ContributionReputation = () => {
  const [autoDebitActive, setAutoDebitActive] = useState(true);
  const [countdown, setCountdown] = useState({ days: 2, hours: 14, minutes: 32 });

  // Toggle Auto Debit
  const toggleAutoDebit = () => {
    setAutoDebitActive(!autoDebitActive);
  };

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes } = prev;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            hours = 23;
            days--;
          }
        }
        return { days, hours, minutes };
      });
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const payNow = () => alert("Redirecting to payment gateway...");
  const setReminder = () => alert("Reminder set! You will be notified before grace period ends.");
  const backToDashboard = () => alert("Navigating back to dashboard...");
  const viewSelectionProcess = () => alert("Viewing selection process details...");

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Contribution & Reputation</h1>
        <p>Manage your monthly contributions and track your community standing</p>
      </div>

      {/* Top Row */}
      <div className="top-row">
        {/* Auto-debit Setup */}
        <div className="card auto-debit-card">
          <div className="card-header">
            <span className="card-icon">💳</span> Auto-debit Setup
          </div>

          <div className="auto-debit-main">
            <div className="auto-debit-info">
              <h3>Monthly Auto-debit</h3>
              <p>₹500 on 1st of every month</p>
            </div>
            <div
              className={`toggle-switch ${autoDebitActive ? "active" : ""}`}
              onClick={toggleAutoDebit}
            ></div>
          </div>

          <div className="account-info">
            <div className="info-row">
              <span className="info-label">Connected Account</span>
              <span className="info-value">HDFC Bank ••••2847</span>
            </div>
            <div className="info-row">
              <span className="info-label">Next Debit</span>
              <span className="info-value">Jan 1, 2025</span>
            </div>
          </div>

          <div className="status-box">
            <span className="status-icon">✓</span>
            <span className="status-text">Auto-debit Active</span>
          </div>
        </div>

        {/* Reputation Score */}
        <div className="card reputation-card">
          <div className="card-header">
            <span className="card-icon">⭐</span> Reputation Score
          </div>

          <div className="stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star empty">★</span>
          </div>

          <div className="score">4.8/5.0</div>
          <div className="status">Excellent Standing</div>

          <div className="reputation-stats">
            <div className="stat-row">
              <span className="stat-label">On-time Payments</span>
              <span className="stat-value">95% (19/20)</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Community Contributions</span>
              <span className="stat-value">6 months</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Penalty Points</span>
              <span className="stat-value">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grace Period Reminder */}
      <div className="grace-period">
        <div className="grace-header">
          <span className="warning-icon">⚠️</span>
          <span className="grace-title">Grace Period Reminder</span>
        </div>

        <div className="grace-message">
          Your December contribution is due. You have a 5-day grace period before penalties apply.
        </div>

        <div className="countdown">
          <div className="countdown-time">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m
          </div>
          <div className="countdown-label">Time remaining in grace period</div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={payNow}>Pay Now</button>
          <button className="btn btn-secondary" onClick={setReminder}>Set Reminder</button>
        </div>
      </div>

      {/* Contribution History */}
      <div className="card history-card">
        <div className="history-header">
          <span className="card-icon">📋</span> Contribution History
        </div>

        {[
          { month: "Nov 2024", status: "On Time", icon: "✓", badge: "on-time" },
          { month: "Oct 2024", status: "On Time", icon: "✓", badge: "on-time" },
          { month: "Sep 2024", status: "On Time", icon: "✓", badge: "on-time" },
          { month: "Aug 2024", status: "On Time", icon: "✓", badge: "on-time" },
          { month: "Jul 2024", status: "Late", icon: "⚠", badge: "late" },
          { month: "Jun 2024", status: "On Time", icon: "✓", badge: "on-time" },
        ].map((item, i) => (
          <div key={i} className="history-item">
            <div className="history-left">
              <div className={`history-icon ${item.badge === "on-time" ? "success" : "warning"}`}>
                {item.icon}
              </div>
              <div className="history-details">
                <h4>{item.month}</h4>
                <p>Paid on {item.month.split(" ")[0]} 1</p>
              </div>
            </div>
            <div className="history-right">
              <div className="history-amount">₹500</div>
              <span className={`status-badge ${item.badge}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reputation Benefits */}
      <div className="card benefits-card">
        <div className="benefits-header">
          <span className="card-icon">🎁</span> Reputation Benefits
        </div>

        <div className="benefits-grid">
          <div className="benefit-item green">
            <div className="benefit-icon green">📈</div>
            <div className="benefit-title green">Higher Selection Chance</div>
            <div className="benefit-desc green">Better reputation = better odds</div>
          </div>
          <div className="benefit-item blue">
            <div className="benefit-icon blue">💳</div>
            <div className="benefit-title blue">Emergency Loans</div>
            <div className="benefit-desc blue">Access to quick funding</div>
          </div>
          <div className="benefit-item purple">
            <div className="benefit-icon purple">⭐</div>
            <div className="benefit-title purple">Community Trust</div>
            <div className="benefit-desc purple">Earn member respect</div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bottom-buttons">
        <button className="btn-outline" onClick={backToDashboard}>Back to Dashboard</button>
        <button className="btn-solid" onClick={viewSelectionProcess}>View Selection Process</button>
      </div>
    </div>
  );
};

export default ContributionReputation;