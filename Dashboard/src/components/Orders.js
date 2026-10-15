import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your order history.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/allOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Failed to retrieve order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId, stockName) => {
    const token = localStorage.getItem("token");
    if (!window.confirm(`Are you sure you want to cancel the order for ${stockName}? Funds and holdings will be reconciled immediately.`)) {
      return;
    }

    try {
      setCancellingId(orderId);
      await axios.delete(`http://localhost:3002/cancelOrder/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert(`Order for ${stockName} cancelled and balance restored!`);
    } catch (err) {
      console.error("Order cancellation failed:", err);
      alert(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeSubTab === "buy") return order.mode === "BUY";
    if (activeSubTab === "sell") return order.mode === "SELL";
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p>Loading order logbook...</p>
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

  return (
    <>
      {/* Top Header & Segment Filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
          <button
            onClick={() => setActiveSubTab("all")}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              color: activeSubTab === "all" ? "#ff5722" : "#777",
              borderBottom: activeSubTab === "all" ? "2px solid #ff5722" : "none",
              paddingBottom: "6px",
            }}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab("buy")}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              color: activeSubTab === "buy" ? "#ff5722" : "#777",
              borderBottom: activeSubTab === "buy" ? "2px solid #ff5722" : "none",
              paddingBottom: "6px",
            }}
          >
            Buy Orders
          </button>
          <button
            onClick={() => setActiveSubTab("sell")}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              color: activeSubTab === "sell" ? "#ff5722" : "#777",
              borderBottom: activeSubTab === "sell" ? "2px solid #ff5722" : "none",
              paddingBottom: "6px",
            }}
          >
            Sell Orders
          </button>
        </div>

        <button
          onClick={fetchOrders}
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
          ↻ Refresh Orders
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders" style={{ textAlign: "center", padding: "50px 20px" }}>
          <p style={{ color: "#777", fontSize: "14px", marginBottom: "16px" }}>
            You haven't placed any {activeSubTab !== "all" ? activeSubTab.toUpperCase() : ""} orders today.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "8px 20px",
              backgroundColor: "#387ed1",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Get started from Watchlist
          </Link>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Instrument</th>
                <th>Product</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isBuy = order.mode === "BUY";
                const orderTime = order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                  : "09:15:00";

                return (
                  <tr key={order._id}>
                    <td style={{ fontSize: "12px", color: "#888" }}>{orderTime}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "3px",
                          backgroundColor: isBuy ? "#e8f5e9" : "#ffebee",
                          color: isBuy ? "#2e7d32" : "#c62828",
                        }}
                      >
                        {order.mode}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "#333" }}>{order.name}</td>
                    <td style={{ fontSize: "12px", color: "#666" }}>CNC / NRML</td>
                    <td>{order.qty}</td>
                    <td>₹{Number(order.price).toFixed(2)}</td>
                    <td>
                      <span style={{ fontSize: "12px", color: "#2e7d32", fontWeight: 500 }}>
                        ● EXECUTED
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleCancelOrder(order._id, order.name)}
                        disabled={cancellingId === order._id}
                        style={{
                          padding: "3px 10px",
                          backgroundColor: "#fff",
                          color: "#d32f2f",
                          border: "1px solid #d32f2f",
                          borderRadius: "3px",
                          fontSize: "11px",
                          fontWeight: 500,
                          cursor: cancellingId === order._id ? "not-allowed" : "pointer",
                        }}
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Orders;