import React, { useEffect, useState } from "react";
import "../styles/ClaimEmergency.css";

const ClaimEmergency = () => {
  const [timeLeft, setTimeLeft] = useState(2 * 24 * 3600 + 12 * 3600 + 26 * 60 + 28);
  const [activeTab, setActiveTab] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("Choose File");

  // ⏱ Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(timeLeft / (24 * 3600));
  const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // 📂 Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("Choose File");
    }
  };

  // 📌 Claims data
  const claims = [
    {
      id: 1,
      title: "Medical Emergency",
      user: "Alice Kumar",
      date: "Jan 15, 2024, 04:00 PM",
      status: "approved",
      description: "Urgent surgery required for my father. Hospital bills need immediate payment for life-saving operation.",
      document: "medical_bills_receipt.pdf",
      verification: "✓ Verified by 3rd party"
    },
    {
      id: 2,
      title: "Natural Disaster",
      user: "Rajesh Patel",
      date: "Jan 16, 2024, 07:50 PM",
      status: "pending",
      description: "House damaged due to recent floods. Need funds for temporary accommodation and basic necessities.",
      document: "flood_damage_report.pdf",
      verification: "✓ Verified by 3rd party"
    },
    {
      id: 3,
      title: "Family Crisis",
      user: "Mohammed Ali",
      date: "Jan 17, 2024, 10:15 PM",
      status: "pending",
      description: "Family emergency requiring immediate financial support for critical medical treatment.",
      document: "family_crisis_documents.pdf",
      verification: "✓ Verified by 3rd party"
    },
    {
      id: 4,
      title: "Job Loss",
      user: "Priya Singh",
      date: "Jan 14, 2024, 02:45 PM",
      status: "rejected",
      description: "Lost my job due to company downsizing. Need support for monthly expenses and children's education.",
      document: "termination_letter.pdf",
      verification: "✓ Verified by 3rd party",
      rejection: "Insufficient supporting documentation. Please provide additional proof of job loss and current financial situation."
    }
  ];

  const filteredClaims = claims.filter((claim) => claim.status === activeTab);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="emergency-icon">⚠</div>
        <h1>Emergency Handling</h1>
      </div>

      <p className="description">
        Submit emergency claims to access community support funds during critical situations. 
        All claims are reviewed by the community and verified through third-party documentation 
        to ensure authenticity and fair distribution of resources.
      </p>

      {/* Main Action */}
      <div className="main-action">
        <button className="claim-btn" onClick={() => setIsModalOpen(true)}>
          Claim your emergency
        </button>
        <div className="processing-info">
          <div className="clock-icon"></div>
          <span>Claims are processed within 24-48 hours</span>
        </div>
      </div>

      {/* Timer Section */}
      <div className="timer-section">
        <div className="timer-header">🕒 Emergency Claim Window</div>
        <div className="timer-text">You can raise an emergency claim within:</div>
        <div className="timer-display">
          <div className="timer-unit"><span className="timer-number">{days}</span><span className="timer-label">DAYS</span></div>
          <div className="timer-unit"><span className="timer-number">{hours}</span><span className="timer-label">HOURS</span></div>
          <div className="timer-unit"><span className="timer-number">{minutes}</span><span className="timer-label">MINS</span></div>
          <div className="timer-unit"><span className="timer-number">{seconds}</span><span className="timer-label">SECS</span></div>
        </div>
        <div className="timer-warning">After this period, emergency claims for this cycle will be closed.</div>
      </div>

      {/* Claims Section */}
      <div className="claims-section">
        <div className="claims-header">
          <h2>Emergency Claims</h2>
          <div className="verification-badge">✓ Third-party document verification enabled</div>
        </div>

        <div className="claims-tabs">
          <button className={`tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>🕒 Pending (2)</button>
          <button className={`tab ${activeTab === "approved" ? "active" : ""}`} onClick={() => setActiveTab("approved")}>✓ Approved (1)</button>
          <button className={`tab ${activeTab === "rejected" ? "active" : ""}`} onClick={() => setActiveTab("rejected")}>✗ Rejected (1)</button>
        </div>

        <div id="claimsContainer">
          {filteredClaims.map((claim) => (
            <div key={claim.id} className={`claim-item ${claim.status}-claim`}>
              <div className="claim-header">
                <div>
                  <div className="claim-title">{claim.title}</div>
                  <div className="claim-meta">Submitted by {claim.user} • {claim.date}</div>
                </div>
                <div className={`status-badge ${claim.status}`}>{claim.status.toUpperCase()}</div>
              </div>
              <div className="claim-description">{claim.description}</div>
              <div className="claim-footer">
                <div className="document-info">📄 {claim.document}</div>
                <div className="verification-status">{claim.verification}</div>
              </div>
              {claim.rejection && <div className="rejection-reason"><strong>Rejection Reason:</strong> {claim.rejection}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal active" onClick={(e) => e.target.classList.contains("modal") && setIsModalOpen(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Submit Emergency Claim</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert("Emergency claim submitted successfully!"); setIsModalOpen(false); }}>
              <div className="form-group">
                <label htmlFor="emergencyType">Emergency Type</label>
                <select id="emergencyType" className="form-control" required>
                  <option value="">Select emergency type</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="family">Family Crisis</option>
                  <option value="natural">Natural Disaster</option>
                  <option value="job">Job Loss</option>
                  <option value="accident">Accident</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description of Emergency</label>
                <textarea id="description" className="form-control" placeholder="Please provide detailed information about your emergency situation..." required></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="document">Upload Supporting Document</label>
                <div className="file-upload">
                  <input type="file" id="document" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} />
                  <div className="file-upload-btn"><span>{fileName}</span></div>
                </div>
                <div className="upload-hint">Upload proof of emergency (medical bills, official documents, etc.)</div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimEmergency;
