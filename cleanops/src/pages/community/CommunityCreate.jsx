import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CommunityCreate.css";

export default function CommunityCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    ward: "",
    wasteType: "Household",
    address: "",
    latitude: "",
    longitude: "",
    targetDate: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/community", form);
    navigate("/community");
  };

  return (
    <div className="create-wrapper">
      
      {/* HEADER */}
      <div className="create-header-text">
        <h2>Create Community Project</h2>
        <p>
          Organize a neighborhood clean-up or desludging drive.
          Share clear details to get more citizens involved.
        </p>
      </div>

      {/* CARD */}
      <div className="create-card">
        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              placeholder="e.g. Ward 5 Desludging Drive"
              required
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <div className="label-row">
              <label>Description</label>
              <span className="count">0/800</span>
            </div>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the project goals, meeting point, and any coordination details"
              onChange={handleChange}
            />
          </div>

          {/* ROW 1 */}
          <div className="form-row">
            <div className="col">
              <label>Ward</label>
              <input
                name="ward"
                placeholder="e.g. 5"
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Waste Type</label>
              <select
                name="wasteType"
                value={form.wasteType}
                onChange={handleChange}
              >
                <option>Household</option>
                <option>Sewage</option>
                <option>Commercial</option>
                <option>Industrial</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="form-row">
            <div className="col">
              <label>Address</label>
              <input
                name="address"
                placeholder="Meeting point or project address"
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Latitude</label>
              <input
                name="latitude"
                placeholder="e.g. 19.0760"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="form-row">
            <div className="col">
              <label>Longitude</label>
              <input
                name="longitude"
                placeholder="e.g. 72.8777"
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Target Date</label>
              <input
                type="date"
                name="targetDate"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PHOTOS */}
          <div className="form-group">
            <label>Photos</label>
            <div className="file-input-box">
              <input type="file" />
              {/* <span>No files selected.</span> */}
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="submit-btn">
            Create Project
          </button>

        </form>
      </div>
    </div>
  );
}