import React from "react";

const COLORS = [
  "#387ed1",
  "#ff5722",
  "#4caf50",
  "#9c27b0",
  "#ff9800",
  "#00bcd4",
  "#e91e63",
  "#607d8b",
];

const DoughnutChart = ({ labels = [], values = [], quantities = [] }) => {
  const dataset = quantities.length > 0 ? quantities : values;
  const total = dataset.reduce((acc, val) => acc + Number(val || 0), 0);

  if (total === 0 || dataset.length === 0) {
    return (
      <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "12px", color: "#999" }}>No assets to display</span>
      </div>
    );
  }

  let cumulativeAngle = 0;
  const radius = 65;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ position: "relative", width: "180px", height: "180px" }}>
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <g transform="rotate(-90 100 100)">
            {dataset.map((qty, idx) => {
              const fraction = qty / total;
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeAngle * circumference;
              cumulativeAngle += fraction;
              const color = COLORS[idx % COLORS.length];

              return (
                <circle
                  key={idx}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <strong style={{ fontSize: "20px", color: "#333", display: "block" }}>{total}</strong>
          <span style={{ fontSize: "11px", color: "#888" }}>Total Shares</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginTop: "16px",
          width: "100%",
        }}
      >
        {labels.map((label, idx) => {
          const qty = dataset[idx] || 0;
          const pct = ((qty / total) * 100).toFixed(1);
          const color = COLORS[idx % COLORS.length];

          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                backgroundColor: "#f9f9f9",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #eee",
              }}
            >
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "inline-block",
                }}
              />
              <strong style={{ color: "#333" }}>{label}:</strong>
              <span style={{ color: "#555" }}>
                {qty} shares ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoughnutChart;