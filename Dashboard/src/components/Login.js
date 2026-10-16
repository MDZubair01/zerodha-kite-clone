import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://zerodha-kite-backend.onrender.com";

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const endpoint = isSignup ? "/signup" : "/login";
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      if (res.data.success || res.data.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // Notify other components & tabs of the active user
        window.dispatchEvent(new Event("storage"));

        if (onLoginSuccess) onLoginSuccess(res.data.user);
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please check your credentials.";
      setErrorMsg(message);
      console.error("Auth Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img
          src="/logo.svg"
          alt="Kite Logo"
          style={{ width: "40px", marginBottom: "15px" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <h3 style={{ marginBottom: "20px", color: "#444" }}>
          {isSignup ? "Open a Trading Account" : "Login to Kite"}
        </h3>

        {errorMsg && (
          <p
            style={{
              color: "#d32f2f",
              fontSize: "13px",
              marginBottom: "15px",
              backgroundColor: "#fde8e8",
              padding: "8px 12px",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px",
              fontSize: "15px",
              backgroundColor: "#387ed1",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {loading
              ? isSignup
                ? "Creating Account..."
                : "Logging in..."
              : isSignup
              ? "Sign up"
              : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setErrorMsg("");
            }}
            style={{ color: "#387ed1", cursor: "pointer", fontWeight: 500 }}
          >
            {isSignup ? "Login here" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f9f9f9",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "40px 35px",
  borderRadius: "6px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  width: "340px",
  textAlign: "center",
};

const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  outline: "none",
};

export default Login;