import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useSessionHeartbeat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Check session status every 30 seconds
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:3002/checkSession", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.active === false) {
          clearInterval(interval);
          localStorage.removeItem("token");
          alert("Your session was terminated remotely by an administrator.");
          navigate("/login");
        }
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          clearInterval(interval);
          localStorage.removeItem("token");
          alert("Session expired or terminated. Please log in again.");
          navigate("/login");
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);
};

export default useSessionHeartbeat;