import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import DoughnutChart from "./DoughnutChart";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  const fetchHoldings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your Demat holdings.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("https://zerodha-kite-backend.onrender.com/allHoldings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllHoldings(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Error loading holdings:", err);
      setError("Failed to fetch holdings data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  // Compute portfolio aggregates
  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + Number(stock.avg) * Number(stock.qty),
    0
  );

  const currentValue = allHoldings.reduce(
    (acc, stock) => acc + Number(stock.price) * Number(stock.qty),
    0
  );

  const totalPnL = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
  const isProfit = totalPnL >= 0;

  // Chart data preparation
  const chartLabels = allHoldings.map((stock) => stock.name);
  const chartValues = allHoldings.map(
    (stock) => Number(stock.price) * Number(stock.qty)
  );
  // Extract purchased quantities
  const chartQuantities = allHoldings.map((stock) => Number(stock.qty));

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p>Loading your Demat inventory...</p>
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
          Holdings ({allHoldings.length})
        </h3>
        <button
          onClick={fetchHoldings}
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
          ↻ Refresh Portfolio
        </button>
      </div>

      {allHoldings.length === 0 ? (
        <div className="no-orders" style={{ textAlign: "center", padding: "40px" }}>
          <p>You do not hold any Demat equity assets yet.</p>
          <Link
            to="/"
            className="btn btn-blue"
            style={{ textDecoration: "none", display: "inline-block", marginTop: "10px" }}
          >
            Buy from Watchlist
          </Link>
        </div>
      ) : (
        <>
          {/* Portfolio Table */}
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. Cost</th>
                  <th>LTP</th>
                  <th>Cur. Val</th>
                  <th>P&L</th>
                  <th>Net Chg.</th>
                  <th>Day Chg.</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const stockCost = Number(stock.avg) * Number(stock.qty);
                  const stockCurrent = Number(stock.price) * Number(stock.qty);
                  const stockPnL = stockCurrent - stockCost;
                  const stockPnLPct = stockCost > 0 ? (stockPnL / stockCost) * 100 : 0;
                  const isGain = stockPnL >= 0;
                  const dayLoss = stock.day ? stock.day.startsWith("-") : false;

                  return (
                    <tr key={stock._id || index}>
                      <td style={{ fontWeight: 500, color: "#333" }}>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>₹{Number(stock.avg).toFixed(2)}</td>
                      <td>₹{Number(stock.price).toFixed(2)}</td>
                      <td>₹{stockCurrent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td style={{ color: isGain ? "#2e7d32" : "#d32f2f", fontWeight: 500 }}>
                        {isGain ? "+" : ""}
                        {stockPnL.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        <span style={{ fontSize: "11px", marginLeft: "4px" }}>
                          ({stockPnLPct.toFixed(2)}%)
                        </span>
                      </td>
                      <td style={{ color: stock.net && stock.net.startsWith("-") ? "#d32f2f" : "#2e7d32" }}>
                        {stock.net || `${stockPnLPct.toFixed(2)}%`}
                      </td>
                      <td style={{ color: dayLoss ? "#d32f2f" : "#2e7d32" }}>
                        {stock.day || "+0.00%"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            onClick={() => openBuyWindow(stock.name, stock.price)}
                            style={{
                              padding: "3px 8px",
                              backgroundColor: "#387ed1",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => openSellWindow(stock.name, stock.price)}
                            style={{
                              padding: "3px 8px",
                              backgroundColor: "#ff5722",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Exit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Portfolio Metric Overview & Donut Allocation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "30px",
              marginTop: "35px",
              alignItems: "center",
            }}
          >
            {/* Left Financial Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div style={metricBoxStyle}>
                <span style={metricLabelStyle}>Total Investment</span>
                <h4 style={metricValueStyle}>
                  ₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </h4>
              </div>
              <div style={metricBoxStyle}>
                <span style={metricLabelStyle}>Current Portfolio Value</span>
                <h4 style={metricValueStyle}>
                  ₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </h4>
              </div>
              <div style={{ ...metricBoxStyle, gridColumn: "span 2" }}>
                <span style={metricLabelStyle}>Total Unrealized Profit / Loss</span>
                <h4
                  style={{
                    ...metricValueStyle,
                    color: isProfit ? "#2e7d32" : "#d32f2f",
                    fontSize: "26px",
                  }}
                >
                  {isProfit ? "+" : ""}
                  ₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  <span style={{ fontSize: "16px", fontWeight: 400, marginLeft: "10px" }}>
                    ({pnlPercent.toFixed(2)}%)
                  </span>
                </h4>
              </div>
            </div>

            {/* Right Asset Allocation Donut */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              }}
            >
              <h5 style={{ margin: "0 0 12px 0", color: "#555", fontWeight: 500 }}>
                Asset Allocation
              </h5>
              <div style={{ width: "220px", height: "auto" }}>
                <DoughnutChart
                  labels={chartLabels}
                  values={chartValues}
                  quantities={chartQuantities}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const metricBoxStyle = {
  backgroundColor: "#fff",
  border: "1px solid #eee",
  borderRadius: "6px",
  padding: "18px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
};

const metricLabelStyle = {
  fontSize: "12px",
  color: "#777",
  display: "block",
  marginBottom: "6px",
};

const metricValueStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 400,
  color: "#333",
};

export default Holdings;