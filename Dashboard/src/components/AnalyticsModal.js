import React, { useState, useEffect } from "react";

const AnalyticsModal = ({ stockName, currentPrice, onClose, onBuy, onSell }) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [candles, setCandles] = useState([]);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);

  // Generate realistic simulated price history candles for the chart
  useEffect(() => {
    const count = timeframe === "1D" ? 24 : timeframe === "1W" ? 32 : 40;
    let base = Number(currentPrice) || 1000;
    const generated = [];
    let high = base;
    let low = base;

    for (let i = count; i >= 0; i--) {
      const delta = (Math.random() * 0.04 - 0.019) * base;
      const open = base;
      const close = base + delta;
      const cHigh = Math.max(open, close) + Math.random() * 0.006 * base;
      const cLow = Math.min(open, close) - Math.random() * 0.006 * base;

      if (cHigh > high) high = cHigh;
      if (cLow < low) low = cLow;

      generated.push({ open, close, high: cHigh, low: cLow, isUp: close >= open });
      base = close;
    }

    setCandles(generated);
    setHighPrice(high);
    setLowPrice(low);
  }, [stockName, timeframe, currentPrice]);

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>{stockName}</h3>
              <span style={{ fontSize: "11px", backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "3px", color: "#666" }}>
                NSE:EQ
              </span>
            </div>
            <div style={{ marginTop: "6px", display: "flex", alignItems: "baseline", gap: "10px" }}>
              <strong style={{ fontSize: "22px", color: "#222" }}>
                ₹{Number(currentPrice ? currentPrice.toFixed(2) : 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
              <span style={{ fontSize: "12px", color: "#666" }}>
                High: <strong style={{ color: "#2e7d32" }}>₹{highPrice.toFixed(2)}</strong> | Low: <strong style={{ color: "#d32f2f" }}>₹{lowPrice.toFixed(2)}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Timeframe Selectors */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["1D", "1W", "1M", "1Y"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                border: "1px solid #ddd",
                borderRadius: "3px",
                backgroundColor: timeframe === tf ? "#387ed1" : "#fff",
                color: timeframe === tf ? "#fff" : "#555",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Candlestick Chart Area with Wicks */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "4px",
            backgroundColor: "#fafbfc",
            padding: "16px 10px 10px 10px",
            height: "220px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {candles.map((c, i) => {
            const range = highPrice - lowPrice || 1;
            const openPct = ((c.open - lowPrice) / range) * 100;
            const closePct = ((c.close - lowPrice) / range) * 100;
            const highPct = ((c.high - lowPrice) / range) * 100;
            const lowPct = ((c.low - lowPrice) / range) * 100;

            const bodyBottom = Math.min(openPct, closePct);
            const bodyHeight = Math.max(Math.abs(closePct - openPct), 2);
            const wickHeight = Math.max(highPct - lowPct, 4);
            const candleColor = c.isUp ? "#2e7d32" : "#d32f2f";

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  height: "100%",
                  position: "relative",
                }}
                title={`Open: ₹${c.open.toFixed(2)} | High: ₹${c.high.toFixed(2)} | Low: ₹${c.low.toFixed(2)} | Close: ₹${c.close.toFixed(2)}`}
              >
                {/* Wick (Line) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: `${lowPct}%`,
                    width: "1px",
                    height: `${wickHeight}%`,
                    backgroundColor: candleColor,
                  }}
                />
                {/* Real Body */}
                <div
                  style={{
                    position: "absolute",
                    bottom: `${bodyBottom}%`,
                    width: "60%",
                    maxWidth: "10px",
                    height: `${bodyHeight}%`,
                    backgroundColor: candleColor,
                    borderRadius: "1px",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Technical Indicators Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", margin: "20px 0" }}>
          <div style={indicatorCardStyle}>
            <span style={{ fontSize: "11px", color: "#888" }}>RSI (14)</span>
            <strong style={{ fontSize: "13px", color: "#333" }}>58.4 (Neutral)</strong>
          </div>
          <div style={indicatorCardStyle}>
            <span style={{ fontSize: "11px", color: "#888" }}>20 EMA</span>
            <strong style={{ fontSize: "13px", color: "#2e7d32" }}>Bullish</strong>
          </div>
          <div style={indicatorCardStyle}>
            <span style={{ fontSize: "11px", color: "#888" }}>Volume</span>
            <strong style={{ fontSize: "13px", color: "#333" }}>1.42M</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #eee", paddingTop: "16px" }}>
          <button
            onClick={() => {
              onClose();
              if (onBuy) onBuy(stockName, currentPrice);
            }}
            style={{
              padding: "8px 24px",
              backgroundColor: "#387ed1",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Buy {stockName}
          </button>
          <button
            onClick={() => {
              onClose();
              if (onSell) onSell(stockName, currentPrice);
            }}
            style={{
              padding: "8px 24px",
              backgroundColor: "#ff5722",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sell {stockName}
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
  width: "640px",
  maxWidth: "92%",
  padding: "24px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
};

const indicatorCardStyle = {
  backgroundColor: "#f9f9f9",
  padding: "10px 14px",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  border: "1px solid #f0f0f0",
};

export default AnalyticsModal;