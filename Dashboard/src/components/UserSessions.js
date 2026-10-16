import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [terminatingId, setTerminatingId] = useState(null);

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in with admin privileges.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("https://zerodha-kite-backend.onrender.com/userSessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Session load error:", err);
      setError(err.response?.data?.message || "Failed to load active sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleTerminate = async (userId, username) => {
    const token = localStorage.getItem("token");
    if (!window.confirm(`Force terminate session for ${username}? This user will be kicked out immediately.`)) {
      return;
    }

    try {
      setTerminatingId(userId);
      await axios.post(
        `https://zerodha-kite-backend.onrender.com/terminateSession/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions((prev) =>
        prev.map((s) => (s._id === userId ? { ...s, isOnline: false } : s))
      );
      alert(`Session for ${username} terminated.`);
    } catch (err) {
      alert("Failed to terminate session: " + (err.response?.data?.message || err.message));
    } finally {
      setTerminatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p>Loading security audit & user sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <p style={{ color: "#d93025", marginBottom: "12px" }}>{error}</p>
        <Link to="/" className="btn btn-blue" style={{ textDecoration: "none", padding: "8px 16px" }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: "0 0 6px 0", color: "#333" }}>Security & Active Sessions</h3>
          <span style={{ fontSize: "12px", color: "#777" }}>Admin privilege view: Monitor concurrent user activity</span>
        </div>
        <button
          onClick={fetchSessions}
          style={{
            padding: "6px 14px",
            fontSize: "12px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Last Logout</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td style={{ fontWeight: 600, color: "#333" }}>{s.username}</td>
                <td style={{ color: "#666" }}>{s.email}</td>
                <td>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      backgroundColor: s.isAdmin ? "#e8f0fe" : "#f5f5f5",
                      color: s.isAdmin ? "#1a73e8" : "#666",
                      fontWeight: 600,
                    }}
                  >
                    {s.isAdmin ? "ADMIN" : "TRADER"}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: s.isOnline ? "#2e7d32" : "#999",
                    }}
                  >
                    {s.isOnline ? "● ONLINE" : "○ OFFLINE"}
                  </span>
                </td>
                <td style={{ fontSize: "12px", color: "#666" }}>
                  {s.lastLogin ? new Date(s.lastLogin).toLocaleString() : "Never"}
                </td>
                <td style={{ fontSize: "12px", color: "#666" }}>
                  {s.lastLogout ? new Date(s.lastLogout).toLocaleString() : "—"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {s.isOnline && !s.isAdmin ? (
                    <button
                      onClick={() => handleTerminate(s._id, s.username)}
                      disabled={terminatingId === s._id}
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#fff0f0",
                        color: "#d32f2f",
                        border: "1px solid #d32f2f",
                        borderRadius: "3px",
                        fontSize: "11px",
                        cursor: terminatingId === s._id ? "not-allowed" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {terminatingId === s._id ? "Terminating..." : "End Session"}
                    </button>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#bbb" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSessions;