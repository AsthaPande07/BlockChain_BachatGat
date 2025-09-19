import React, { useState, useEffect } from "react";
import "../styles/CommunityDashboard.css";
import { useNavigate } from "react-router-dom";
import demoData from "../demo_data.json";

// 🔗 Blockchain services
import {
  connectWallet,
  getContracts,
  approveContribution,
  signCommitment,
} from "../blochain_frontend/contractServices";
import { ethers } from "ethers";

function CommunityDashboard() {
  const [showWarning, setShowWarning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [community, setCommunity] = useState(demoData.community);
  const [members, setMembers] = useState(demoData.members);
  const [walletAddress, setWalletAddress] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const navigate = useNavigate();

  // Load demo data & progress
  useEffect(() => {
    const percentage = Math.round(
      (community.poolBalance / community.targetBalance) * 100
    );
    setProgress(percentage);
  }, [community]);

  // 📡 Listen for blockchain events
  useEffect(() => {
    let savingsPool;

    async function setupListeners() {
      try {
        const { savingsPool: sp } = getContracts();
        savingsPool = sp;

        // ContributionReceived event
        savingsPool.on("ContributionReceived", (member, amount) => {
          const amt = parseInt(ethers.formatUnits(amount, 18));
          setCommunity((prev) => ({
            ...prev,
            poolBalance: prev.poolBalance + amt,
          }));

          setMembers((prev) =>
            prev.map((m) =>
              m.walletAddress.toLowerCase() === member.toLowerCase()
                ? { ...m, contribution: m.contribution + amt }
                : m
            )
          );

          setActivityLog((prev) => [
            `📥 ${member} contributed ${amt} tokens`,
            ...prev,
          ]);
        });

        // MemberRegistered event
        savingsPool.on("MemberRegistered", (member) => {
          setMembers((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              name: `Member ${prev.length + 1}`,
              walletAddress: member,
              contribution: 0,
              eligibilityStatus: true,
            },
          ]);

          setActivityLog((prev) => [
            `✅ New member registered: ${member}`,
            ...prev,
          ]);
        });
      } catch (err) {
        console.warn("⚠️ Event listener setup skipped (wallet not connected).");
      }
    }

    setupListeners();

    return () => {
      if (savingsPool) {
        savingsPool.removeAllListeners();
      }
    };
  }, []);

  // 🔘 Handle Pay Now (auto-debit + reputation)
  const handlePayNow = async () => {
    try {
      const wallet = await connectWallet();
      setWalletAddress(wallet);

      const amount = ethers.parseUnits("500", 18); // ₹500 fixed

      await approveContribution(amount);
      await signCommitment(amount);

      // update reputation
      const { reputation } = getContracts();
      await reputation.increaseReputation(wallet, 10);

      alert("✅ Contribution successful & reputation updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  // 🔘 Navigate to Manage Contribution page
  const handleManageContribution = () => {
    navigate("/contribution-info");
  };

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
          </div>
          <button
            className="close-warning"
            onClick={() => setShowWarning(false)}
          >
            ×
          </button>
        </div>
      )}

      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Community Dashboard</h1>
          <p className="welcome-text">
            Welcome back, {members[0].name}! 👋
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card wallet">
            <div className="stat-title">Wallet Balance</div>
            <div className="stat-amount">₹{members[0].contribution + 2000}</div>
          </div>
          <div className="stat-card monthly">
            <div className="stat-title">This Month</div>
            <div className="stat-amount">
              {members[0].contribution > 0 ? "Paid" : "Pending"}
            </div>
          </div>
          <div className="stat-card community">
            <div className="stat-title">Community Pool</div>
            <div className="stat-amount">₹{community.poolBalance}</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-title">Round {community.currentRound} Progress</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-details">
            <span>₹{community.poolBalance} collected</span>
            <span>Target: ₹{community.targetBalance}</span>
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <h3>👥 Community Members</h3>
          <div className="members-grid">
            {members.map((member) => (
              <div key={member.id} className="member-item">
                <div className="member-name">{member.name}</div>
                <div className="member-amount">₹{member.contribution}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-success" onClick={handlePayNow}>
            💸 Auto Debit
          </button>
          <button className="btn btn-primary" onClick={handleManageContribution}>
            📊 Manage Contribution
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/fair-payout")}
          >
            📈 View Payout Process
          </button>
        </div>

        {/* Activity Log */}
        <div className="activity-section">
          <h3>📜 Live Activity</h3>
          <ul>
            {activityLog.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommunityDashboard;
