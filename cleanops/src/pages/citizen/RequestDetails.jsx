import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RequestDetails.css";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/requests/${id}`);
        setRequest(res.data);
      } catch (err) {
        navigate("/my-requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, navigate]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (!request) return null;

  return (
    <div className="details-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        &lt; Back to My Requests
      </div>
      {/* ================= HEADER ================= */}
      <div className="details-header">
        <div>
          <h1>
            Ticket <br /> {request.ticketId}
          </h1>

          <div className="badges">
            <span className="badge status-open">{request.status}</span>
            <span className="badge ward">Ward {request.ward}</span>
            <span className="badge waste">{request.wasteType}</span>
          </div>
        </div>

        <div className="header-right">
          <p>
            Raised on{" "}
            {new Date(request.createdAt).toLocaleString()}
          </p>
          <p className="sub-text">
            Last update{" "}
            {new Date(request.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="details-grid">

        {/* DETAILS CARD */}
        <div className="card">
          <h3>Details</h3>

          <div className="detail-row">
            <span className="detail-label">Citizen:</span>
            <span className="valuee">{request.user?.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Mobile:</span>
            <span className="valuee">
              {request.user?.phone || "1234567890"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="valuee">
              {request.address || "hyderabad"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Coordinates:</span>
            <span className="valuee">
              {request.latitude || "14.1234"}, {request.longitude || "12.1234"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Preferred Slot:</span>
            <span className="valuee">
              {request.timeSlot || "10:00–12:00"}
            </span>
          </div>
        </div>

        {/* OPERATOR CARD */}
        <div className="card">
          <h3>Assigned Operator</h3>

          {request.assignedOperator ? (
            <>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="valuee">
                  {request.assignedOperator.name}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Ward:</span>
                <span className="valuee">
                  {request.assignedOperator.ward}
                </span>
              </div>
            </>
          ) : (
            <p className="not-assigned">Not assigned yet</p>
          )}
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="card full-width-card">
        <h3>Description</h3>
        <div className="description-box">
          {request.description}
        </div>
      </div>

      {/* ================= UPDATES ================= */}
      {/* ================= UPDATES ================= */}
<div className="card full-width-card">
  <h3>Updates</h3>

  <ul className="updates-list">
    {(!request.notes || request.notes.length === 0) && (
      <li className="muted">No updates yet</li>
    )}

    {request.notes?.map((n, i) => (
      <li key={i} className="update-item">
        <span className="update-meta">
          [{new Date(n.createdAt).toLocaleString()}]{" "}
          {n.user?.role || "admin"}:
        </span>{" "}
        {n.text}
      </li>
    ))}
  </ul>
</div>

    </div>
  );
}
