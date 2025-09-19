import React, { useState, useEffect } from "react";
import "../styles/CommunityDashboard.css";
import { useNavigate } from "react-router-dom";
import demoData from "../demo_data.json"; // ✅ import demo data

// 🔗 Blockchain services
import {
  connectWallet,
  getContracts,
  approveContribution,
  signCommitment,
} from "../blochain_frontend/contractServices";
import { ethers } from "ethers";

function CommunityDashboard() {
  const [progress, setProgress] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);
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

  // 🔘 Handle Auto Debit (smart contract integration)
  const handleAutoDebit = async () => {
    try {
      // connect wallet
      const wallet = await connectWallet();
      setWalletAddress(wallet);

      // define contribution amount (example: ₹500)
      const amount = ethers.parseUnits("500", 18);

      // approve contribution on smart contract
      await approveContribution(amount);

      // sign commitment
      await signCommitment(amount);

      // update reputation in smart contract
      const { reputation } = getContracts();
      await reputation.increaseReputation(wallet, 10);

      alert("✅ Auto debit successful & reputation updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="dashboard-body">
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
            {community.membersPaid} of {community.totalMembers} members have
            contributed
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
                  <div
                    className={`member-avatar ${
                      member.eligibilityStatus ? "green" : "red"
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-details">
                    <div className="member-name">{member.name}</div>
                    <div className="member-amount">
                      ₹{member.contribution}
                    </div>
                  </div>
                </div>
                <div className="member-status">
                  <div
                    className={`status-badge ${
                      member.contribution > 0 ? "paid" : "pending"
                    }`}
                  >
                    <span>{member.contribution > 0 ? "✓" : "🕒"}</span>
                    <span>
                      {member.contribution > 0 ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {/* 🔘 Auto Debit Button */}
          <button className="btn btn-success" onClick={handleAutoDebit}>
            💸 Auto Debit
          </button>

          {/* Manage Contribution */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/contribution")}
          >
            <div className="btn-title">📊 Manage Contribution</div>
            <div className="btn-subtitle">
              Set up auto-debit & check reputation
            </div>
          </button>

          {/* View Payout */}
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
