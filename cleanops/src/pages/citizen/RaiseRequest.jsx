import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RaiseRequest.css";

export default function RaiseRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    ward: "",
    wasteType: "Household",
    timeSlot: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    photos: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData();

    // ✅ append all fields
    Object.keys(form).forEach((key) => {
      if (key === "photos" && form.photos) {
        for (let i = 0; i < form.photos.length; i++) {
          data.append("photos", form.photos[i]);
        }
      } else {
        data.append(key, form[key]);
      }
    });

    try {
      await api.post("/requests/raise", data);
      alert("Request raised successfully");
      navigate("/my-requests");
    } catch (err) {
      console.error(err);
      setError("Failed to raise request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="raise-request-container">
      {/* HEADER */}
      <div className="request-header">
        <h2>
          Raise Desludging <br /> Request
        </h2>
        <p>
          Fill in the details below. Accurate address and a short description
          helps us serve you faster.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* Row 1 */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              placeholder="e.g. Deepak Giri"
              required
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              name="mobile"
              placeholder="10-digit number"
              required
              value={form.mobile}
              onChange={handleChange}
            />
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <label>Ward</label>
            <input
              name="ward"
              placeholder="e.g. 5"
              required
              value={form.ward}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Waste Type</label>
            <select
              name="wasteType"
              value={form.wasteType}
              onChange={handleChange}
            >
              <option value="Household">Household</option>
              <option value="Sewage">Sewage</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 3 */}
          <div className="form-group">
            <label>Preferred Time Slot</label>
            <input
              name="timeSlot"
              placeholder="e.g. 9:00 AM - 12:00 PM"
              value={form.timeSlot}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              placeholder="House No, Street, Area"
              required
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {/* Row 4 */}
          <div className="form-group">
            <label>Latitude</label>
            <input
              name="latitude"
              placeholder="e.g. 19.0760"
              value={form.latitude}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input
              name="longitude"
              placeholder="e.g. 72.8777"
              value={form.longitude}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <div className="desc-header">
              <label>Description</label>
              <span className="char-count">
                {form.description.length}/600
              </span>
            </div>
            <textarea
              name="description"
              placeholder="Briefly describe the issue..."
              rows="4"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <p className="note full-width">
            Avoid personal information. You can attach images below.
          </p>

          {/* Photos */}
          <div className="form-group full-width">
            <label>Photos</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, photos: e.target.files })
                }
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="submit-request-btn"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
