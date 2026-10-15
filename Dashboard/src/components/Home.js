import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import TopBar from "./TopBar";
import WatchList from "./WatchList";
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Positions from "./Positions";
import Funds from "./Funds";
import Apps from "./Apps";
import UserSessions from "./UserSessions";
import { GeneralContextProvider } from "./GeneralContext";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Initial auth check
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // 2. Cross-tab sync: detect when another tab logs in/out or switches accounts
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        if (!e.newValue) {
          // Logged out in another tab
          navigate("/login");
        } else {
          // Logged in as a different user in another tab
          window.location.reload();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return (
    <GeneralContextProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fafbfc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar />

        {/* Two-Column Kite Layout */}
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "calc(100vh - 65px)",
            overflow: "hidden",
          }}
        >
          {/* Left Panel: Fixed Watchlist */}
          <div
            style={{
              width: "380px",
              minWidth: "380px",
              flexShrink: 0,
              borderRight: "1px solid #e0e0e0",
              height: "100%",
              overflowY: "auto",
              backgroundColor: "#fff",
            }}
          >
            <WatchList />
          </div>

          {/* Right Panel: Scrollable Content Area */}
          <div
            style={{
              flex: 1,
              height: "100%",
              overflowY: "auto",
              padding: "24px 36px",
            }}
          >
            <Routes>
              <Route path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/sessions" element={<UserSessions />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </GeneralContextProvider>
  );
};

export default Home;