import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [squaringOffId, setSquaringOffId] = useState(null);

  const fetchPositions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view open positions.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("https://zerodha-kite-backend.onrender.com/allPositions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllPositions(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Error loading positions:", err);
      setError("Failed to load active market positions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSquareOff = async (positionId, instrumentName) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (
      !window.confirm(
        `Are you sure you want to square off ${instrumentName}? This will close the contract at the current market price.`
      )
    ) {
      return;
    }

    try {
      setSquaringOffId(positionId);
      const res = await axios.post(
        `https://zerodha-kite-backend.onrender.com/squareOffPosition/${positionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove the squared-off position immediately from UI state
      setAllPositions((prev) => prev.filter((pos) => pos._id !== positionId));
      alert(res.data.message || `Position ${instrumentName} squared off successfully!`);
    } catch (err) {
      console.error("Square off error:", err);
      alert(err.response?.data?.message || "Failed to square off position.");
    } finally {
      setSquaringOffId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p>Loading open derivative & intraday positions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <p style={{ color: "#d93025", marginBottom: "12px" }}>{error}</p>
        <Link
          to="/login"
          className="btn btn-blue"
          style={{ textDecoration: "none", padding: "8px 16px" }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Calculate overall exposure
  const totalPositionValue = allPositions.reduce(
    (acc, pos) => acc + Number(pos.price) * Number(pos.qty),
    0
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 className="title" style={{ margin: 0 }}>
          Positions ({allPositions.length})
        </h3>
        <button
          onClick={fetchPositions}
          style={{
            padding: "5px 12px",
            fontSize: "12px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            color: "#555",
          }}
        >
          ↻ Refresh Positions
        </button>
      </div>

      {allPositions.length === 0 ? (
        <div className="no-orders" style={{ textAlign: "center", padding: "40px" }}>
          <p>You do not have any open intraday or derivative positions.</p>
          <Link
            to="/"
            className="btn btn-blue"
            style={{ textDecoration: "none", display: "inline-block", marginTop: "10px" }}
          >
            Explore Watchlist
          </Link>
        </div>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. Cost</th>
                  <th>LTP</th>
                  <th>Cur. Value</th>
                  <th>P&L</th>
                  <th>Chg.</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allPositions.map((pos, index) => {
                  const numQty = Number(pos.qty);
                  const numLtp = Number(pos.price);
                  const numAvg = Number(pos.avg || pos.price);

                  const curVal = numLtp * numQty;
                  const totalCost = numAvg * numQty;
                  const pnl = curVal - totalCost;
                  const isProfit = pnl >= 0;

                  const isDayLoss = pos.day ? pos.day.startsWith("-") : false;
                  const dayClass = isDayLoss ? "loss" : "profit";
                  const isSquaringThis = squaringOffId === pos._id;

                  return (
                    <tr key={pos._id || index}>
                      <td>
                        <span
                          style={{
                            fontSize: "11px",
                            backgroundColor: "#f0f0f0",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            color: "#555",
                            fontWeight: 600,
                          }}
                        >
                          {pos.product || "CNC"}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: "#333" }}>{pos.name}</td>
                      <td>{pos.qty}</td>
                      <td>₹{numAvg.toFixed(2)}</td>
                      <td>₹{numLtp.toFixed(2)}</td>
                      <td>₹{curVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      {/* Dynamic Rupee P&L with sign & color */}
                      <td style={{ color: isProfit ? "#2e7d32" : "#d32f2f", fontWeight: 500 }}>
                        {isProfit ? "+" : ""}
                        {pnl.toFixed(2)}
                      </td>
                      {/* Daily Change */}
                      <td className={dayClass}>{pos.day || "+0.00%"}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleSquareOff(pos._id, pos.name)}
                          disabled={isSquaringThis}
                          style={{
                            padding: "4px 10px",
                            fontSize: "11px",
                            backgroundColor: "#fff",
                            color: "#d93025",
                            border: "1px solid #d93025",
                            borderRadius: "3px",
                            cursor: isSquaringThis ? "not-allowed" : "pointer",
                            fontWeight: 600,
                          }}
                        >
                          {isSquaringThis ? "Closing..." : "Square Off"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Metric Cards */}
          <div
            style={{
              display: "flex",
              gap: "60px",
              marginTop: "35px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#333" }}>
                ₹{totalPositionValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h4>
              <span style={{ fontSize: "12px", color: "#888" }}>Total Contract Exposure</span>
            </div>

            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#2e7d32", fontWeight: 600 }}>
                Active
              </h4>
              <span style={{ fontSize: "12px", color: "#888" }}>Risk Status</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Positions;