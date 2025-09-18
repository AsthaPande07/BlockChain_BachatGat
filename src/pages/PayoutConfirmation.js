import React from "react";
import "../styles/PayoutConfirmation.css";

function PayoutConfirmation() {
  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h5 className="mb-1">Blockchain Micro-Insurance App</h5>
        <div>
          <div className="d-flex justify-content-center mb-2">
            <span className="circle-check">&#10004;</span>
          </div>
          <div className="fs-3 fw-bold mb-2">🎉 Payout Confirmed!</div>
          <div className="mb-3 text-secondary">
            The December 2024 community payout has been successfully processed
          </div>
        </div>
      </div>

      {/* Winner Info */}
      <div className="card info-box mb-3 p-4">
        <div className="d-flex align-items-center">
          <div className="winner-avatar">
            <i className="bi bi-person"></i>
          </div>
          <div>
            <h4 className="mb-0">Raj Patel</h4>
            <div className="text-success mb-2">December 2024 Winner</div>
            <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
              <span>Member Since: <b>June 2024</b></span>
              <span>Wallet Address: 0x7421...e880</span>
            </div>
            <div className="small text-muted mb-2">
              Total Contributions: <b>6 months</b>
              &nbsp;|&nbsp; Reputation: <span className="text-warning">⭐ 4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="card mb-3 p-4">
        <h6 className="mb-3 text-primary">Transaction Details</h6>
        <div className="row">
          <div className="col-sm-6 mb-2">
            <div className="mb-1">Payout Amount:</div>
            <span className="fs-5 text-success fw-bold">
              ₹25,000 <span className="fs-6 text-secondary">USDC Matic</span>
            </span>
          </div>
          <div className="col-sm-6 mb-2">
            <div className="mb-1">Transaction Hash:</div>
            <span className="small text-primary">0xac7171f3e8d5</span>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-sm-6">
            <div className="text-muted">
              <span>Transaction Date:</span>
              <span className="ms-2"><b>Dec 5, 2024, 2:30 PM</b></span>
            </div>
            <div className="text-muted">
              <span>Processing Time:</span>
              <span className="ms-2">2.3 seconds</span>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted">
              <span>Network:</span>
              <span className="ms-2">Polygon</span>
            </div>
            <div className="text-muted">
              <span>Gas Fee:</span>
              <span className="ms-2">₹2.50</span>
            </div>
            <span className="status-success mt-2 d-inline-block">
              Confirmed on Blockchain
            </span>
          </div>
        </div>
      </div>

      {/* Community Impact */}
      <div className="card impact-box mb-3 p-4">
        <h6 className="mb-3 text-purple">Community Impact</h6>
        <div className="row text-center mb-2">
          <div className="col-sm-4">
            <div className="fw-bold fs-5 text-purple">8</div>
            <div className="text-muted">Members Contributed</div>
          </div>
          <div className="col-sm-4">
            <div className="fw-bold fs-5 text-purple">₹25,000</div>
            <div className="text-muted">Total Pool Amount</div>
          </div>
          <div className="col-sm-4">
            <div className="fw-bold fs-5 text-purple">6</div>
            <div className="text-muted">Months Active</div>
          </div>
        </div>
        <div className="mt-2 text-center text-muted">
          The payout helps Raj achieve their financial goals while strengthening our community bond. 
          Every contribution matters, and together we grow stronger!
        </div>
      </div>

      {/* Next Steps */}
      <div className="card mb-3 p-4">
        <h6 className="mb-3 text-secondary">What Happens Next?</h6>
        <ul className="mb-2 ps-3">
          <li><span className="fw-bold">Winner Notification:</span> Raj Patel has been notified and funds are transferred.</li>
          <li><span className="fw-bold">New Cycle Begins:</span> January 2025 collection cycle starts on January 1.</li>
          <li><span className="fw-bold">Transparent Records:</span> All transaction details available with blockchain transparency.</li>
        </ul>
      </div>

      <div className="text-center mb-3">
        <button className="btn ledger-btn px-4 py-2">View Blockchain Ledger</button>
        <div className="mt-2 text-muted small">
          See complete transaction history and transparency records
        </div>
      </div>
    </div>
  );
}

export default PayoutConfirmation;
