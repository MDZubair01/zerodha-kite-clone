import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:3002/signup", formData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Open a Trading Account</h2>

      {error && <div style={{ color: "#d93025", backgroundColor: "#fce8e6", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "13px" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#555" }}>Username</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#555" }}>Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#555" }}>Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "12px", backgroundColor: "#387ed1", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Creating Account..." : "Sign up"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#666" }}>
        Already have an account? <Link to="/login" style={{ color: "#387ed1", textDecoration: "none" }}>Login here</Link>
      </p>
    </div>
  );
};

export default Signup;