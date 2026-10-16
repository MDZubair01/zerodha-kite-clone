import React, { useState, useEffect } from "react";
import axios from "axios";

const defaultApps = [
  {
    name: "Smallcase",
    description: "Thematic investment baskets crafted by SEBI registered professionals.",
    icon: "📈",
    connected: true,
    tag: "Investment",
  },
  {
    name: "Streak",
    description: "Create, backtest, and deploy algorithmic trading strategies without coding.",
    icon: "⚡",
    connected: false,
    tag: "Algo Trading",
  },
  {
    name: "Sensibull",
    description: "Options trading platform with strategy builders, Greeks, and payoff curves.",
    icon: "🎯",
    connected: true,
    tag: "Options & F&O",
  },
  {
    name: "Tijori",
    description: "Fundamental analysis platform with operational metrics and market share tracking.",
    icon: "🏦",
    connected: false,
    tag: "Research",
  },
];

const Apps = () => {
  const [apps, setApps] = useState(defaultApps);
  const [apiCredentials, setApiCredentials] = useState({ apiKey: null, apiSecret: null });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ecosystem");
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const fetchApiKeys = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://zerodha-kite-backend.onrender.com/userApiKey", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setApiCredentials(res.data);
      }
    } catch (err) {
      console.error("Error loading API keys:", err);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleGenerateKey = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to generate developer keys.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://zerodha-kite-backend.onrender.com/generateApiKey",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiCredentials({ apiKey: res.data.apiKey, apiSecret: res.data.apiSecret });
      alert("Kite Connect Developer API credentials generated!");
    } catch (err) {
      alert("Failed to generate key: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (
      !window.confirm(
        "Are you sure you want to revoke your API key? Connected trading bots will cease trading immediately."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "https://zerodha-kite-backend.onrender.com/revokeApiKey",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiCredentials({ apiKey: null, apiSecret: null });
      setShowSecret(false);
      alert("API key revoked successfully.");
    } catch (err) {
      alert("Failed to revoke key: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleConnectApp = (appName) => {
    setApps((prev) =>
      prev.map((app) =>
        app.name === appName ? { ...app, connected: !app.connected } : app
      )
    );
  };

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div style={{ padding: "25px 40px", maxWidth: "900px" }}>
      <h3 style={{ margin: "0 0 8px 0", color: "#444" }}>Apps & Products</h3>
      <p style={{ color: "#666", fontSize: "13px", marginBottom: "25px" }}>
        Connect authorized third-party investment tools or build your own custom trading bots with Kite Connect.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "25px", borderBottom: "1px solid #eee", marginBottom: "25px" }}>
        <button
          onClick={() => setActiveTab("ecosystem")}
          style={{
            background: "none",
            border: "none",
            padding: "8px 0",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: 500,
            color: activeTab === "ecosystem" ? "#387ed1" : "#666",
            borderBottom: activeTab === "ecosystem" ? "2px solid #387ed1" : "2px solid transparent",
          }}
        >
          Featured Ecosystem Apps
        </button>
        <button
          onClick={() => setActiveTab("developer")}
          style={{
            background: "none",
            border: "none",
            padding: "8px 0",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: 500,
            color: activeTab === "developer" ? "#387ed1" : "#666",
            borderBottom: activeTab === "developer" ? "2px solid #387ed1" : "2px solid transparent",
          }}
        >
          Kite Connect API (Developer)
        </button>
      </div>

      {/* Tab 1: Ecosystem Apps Grid */}
      {activeTab === "ecosystem" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {apps.map((app) => (
            <div
              key={app.name}
              style={{
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "20px",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "28px" }}>{app.icon}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                    }}
                  >
                    {app.tag}
                  </span>
                </div>
                <h4 style={{ margin: "12px 0 6px 0", color: "#333" }}>{app.name}</h4>
                <p style={{ fontSize: "12px", color: "#777", lineHeight: "1.4", margin: 0 }}>
                  {app.description}
                </p>
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: app.connected ? "#2e7d32" : "#888",
                  }}
                >
                  {app.connected ? "● Connected" : "○ Inactive"}
                </span>
                <button
                  onClick={() => toggleConnectApp(app.name)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: app.connected ? "1px solid #d32f2f" : "1px solid #387ed1",
                    backgroundColor: app.connected ? "#fff" : "#387ed1",
                    color: app.connected ? "#d32f2f" : "#fff",
                    fontWeight: 500,
                  }}
                >
                  {app.connected ? "Disconnect" : "Explore"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Kite Connect Developer API */}
      {activeTab === "developer" && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "6px",
            padding: "25px",
            backgroundColor: "#fff",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>Algorithmic Trading Credentials</h4>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
            Build automated trading algorithms and Python bots using your personal REST API credentials.
          </p>

          {apiCredentials.apiKey ? (
            <div>
              {/* API Key */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                  API KEY
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    readOnly
                    value={apiCredentials.apiKey}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => handleCopy(apiCredentials.apiKey, "key")}
                    style={{
                      padding: "8px 14px",
                      fontSize: "12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      backgroundColor: copiedKey ? "#e8f5e9" : "#fff",
                      color: copiedKey ? "#2e7d32" : "#555",
                      fontWeight: 500,
                    }}
                  >
                    {copiedKey ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* API Secret */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "12px", color: "#888" }}>
                    API SECRET
                  </label>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#387ed1",
                      fontSize: "11px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showSecret ? "Hide Secret" : "Show Secret"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type={showSecret ? "text" : "password"}
                    readOnly
                    value={apiCredentials.apiSecret}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => handleCopy(apiCredentials.apiSecret, "secret")}
                    style={{
                      padding: "8px 14px",
                      fontSize: "12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      backgroundColor: copiedSecret ? "#e8f5e9" : "#fff",
                      color: copiedSecret ? "#2e7d32" : "#555",
                      fontWeight: 500,
                    }}
                  >
                    {copiedSecret ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleGenerateKey}
                  disabled={loading}
                  className="btn btn-blue"
                  style={{ padding: "8px 16px", cursor: "pointer" }}
                >
                  {loading ? "Regenerating..." : "Regenerate Keys"}
                </button>
                <button
                  onClick={handleRevokeKey}
                  disabled={loading}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#fff",
                    color: "#d32f2f",
                    border: "1px solid #d32f2f",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Revoke Key
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f9fbfd",
                  border: "1px dashed #387ed1",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
                  You currently have no active Kite Connect API keys. Generate an API Key to connect trading bots or use Python/Node.js SDKs.
                </p>
              </div>
              <button
                onClick={handleGenerateKey}
                disabled={loading}
                className="btn btn-blue"
                style={{ padding: "8px 18px", cursor: "pointer" }}
              >
                {loading ? "Generating..." : "Generate API Key"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Apps;