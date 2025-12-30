import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <span className="brand">CleanOps</span>
          <span className="emoji"> 🚛♻️</span>
        </div>

        {/* Left Navigation */}
        <nav className="nav-btn1">
          <NavLink to="/" className="nav-item">Home</NavLink>
          <NavLink to="/community" className="nav-item">Community</NavLink>

          {/* Citizen */}
          {user?.role === "citizen" && (
            <>
              <NavLink to="/raise-request" className="nav-item">Raise Request</NavLink>
              <NavLink to="/my-requests" className="nav-item">My Requests</NavLink>
            </>
          )}

          {/* Operator */}
          {user?.role === "operator" && (
            <NavLink to="/assigned" className="nav-item">Assigned</NavLink>
          )}

          {/* Ward Admin */}
          {(user?.role === "wardAdmin" || user?.role === "ward admin") && (
            <>
              <NavLink to="/admin-dashboard" className="nav-item">Dashboard</NavLink>
              <NavLink to="/admin-analytics" className="nav-item">Analytics</NavLink>
              <NavLink to="/admin-operators" className="nav-item">Operators</NavLink>
            </>
          )}

          {/* Super Admin */}
          {(user?.role === "superAdmin" || user?.role === "super admin") && (
            <>
              <NavLink to="/admin-dashboard" className="nav-item">Dashboard</NavLink>
              <NavLink to="/admin-analytics" className="nav-item">Analytics</NavLink>
              <NavLink to="/admin-operators" className="nav-item">Operators</NavLink>
            </>
          )}
        </nav>

        {/* Right Navigation */}
        <div className="nav-btn2">
          {user ? (
            <div className="user-menu">
              <span className="user-info">
                {user.name} <span className="user-role">({user.role})</span>
              </span>

              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="register-btn" onClick={() => navigate("/register")}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
