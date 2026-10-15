import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const BuyActionWindow = ({ uid, price, closeWindow }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(price || 0);
  const [availableCash, setAvailableCash] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const context = useContext(GeneralContext);
  const handleClose = closeWindow || context?.closeBuyWindow;
  const showToast = context?.showToast;

  useEffect(() => {
    const fetchFunds = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://127.0.0.1:3002/userFunds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCash(res.data.availableCash || 0);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
    };
    fetchFunds();
  }, []);

  const totalCost = Number((stockQuantity * stockPrice).toFixed(2));
  const hasSufficientBalance = availableCash >= totalCost;

  const handleBuyOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (showToast) {
        showToast("Session expired. Please log in again.", "error");
      } else {
        alert("Session expired. Please log in again.");
      }
      return;
    }

    if (stockQuantity <= 0) {
      if (showToast) {
        showToast("Please enter a valid quantity.", "error");
      } else {
        alert("Please enter a valid quantity.");
      }
      return;
    }

    if (!hasSufficientBalance) {
      const errText = `Insufficient funds! Required: ₹${totalCost.toLocaleString("en-IN")}, Available: ₹${availableCash.toLocaleString("en-IN")}`;
      if (showToast) {
        showToast(errText, "error");
      } else {
        alert(errText);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        "http://127.0.0.1:3002/newOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: "BUY",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const successMsg = `BUY ${stockQuantity} ${uid} executed at ₹${stockPrice.toFixed(2)}`;
      if (showToast) {
        showToast(successMsg, "success");
      } else {
        alert(successMsg);
      }

      if (handleClose) handleClose();
      // Re-trigger local storage event to update portfolio and funds across components
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Buy order error:", err);
      const failMsg = err.response?.data?.message || "Failed to execute buy order.";
      if (showToast) {
        showToast(failMsg, "error");
      } else {
        alert(failMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={backdropStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h4 style={{ margin: 0, color: "#333", fontSize: "16px" }}>Buy {uid}</h4>
            <span style={{ fontSize: "11px", color: "#666" }}>NSE x Regular Market Order</span>
          </div>
          <button onClick={handleClose} style={closeButtonStyle}>✕</button>
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Qty</label>
            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Price (₹)</label>
            <input
              type="number"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Financial Info */}
        <div style={infoBoxStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ color: "#777", fontSize: "12px" }}>Margin required</span>
            <strong style={{ fontSize: "13px", color: "#333" }}>
              ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#777", fontSize: "12px" }}>Available margin</span>
            <span style={{ fontSize: "12px", color: hasSufficientBalance ? "#2e7d32" : "#d32f2f", fontWeight: 600 }}>
              ₹{availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <button onClick={handleClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button
            onClick={handleBuyOrder}
            disabled={isSubmitting || !hasSufficientBalance}
            style={{
              ...primaryButtonStyle,
              backgroundColor: hasSufficientBalance ? "#387ed1" : "#a0c3ec",
              cursor: hasSufficientBalance ? "pointer" : "not-allowed",
            }}
          >
            {isSubmitting ? "Executing..." : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
};

const backdropStyle = {
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

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "6px",
  width: "360px",
  padding: "20px 24px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  color: "#888",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "13px",
  boxSizing: "border-box",
  outline: "none",
};

const infoBoxStyle = {
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  padding: "10px 12px",
  border: "1px solid #eee",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  color: "#999",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  color: "#666",
};

const primaryButtonStyle = {
  padding: "8px 20px",
  color: "#fff",
  border: "none",
  borderRadius: "3px",
  fontSize: "12px",
  fontWeight: 600,
};

export default BuyActionWindow;