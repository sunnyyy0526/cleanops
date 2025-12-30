import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyRequests.css";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/requests/my");
        setRequests(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="my-requests-container">
      <div className="my-requests-header">
        <h2>My Requests</h2>
        <button
          className="raise-btn"
          onClick={() => navigate("/raise-request")}
        >
          Raise Request
        </button>
      </div>

      <div className="requests-table-wrapper">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Ward</th>
              <th>Waste</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="ticket-id">{req.ticketId}</td>
                <td>{req.ward}</td>
                <td className="capitalize">{req.wasteType}</td>
                <td>
                   <span
                            className={`status-badge ${req.status
                         .toLowerCase()
                      .replace(/\s/g, "-")}`}
                       >
                    {req.status}
                    </span>
                </td>
                <td>
                  <button
                    className="view-link"
                    onClick={() => navigate(`/request/${req._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
