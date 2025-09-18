import React from "react";
import "../styles/ContributionReputation.css";

function ContributionReputation() {
  return (
    <div className="container py-4 contribution-body">
      {/* Title */}
      <div className="text-center mb-4">
        <h5 className="mb-1">Blockchain Micro-Insurance App</h5>
        <div>
          <span className="text-secondary">Contribution & Reputation</span>
        </div>
        <p className="mb-2">
          Manage your monthly contributions and track your community standing
        </p>
      </div>

      <div className="row gy-3">
        {/* Auto-Debit Setup */}
        <div className="col-md-6">
          <div className="card p-3 bg-success bg-opacity-10 border-success">
            <h6 className="mb-2">
              <i className="bi bi-bank"></i> Auto-debit Setup
            </h6>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div>
                    <strong>Monthly Auto-debit</strong>
                  </div>
                  <div>₹500 to 1st of every month</div>
                  <div className="mt-1 small text-muted">
                    Connected Account: HDFC Bank ****2467
                  </div>
                </div>
                <div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="mt-2 small">
                <span className="badge bg-success">Auto-debit Active</span>{" "}
                Payment will be automatically debited as per schedule.
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Score */}
        <div className="col-md-6">
          <div className="card p-3 bg-primary bg-opacity-10 border-primary">
            <h6>
              <i className="bi bi-star"></i> Reputation Score
            </h6>
            <div className="fs-4 mb-2 text-warning">★★★★★</div>
            <div>
              <span className="fs-5 fw-bold">4.8/5.0</span>
              <span className="ms-3 text-success">Excellent Standing</span>
            </div>
            <div className="mt-2 small">
              <span>
                On-time Payments: <b>95%</b> (57/60)
              </span>
              <br />
              <span>
                Community Contributions: <b>6 months</b>
              </span>
              <br />
              <span>
                Penalty Points: <b>0</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grace Period Reminder */}
      <div className="card my-4 p-3 bg-warning bg-opacity-10 border-warning">
        <h6>
          <i className="bi bi-exclamation-triangle"></i> Grace Period Reminder
        </h6>
        <div className="mb-1">
          Your December contribution is due. You have a 5-day grace period before
          penalties apply.
        </div>
        <div className="fw-bold text-danger mb-1">2d 14h 32m</div>
        <div className="mb-2">
          <div className="progress" style={{ height: "8px" }}>
            <div className="progress-bar bg-warning" style={{ width: "60%" }}></div>
          </div>
          <small className="text-muted">Time remaining in grace period</small>
        </div>
        <div>
          <button className="btn btn-danger btn-sm me-2">Pay Now</button>
          <button className="btn btn-secondary btn-sm">Set Reminder</button>
        </div>
      </div>

      {/* Contribution History */}
      <div className="card mb-4 p-3">
        <h6>Contribution History</h6>
        <ul className="list-group list-group-flush mt-2">
          {[
            ["Nov 2024", "Paid on Nov 1", "On Time", "success"],
            ["Oct 2024", "Paid on Oct 1", "On Time", "success"],
            ["Sep 2024", "Paid on Sep 2", "On Time", "success"],
            ["Aug 2024", "Paid on Aug 1", "On Time", "success"],
            ["Jul 2024", "Paid on Jul 8", "Late", "warning"],
            ["Jun 2024", "Paid on Jun 1", "On Time", "success"],
          ].map(([month, date, status, badge], idx) => (
            <li
              key={idx}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                {month} <span className="text-muted ms-2">{date}</span>
              </div>
              <div>
                ₹500{" "}
                <span className={`badge bg-${badge} ms-2`}>
                  {status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Reputation Benefits */}
      <div className="card mb-4 p-3">
        <h6>Reputation Benefits</h6>
        <div className="row text-center mt-2">
          <div className="col-md-4 mb-2">
            <div className="bg-success bg-opacity-10 border border-success rounded p-3">
              <div>Higher Selection Chance</div>
              <small className="text-muted">Better reputation = better odds</small>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="bg-info bg-opacity-10 border border-info rounded p-3">
              <div>Emergency Loans</div>
              <small className="text-muted">Access to quick funding</small>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="bg-secondary bg-opacity-10 border border-secondary rounded p-3">
              <div>Community Trust</div>
              <small className="text-muted">Earn member respect</small>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mb-4">
        <button className="btn btn-outline-secondary">Back to Dashboard</button>
        <button className="btn btn-success">View Selection Process</button>
      </div>
    </div>
  );
}

export default ContributionReputation;
