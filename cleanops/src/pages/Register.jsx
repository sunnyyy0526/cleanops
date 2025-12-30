import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ context login

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "citizen",
    ward: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Register user
      await api.post("/auth/register", formData);

      // 2️⃣ Auto login after register
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // 3️⃣ Save auth state (ONLY here)
      login(res.data.user, res.data.token);

      // 4️⃣ Redirect
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create your account</h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input
            name="name"
            placeholder="Your full name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <label>Phone</label>
          <input
            name="phone"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="citizen">Citizen</option>
            <option value="operator">Operator</option>
            <option value="wardAdmin">Ward Admin</option>
            <option value="superAdmin">Super Admin</option>
          </select>

          <label>Ward (optional)</label>
          <input
            name="ward"
            placeholder="Ward name/number"
            value={formData.ward}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="register-btn2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link className="login-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
