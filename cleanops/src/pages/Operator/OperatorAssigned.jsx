import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./OperatorAssigned.css";

export default function OperatorAssigned() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH FROM BACKEND ----------------
  const fetchAssigned = async () => {
    try {
      setLoading(true);
      const res = await api.get("/requests/assigned");
      setItems(res.data || []);
    } catch (err) {
      console.error("Assigned fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  // ---------------- FILTER ----------------
  const filteredItems =
    status === "All"
      ? items
      : items.filter((r) => r.status === status);

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/requests/${id}/status`, {
        status: newStatus,
      });
      fetchAssigned(); // refresh
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="operator-assigned">
      <h2>Assigned Requests</h2>

      {/* -------- Filter -------- */}
      <div className="filters">
        <label>Filter Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            "All",
            "Assigned",
            "On the Way",
            "In Progress",
            "Completed",
            "Rejected",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* -------- Table -------- */}
      <table className="table striped hover assignments">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Ward</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No assigned requests
              </td>
            </tr>
          ) : (
            filteredItems.map((r) => (
              <tr key={r._id}>
                <td>{r.ticketId}</td>
                <td>{r.ward}</td>
                <td>
                  <span
                    className={`badge ${r.status
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  {[
                    "On the Way",
                    "In Progress",
                    "Completed",
                    "Rejected",
                  ].map((s) => (
                    <button
                      key={s}
                      className="btn small"
                      disabled={r.status === s}
                      onClick={() => updateStatus(r._id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
