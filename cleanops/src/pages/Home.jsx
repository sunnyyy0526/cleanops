import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ FIX
import "./Home.css";

function Home() {
  const { user } = useAuth(); // ✅ FIX
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const getWelcomeMessage = () => {
    if (!user) return "";
    if (user.role === "operator") return "View your assigned tasks below.";
    if (user.role === "wardAdmin" || user.role === "superAdmin")
      return "Manage assignments and view ward performance.";
    return "You're signed in and ready to go.";
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="head">
        <h1>Waste Management & Desludging</h1>
        <p>
          Report and track desludging services with ease. Make your ward cleaner.
        </p>
      </div>

      {/* Welcome */}
      {user && (
        <div className="welcome-banner">
          <h3>
            Welcome back, {user.name}! <span>({user.role})</span>
          </h3>
          <p>{getWelcomeMessage()}</p>
        </div>
      )}

      <div className="home-cards">
        {/* ================= CITIZEN ================= */}
        {(!user || user.role === "citizen") && (
          <>
            {/* Raise Request */}
            <div className="home-card">
              <div className="icon green">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1.6em"
                  width="1.6em"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3>Raise Request</h3>
              <p>Submit a desludging request in under a minute.</p>
              <button
                className="submit-btn"
                onClick={() => handleNavigation("/raise-request")}
              >
                Submit Now
              </button>
            </div>

            {/* My Requests */}
            <div className="home-card">
              <div className="icon blue">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1.6em"
                  width="1.6em"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </div>
              <h3>My Requests</h3>
              <p>Track the status of your submitted requests.</p>
              <button
                className="view-btn"
                onClick={() => handleNavigation("/my-requests")}
              >
                View Requests
              </button>
            </div>
          </>
        )}

        {/* ================= OPERATOR ================= */}
        {user && user.role === "operator" && (
          <div className="home-card">
            <div className="icon blue">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.6em"
                width="1.6em"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <h3>Assigned Requests</h3>
            <p>View and manage requests assigned to your ward.</p>
            <button
              className="view-btn"
              onClick={() => navigate("/assigned")}
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ================= WARD ADMIN + SUPER ADMIN ================= */}
        {user && (user.role === "wardAdmin" || user.role === "superAdmin") && (
          <>
            {/* Dashboard */}
            <div className="home-card">
              <div
                className="icon blue"
                style={{ background: "#e0f2fe", color: "#0284c7" }}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1.6em"
                  width="1.6em"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3>Admin Dashboard</h3>
              <p>Manage assignments and view ward analytics.</p>
              <button
                className="view-btn"
                onClick={() => navigate("/admin-dashboard")}
              >
                Open Dashboard
              </button>
            </div>

            {/* Analytics */}
            <div className="home-card">
              <div
                className="icon blue"
                style={{ background: "#e0f2fe", color: "#0284c7" }}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1.6em"
                  width="1.6em"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Admin Analytics</h3>
              <p>View detailed reports and statistics.</p>
              <button
                className="view-btn"
                onClick={() => navigate("/admin-analytics")}
              >
                Open Analytics
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
