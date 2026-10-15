import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Funds = () => {
  const [funds, setFunds] = useState({ availableCash: 0, usedMargin: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("equity");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchFunds = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to manage your funds.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/userFunds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFunds(res.data || { availableCash: 0, usedMargin: 0 });
      setError("");
    } catch (err) {
      console.error("Funds load error:", err);
      setError("Failed to retrieve account funds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const depositAmt = parseFloat(amountInput);

    if (isNaN(depositAmt) || depositAmt <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    try {
      setProcessing(true);
      const res = await axios.post(
        "http://localhost:3002/addFunds",
        { amount: depositAmt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFunds(res.data.funds);
      alert(`₹${depositAmt.toLocaleString("en-IN")} deposited successfully!`);
      setShowAddModal(false);
      setAmountInput("");
    } catch (err) {
      console.error("Deposit error:", err);
      alert(err.response?.data?.message || "Failed to add funds.");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const withdrawAmt = parseFloat(amountInput);

    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    if (withdrawAmt > funds.availableCash) {
      alert(`Insufficient balance. Max withdrawable: ₹${funds.availableCash.toLocaleString("en-IN")}`);
      return;
    }

    try {
      setProcessing(true);
      const res = await axios.post(
        "http://localhost:3002/withdrawFunds",
        { amount: withdrawAmt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFunds(res.data.funds);
      alert(`Withdrawal request of ₹${withdrawAmt.toLocaleString("en-IN")} submitted!`);
      setShowWithdrawModal(false);
      setAmountInput("");
    } catch (err) {
      console.error("Withdrawal error:", err);
      alert(err.response?.data?.message || "Failed to process withdrawal.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p>Loading funds overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <p style={{ color: "#d93025", marginBottom: "12px" }}>{error}</p>
        <Link to="/login" className="btn btn-blue" style={{ textDecoration: "none", padding: "8px 16px" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const openingBalance = funds.availableCash + funds.usedMargin;

  return (
    <>
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
          <button
            onClick={() => setActiveTab("equity")}
            style={{
              background: "none",
              border: "none",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              color: activeTab === "equity" ? "#ff5722" : "#777",
              borderBottom: activeTab === "equity" ? "2px solid #ff5722" : "none",
              paddingBottom: "6px",
            }}
          >
            Equity
          </button>
          <button
            onClick={() => setActiveTab("commodity")}
            style={{
              background: "none",
              border: "none",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              color: activeTab === "commodity" ? "#ff5722" : "#777",
              borderBottom: activeTab === "commodity" ? "2px solid #ff5722" : "none",
              paddingBottom: "6px",
            }}
          >
            Commodity
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              setAmountInput("");
              setShowAddModal(true);
            }}
            style={{
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              padding: "8px 18px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Add funds
          </button>
          <button
            onClick={() => {
              setAmountInput("");
              setShowWithdrawModal(true);
            }}
            style={{
              backgroundColor: "#387ed1",
              color: "#fff",
              border: "none",
              padding: "8px 18px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Segment Notice */}
      {activeTab === "commodity" ? (
        <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>MCX Commodity Segment Not Activated</h4>
          <p style={{ color: "#777", fontSize: "13px", margin: "0 0 20px 0" }}>
            Enable commodities trading with instant margin allocations.
          </p>
          <button
            onClick={() => alert("Activation request sent to KYC operations.")}
            style={{
              backgroundColor: "#ff5722",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Activate Commodity Account
          </button>
        </div>
      ) : (
        /* Equity Balance Grid */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px", marginTop: "20px" }}>
          {/* Left Summary Card */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "6px", padding: "24px" }}>
            <h4 style={{ margin: "0 0 20px 0", color: "#555", fontWeight: 500 }}>Equity Margin</h4>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <span style={{ fontSize: "14px", color: "#777" }}>Available cash</span>
              <span style={{ fontSize: "28px", fontWeight: 300, color: "#333" }}>
                ₹{funds.availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <hr style={{ border: "none", borderBottom: "1px solid #f0f0f0", margin: "15px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Opening Balance</span>
              <strong style={{ color: "#333" }}>
                ₹{openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Margins Used</span>
              <strong style={{ color: "#333" }}>
                ₹{funds.usedMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Payin</span>
              <strong style={{ color: "#2e7d32" }}>₹0.00</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>SPAN / Exposure</span>
              <strong style={{ color: "#333" }}>₹0.00</strong>
            </div>
          </div>

          {/* Right Info Note */}
          <div style={{ backgroundColor: "#fbfcfd", border: "1px solid #e9ecef", borderRadius: "6px", padding: "24px" }}>
            <h5 style={{ margin: "0 0 10px 0", color: "#444" }}>Instant Transfers (UPI / IMPS)</h5>
            <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.6", margin: "0 0 15px 0" }}>
              Funds added using UPI or net banking reflect instantly on your trading margin. Payout requests placed before 8:00 PM are credited to your bank account the same night.
            </p>
            <div style={{ fontSize: "12px", color: "#888" }}>
              <p style={{ margin: "0 0 6px 0" }}>• Primary Bank: <strong>HDFC Bank **** 4819</strong></p>
              <p style={{ margin: 0 }}>• Demat Linked ID: <strong>1208160058291</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h4 style={{ margin: 0, color: "#333" }}>Add Funds (Instant UPI)</h4>
              <button onClick={() => setShowAddModal(false)} style={closeBtnStyle}>✕</button>
            </div>
            <form onSubmit={handleDeposit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#777", marginBottom: "6px" }}>
                  Amount to Deposit (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  placeholder="e.g. 50000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  style={inputModalStyle}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {[5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmountInput(amt)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    +₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={cancelBtnStyle}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  style={{ ...submitBtnStyle, backgroundColor: "#4caf50" }}
                >
                  {processing ? "Processing..." : "Add Margin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showWithdrawModal && (
        <div style={modalOverlayStyle} onClick={() => setShowWithdrawModal(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h4 style={{ margin: 0, color: "#333" }}>Withdraw Funds</h4>
              <button onClick={() => setShowWithdrawModal(false)} style={closeBtnStyle}>✕</button>
            </div>
            <form onSubmit={handleWithdraw}>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
                Withdrawable cash: <strong>₹{funds.availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </p>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#777", marginBottom: "6px" }}>
                  Amount to Withdraw (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  max={funds.availableCash}
                  placeholder="Enter amount"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  style={inputModalStyle}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowWithdrawModal(false)} style={cancelBtnStyle}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || funds.availableCash <= 0}
                  style={{
                    ...submitBtnStyle,
                    backgroundColor: funds.availableCash > 0 ? "#387ed1" : "#a0c3ec",
                    cursor: funds.availableCash > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  {processing ? "Processing..." : "Request Payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
};

const modalBoxStyle = {
  backgroundColor: "#fff",
  borderRadius: "6px",
  width: "360px",
  padding: "24px",
  boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
};

const inputModalStyle = {
  width: "100%",
  padding: "8px 12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  color: "#999",
};

const cancelBtnStyle = {
  padding: "8px 14px",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  color: "#666",
};

const submitBtnStyle = {
  padding: "8px 18px",
  color: "#fff",
  border: "none",
  borderRadius: "3px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

export default Funds;