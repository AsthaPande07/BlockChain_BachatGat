// src/pages/Home.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { connectWallet } from "../blochain_frontend/contractServices"; // ✅ import MetaMask connect

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Animations
    const features = document.querySelectorAll(".feature-item");
    features.forEach((feature, index) => {
      feature.style.opacity = "0";
      feature.style.transform = "translateY(20px)";
      setTimeout(() => {
        feature.style.transition = "all 0.6s ease";
        feature.style.opacity = "1";
        feature.style.transform = "translateY(0)";
      }, 300 + index * 100);
    });

    const stats = document.querySelectorAll(".stat");
    stats.forEach((stat, index) => {
      stat.style.opacity = "0";
      stat.style.transform = `translateX(${index === 0 ? "-20px" : "20px"})`;
      setTimeout(() => {
        stat.style.transition = "all 0.6s ease";
        stat.style.opacity = "1";
        stat.style.transform = "translateX(0)";
      }, 600 + index * 200);
    });

    const buttons = document.querySelectorAll(".auth-button");
    buttons.forEach((btn, index) => {
      btn.style.opacity = "0";
      btn.style.transform = "translateY(30px)";
      setTimeout(() => {
        btn.style.transition = "all 0.8s ease";
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      }, 800 + index * 200);
    });

    // Parallax background
    const handleMouseMove = (e) => {
      const circles = document.querySelectorAll(".bg-circle");
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.01;
        const x = mouseX * speed;
        const y = mouseY * speed;
        circle.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Create Account → Only connect MetaMask
  const handleRegister = async () => {
    try {
      const address = await connectWallet();
      console.log("✅ Wallet connected:", address);
      alert(`Wallet connected: ${address}`);
      navigate("/front"); // then go to front page
    } catch (err) {
      console.error(err);
      alert("❌ Please connect MetaMask to continue.");
    }
  };

  const handleSignIn = () => {
    alert("Redirecting to sign in... 🔑");
    navigate("/signin");
  };

  return (
    <>
      <div className="bg-elements">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>

      <div className="container">
        <div className="logo">
          <div className="logo-circle">
            <div className="logo-inner"></div>
            <div className="logo-dot"></div>
          </div>
        </div>

        <h1 className="main-title">Blockchain Bachat Ghat</h1>
        <h2 className="subtitle">Save Together. Grow Together.</h2>

        <p className="welcome-text">
          Welcome to India's most trusted community savings platform. Join
          thousands who are building wealth together.
        </p>

        <div className="features-preview">
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <div className="feature-label">Community</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <div className="feature-label">Secure</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📈</div>
            <div className="feature-label">Growth</div>
          </div>
        </div>

        <div className="auth-buttons">
          <button className="auth-button register-btn" onClick={handleRegister}>
            Create Account
          </button>

          <div className="divider">or</div>

          <button className="auth-button signin-btn" onClick={handleSignIn}>
            Sign In
          </button>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-number">12,450+</span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat">
            <span className="stat-number">₹2.4 Cr+</span>
            <span className="stat-label">Pooled Savings</span>
          </div>
        </div>
      </div>
    </>
  );
}
