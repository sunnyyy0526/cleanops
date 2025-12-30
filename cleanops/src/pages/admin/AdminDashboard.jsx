import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    ward: "",
    status: "All",
    wasteType: "All",
  });

  /* ======================
     FETCH DATA
  ====================== */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [reqRes, opRes] = await Promise.all([
        api.get("/requests"),
        api.get("/operators"),
      ]);

      setRequests(reqRes.data || []);
      setOperators(opRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ======================
     SELECTED REQUEST
  ====================== */
  const selected = useMemo(
    () => requests.find((r) => r._id === selectedId),
    [requests, selectedId]
  );

  /* ======================
     STATS (ONLY TODAY FIXED)
  ====================== */
  

  const stats = useMemo(() => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const isToday = (date) =>
    date &&
    new Date(date).toISOString().slice(0, 10) === todayStr;

  return {
    // ✅ requests CREATED today
    today: requests.filter((r) => isToday(r.createdAt)).length,

    // ⬇ unchanged (all days)
    pending: requests.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected"
    ).length,

    // ✅ requests COMPLETED today
    completed: requests.filter(
      (r) =>
        r.status === "Completed" &&
        isToday(r.updatedAt || r.completedAt || r.createdAt)
    ).length,

    // ⬇ unchanged
    sla: requests.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected"
    ).length,
  };
}, [requests]);

  /* ======================
     FILTERED REQUESTS
  ====================== */
  const filtered = useMemo(() => {
  return requests.filter((r) => {
    if (
      filters.ward &&
      String(r.ward) !== String(filters.ward)
    )
      return false;

    if (
      filters.status !== "All" &&
      r.status !== filters.status
    )
      return false;

    if (
      filters.wasteType !== "All" &&
      String(r.wasteType).toLowerCase() !==
        String(filters.wasteType).toLowerCase()
    )
      return false;

    return true;
  });
}, [requests, filters]);


  /* ======================
     ACTIONS
  ====================== */
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}/status`, { status });
      fetchAll();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const assignOperator = async (id, operatorId) => {
    if (!operatorId) return;

    try {
      await api.put(`/requests/${id}/assign`, { operatorId });
      fetchAll();
    } catch (err) {
      console.error("Assign operator failed:", err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="admin-manage">
      <h2>Admin Workspace</h2>

      {/* ======================
          STATS
      ====================== */}
      <div className="stats-grid">
        <Stat
          label="Today's Requests"
          value={stats.today}
          border="default-border"
        />
        <Stat
          label="Pending"
          value={stats.pending}
          border="warning-border"
        />
        <Stat
          label="Completed Today"
          value={stats.completed}
          border="success-border"
        />
        <Stat
          label="SLA Breaches"
          value={stats.sla}
          border="danger-border"
        />
      </div>

      {/* ======================
          FILTERS
      ====================== */}
      <div className="filters-row">
        <FilterInput
          label="Ward"
          value={filters.ward}
          placeholder="e.g. 5"
          onChange={(v) => setFilters({ ...filters, ward: v })}
        />

        <FilterSelect
          label="Status"
          value={filters.status}
          options={[
            "All",
            "Open",
            "Assigned",
            "In Progress",
            "On the way",
            "Completed",
            "Rejected",
          ]}
          onChange={(v) => setFilters({ ...filters, status: v })}
        />

        <FilterSelect
  label="Waste Type"
  value={filters.wasteType}
  options={[
    "All",
    "Household",
    "Commercial",
    "Industrial",
    "Sewage",
    "Other",
  ]}
  onChange={(v) =>
    setFilters({ ...filters, wasteType: v })
  }
/>

      </div>

      {/* ======================
          WORKSPACE
      ====================== */}
      <div className="workspace-split">
        <div className="requests-list">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Citizen</th>
                <th>Ward</th>
                <th>Waste</th>
                <th>Status</th>
                <th>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const statusClass = r.status
                  .toLowerCase()
                  .replace(/\s/g, "-");

                return (
                  <tr
                    key={r._id}
                    className={r._id === selectedId ? "active-row" : ""}
                    onClick={() => setSelectedId(r._id)}
                  >
                    <td>{r.ticketId}</td>
                    <td>{r.user?.name || "—"}</td>
                    <td>{r.ward}</td>
                    <td>{r.wasteType}</td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.assignedOperator?.name || "No"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="right">
          {selected ? (
            <div className="card details">
              <div className="header">
                <div>
                  <div className="ticket">{selected.ticketId}</div>
                  <div className="muted">
                    Created{" "}
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>
                </div>

                <select
                  className="status-select"
                  value={selected.status}
                  onChange={(e) =>
                    updateStatus(selected._id, e.target.value)
                  }
                >
                  <option>Open</option>
                  <option>Assigned</option>
                  <option>In Progress</option>
                  <option>On the way</option>
                  <option>Completed</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="field-row">
                <span className="label">Assign Operator</span>
                <select
                  className="operator-select"
                  value={selected.assignedOperator?._id || ""}
                  onChange={(e) =>
                    assignOperator(selected._id, e.target.value)
                  }
                >
                  <option value="">Select Operator</option>
                  {operators.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <Detail label="Citizen" value={selected.user?.name} />
                {/* <Detail label="Mobile" value={selected.user?.phone} /> */}
                <Detail label="Mobile" value={selected.mobile} />

                <Detail label="Address" value={selected.address} />
                <Detail
                  label="Coordinates"
                  value={`${selected.latitude || "—"}, ${selected.longitude || "—"}`}
                />
                <Detail label="Ward" value={selected.ward} />
                <Detail label="Waste Type" value={selected.wasteType} />
                <Detail label="Preferred Slot" value={selected.timeSlot} />
              </div>

              <div className="section">
                <div className="section-title">Description</div>
                <div className="description-text">
                  {selected.description || "—"}
                </div>
              </div>
          {selected.photos?.length > 0 && (
  <div className="section">
    <div className="section-title">Photos</div>

    <ul className="photo-list">
      {selected.photos.map((p, i) => (
        <li key={i} className="photo-item">
          <a
            href={`http://localhost:5000${p}`}
            target="_blank"
            rel="noreferrer"
            className="photo-link"
          >
            📷 photo-{i + 1}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}




             <div className="section">
  <div className="section-title">Notes</div>

  <ul className="notes">
    {(!selected.notes || selected.notes.length === 0) && (
      <li className="muted">No activity yet</li>
    )}

    {selected.notes?.map((n, i) => (
      <li key={i}>
        <span className="muted">
          [{new Date(n.createdAt).toLocaleString()}]{" "}
          {n.user?.role || "admin"}:
        </span>{" "}
        {n.text}
      </li>
    ))}
  </ul>
</div>

            </div>
          ) : (
            <div className="muted">
              Select a request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================
   HELPERS
====================== */

function Detail({ label, value }) {
  return (
    <div className="field-row">
      <span className="label">{label}</span>
      <span className="value">{value || "—"}</span>
    </div>
  );
}

function Stat({ label, value, border }) {
  return (
    <div className={`card stat ${border}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder }) {
  return (
    <div className="filter-group">
      <label>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="filter-group">
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}