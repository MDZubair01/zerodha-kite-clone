import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Summary = () => {
  const [funds, setFunds] = useState({ availableCash: 0, usedMargin: 0 });
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        // Parallel fetch for funds and holdings
        const [fundsRes, holdingsRes] = await Promise.all([
          axios.get("http://127.0.0.1:3002/userFunds", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:3002/allHoldings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFunds(fundsRes.data || { availableCash: 100000, usedMargin: 0 });
        setHoldings(Array.isArray(holdingsRes.data) ? holdingsRes.data : []);

        // Retrieve stored user profile info
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Dashboard summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Compute portfolio valuation
  const totalInvestment = holdings.reduce(
    (acc, stock) => acc + Number(stock.avg) * Number(stock.qty),
    0
  );
  const currentValue = holdings.reduce(
    (acc, stock) => acc + Number(stock.price) * Number(stock.qty),
    0
  );
  const totalPnL = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
  const isProfit = totalPnL >= 0;

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        <p>Loading dashboard summary...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Greeting Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 500, color: "#333", margin: "0 0 6px 0" }}>
          Hi, {user?.username || user?.email || "Trader"}
        </h2>
        <span style={{ fontSize: "13px", color: "#888" }}>
          Welcome to your personal trading console. Here is your portfolio snapshot today.
        </span>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: "30px" }} />

      {/* Main Two-Column Summary: Equity & Commodity/Holdings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Left Column: Equity Funds */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "6px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4 style={{ margin: 0, fontSize: "16px", color: "#444", fontWeight: 600 }}>
              <span style={{ color: "#387ed1", marginRight: "8px" }}>●</span>Equity
            </h4>
            <Link to="/funds" style={{ fontSize: "12px", color: "#387ed1", textDecoration: "none", fontWeight: 500 }}>
              Funds statement →
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 400, color: "#333" }}>
              ₹{Number(funds.availableCash || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h2>
            <span style={{ fontSize: "12px", color: "#888" }}>Margin available</span>
          </div>

          <div style={{ borderTop: "1px solid #f2f2f2", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Margins used</span>
              <strong style={{ color: "#333" }}>
                ₹{Number(funds.usedMargin || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Opening balance</span>
              <strong style={{ color: "#333" }}>
                ₹{(Number(funds.availableCash || 0) + Number(funds.usedMargin || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Column: Holdings Snapshot */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "6px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4 style={{ margin: 0, fontSize: "16px", color: "#444", fontWeight: 600 }}>
              <span style={{ color: "#ff5722", marginRight: "8px" }}>●</span>Holdings ({holdings.length})
            </h4>
            <Link to="/holdings" style={{ fontSize: "12px", color: "#387ed1", textDecoration: "none", fontWeight: 500 }}>
              Demat holdings →
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "20px" }}>
            {/* Clean currency sign formatting: +₹ / -₹ */}
            <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 400, color: isProfit ? "#2e7d32" : "#d32f2f" }}>
              {isProfit ? "+₹" : "-₹"}
              {Math.abs(totalPnL).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h2>
            <span style={{ fontSize: "13px", color: isProfit ? "#2e7d32" : "#d32f2f", fontWeight: 500 }}>
              ({pnlPercent.toFixed(2)}%)
            </span>
            <span style={{ fontSize: "12px", color: "#888", marginLeft: "auto" }}>P&L</span>
          </div>

          <div style={{ borderTop: "1px solid #f2f2f2", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Current value</span>
              <strong style={{ color: "#333" }}>
                ₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#777" }}>Investment</span>
              <strong style={{ color: "#333" }}>
                ₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "16px",
          backgroundColor: "#fff",
          border: "1px solid #eee",
          borderRadius: "6px",
          padding: "16px 20px",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>Quick Links:</span>
        <Link to="/orders" style={{ fontSize: "13px", color: "#387ed1", textDecoration: "none" }}>
          View Executed Trades
        </Link>
        <span style={{ color: "#ccc" }}>|</span>
        <Link to="/positions" style={{ fontSize: "13px", color: "#387ed1", textDecoration: "none" }}>
          Open Intraday Positions
        </Link>
        <span style={{ color: "#ccc" }}>|</span>
        <Link to="/apps" style={{ fontSize: "13px", color: "#387ed1", textDecoration: "none" }}>
          Kite Connect API Portal
        </Link>
      </div>
    </div>
  );
};

export default Summary;