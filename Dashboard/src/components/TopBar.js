import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TopBar = () => {
  const [nifty, setNifty] = useState({ points: 24800.15, percent: -0.66 });
  const [sensex, setSensex] = useState({ points: 81400.77, percent: 0.36 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [allSessions, setAllSessions] = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load and sync logged-in user state
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const username = user.username || "Trader";
  const email = user.email || "";
  const initials = (username || email || "TR").slice(0, 2).toUpperCase();
  const isAdmin = email === "admin@zerodha.com" || user.isAdmin === true;

  // Cross-tab and storage synchronization
  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "{}"));
      } catch {
        setUser({});
      }
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // Dismiss dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 1. Client-side Heartbeat: checks if session was terminated remotely by Admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const sessionCheckInterval = setInterval(async () => {
      try {
        await axios.get("http://127.0.0.1:3002/checkSession", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        if (err.response?.status === 401) {
          clearInterval(sessionCheckInterval);
          alert("Your session has been terminated by an administrator.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("storage"));
          navigate("/login");
        }
      }
    }, 10000);

    return () => clearInterval(sessionCheckInterval);
  }, [navigate]);

  // 2. Auto-refresh sessions list every 5s while session modal is active
  useEffect(() => {
    if (!showSessionModal) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3002/userSessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllSessions(res.data);
      } catch (err) {
        console.error("Auto-refresh error:", err);
      }
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, [showSessionModal]);

  // 3. Live market ticker delta simulation
  useEffect(() => {
    const indexInterval = setInterval(() => {
      const niftyDelta = Math.random() * 4 - 2;
      const sensexDelta = Math.random() * 10 - 5;

      setNifty((prev) => ({
        points: Number((prev.points + niftyDelta).toFixed(2)),
        percent: Number((prev.percent + niftyDelta * 0.005).toFixed(2)),
      }));

      setSensex((prev) => ({
        points: Number((prev.points + sensexDelta).toFixed(2)),
        percent: Number((prev.percent + sensexDelta * 0.005).toFixed(2)),
      }));
    }, 3500);

    return () => clearInterval(indexInterval);
  }, []);

  const openSessionTracker = async (e) => {
    if (e) e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Missing authorization token. Please log in again.");
      return;
    }

    setLoadingSessions(true);

    try {
      const res = await axios.get("http://127.0.0.1:3002/userSessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllSessions(res.data);
      setShowSessionModal(true);
      setShowDropdown(false);
    } catch (err) {
      console.error("Session Tracker error:", err);
      if (err.response?.status === 403) {
        alert("Access Denied: Only administrators can view user sessions.");
      } else if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to load sessions: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleTerminateSession = async (userId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to end this user's active session?")) {
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:3002/terminateSession/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllSessions((prevSessions) =>
        prevSessions.map((s) =>
          s._id === userId
            ? { ...s, isOnline: false, lastLogout: new Date().toISOString() }
            : s
        )
      );

      alert("User session terminated successfully.");
    } catch (err) {
      console.error("Termination error:", err);
      alert(err.response?.data?.message || "Failed to terminate session.");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (email && token) {
        await axios.post(
          "http://127.0.0.1:3002/logout",
          { email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout tracking error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Holdings", path: "/holdings" },
    { name: "Positions", path: "/positions" },
    { name: "Funds", path: "/funds" },
    { name: "Apps", path: "/apps" },
  ];

  if (isAdmin) {
    navLinks.push({ name: "Sessions", path: "/sessions" });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 28px",
        height: "65px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* 1. Market Indices Bar */}
      <div style={{ display: "flex", gap: "28px", alignItems: "center", fontSize: "12px" }}>
        <div>
          <span style={{ color: "#666", marginRight: "6px" }}>NIFTY 50</span>
          <span style={{ color: nifty.percent < 0 ? "#d32f2f" : "#2e7d32", fontWeight: 600 }}>
            {nifty.points.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span
            style={{
              color: nifty.percent < 0 ? "#d32f2f" : "#2e7d32",
              marginLeft: "4px",
              fontSize: "11px",
            }}
          >
            {nifty.percent > 0 ? "+" : ""}
            {nifty.percent}%
          </span>
        </div>
        <div>
          <span style={{ color: "#666", marginRight: "6px" }}>SENSEX</span>
          <span style={{ color: sensex.percent < 0 ? "#d32f2f" : "#2e7d32", fontWeight: 600 }}>
            {sensex.points.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span
            style={{
              color: sensex.percent < 0 ? "#d32f2f" : "#2e7d32",
              marginLeft: "4px",
              fontSize: "11px",
            }}
          >
            {sensex.percent > 0 ? "+" : ""}
            {sensex.percent}%
          </span>
        </div>
      </div>

      {/* 2. Kite Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.svg"
          alt="Kite"
          style={{ height: "20px" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </Link>

      {/* 3. Navigation Links and Profile Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "22px",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => {
            const isCurrent = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  style={{
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: isCurrent ? "#ff5722" : "#666",
                    transition: "color 0.15s ease",
                  }}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile Avatar & Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: showDropdown ? "#f5f5f5" : "transparent",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#ffecb3",
                color: "#e65100",
                fontSize: "11px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {initials}
            </div>
            <span style={{ fontSize: "13px", color: "#444", fontWeight: 500 }}>
              {username || email || "Trader"}
            </span>
          </div>

          {/* Profile Flyout Card */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "38px",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                width: "230px",
                padding: "8px 0",
                zIndex: 1000,
              }}
            >
              <div style={{ padding: "10px 16px", borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#2e7d32",
                      display: "inline-block",
                    }}
                  ></span>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#333" }}>
                    {username}
                  </p>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#888" }}>
                  {email}
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openSessionTracker}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 16px",
                    fontSize: "13px",
                    color: "#387ed1",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Quick Sessions Modal
                </button>
              )}

              <Link
                to="/apps"
                onClick={() => setShowDropdown(false)}
                style={{
                  display: "block",
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: "#555",
                  textDecoration: "none",
                }}
              >
                API & Developer Apps
              </Link>

              <hr style={{ margin: "6px 0", border: "none", borderTop: "1px solid #eee" }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: "#d32f2f",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Quick Session Modal */}
      {showSessionModal && (
        <div style={modalBackdropStyle} onClick={() => setShowSessionModal(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, color: "#333" }}>Active User Sessions</h4>
              <button
                onClick={() => setShowSessionModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  lineHeight: "1",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            <table
              style={{
                width: "100%",
                marginTop: "15px",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                  <th style={{ padding: "8px" }}>User</th>
                  <th style={{ padding: "8px" }}>Status</th>
                  <th style={{ padding: "8px" }}>Last Login</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allSessions.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: "16px", textAlign: "center", color: "#888" }}>
                      No active sessions found.
                    </td>
                  </tr>
                ) : (
                  allSessions.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                      <td style={{ padding: "8px" }}>{u.username}</td>
                      <td style={{ padding: "8px" }}>
                        <span style={{ color: u.isOnline ? "#2e7d32" : "#888", fontWeight: 600 }}>
                          {u.isOnline ? "● Online" : "○ Offline"}
                        </span>
                      </td>
                      <td style={{ padding: "8px" }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString() : "Never"}
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        {u.isOnline && u.email !== email ? (
                          <button
                            type="button"
                            onClick={() => handleTerminateSession(u._id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#fff0f0",
                              color: "#d32f2f",
                              border: "1px solid #d32f2f",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            Terminate
                          </button>
                        ) : (
                          <span style={{ color: "#bbb", fontSize: "12px" }}>
                            {u.email === email ? "You" : "Offline"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
};

const modalBoxStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "6px",
  width: "560px",
  maxWidth: "92%",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
  zIndex: 100000,
};

export default TopBar;