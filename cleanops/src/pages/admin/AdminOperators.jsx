import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminOperators.css";

export default function AdminOperators() {
  const [operators, setOperators] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  ward: "",
});


  /* ======================
     FETCH OPERATORS
  ====================== */
  const fetchOperators = async () => {
    try {
      setLoading(true);
      const res = await api.get("/operators");
      setOperators(res.data || []);
    } catch (err) {
      setError("Failed to load operators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  /* ======================
     CREATE OPERATOR
  ====================== */
  const createOperator = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!form.ward.trim()) {
      setError("Ward is required");
      return;
    }

    try {
      await api.post("/operators", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        ward: form.ward.trim(), // ✅ CRITICAL FIX
      });

      setMsg("Operator created successfully");
      setForm({
        name: "",
        email: "",
        phone: "",
        ward: "",
        password: "",
      });

      fetchOperators();
    } catch (err) {
      setError(err.response?.data?.message || "Creation failed");
    }
  };

  /* ======================
     SEARCH FILTER
  ====================== */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return operators.filter((o) =>
      [o.name, o.email, o.phone, o.ward]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [operators, search]);

  return (
    <div className="admin-operators">
      {/* HEADER */}
      <div className="header">
        <h2>Operators</h2>
        <p>Create and manage field operators assigned to wards.</p>
      </div>

      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="split">
        {/* ======================
            LEFT: CREATE OPERATOR
        ====================== */}
        <div className="panel">
          <h3>Create Operator</h3>

          <form className="form" onSubmit={createOperator}>
            <div className="grid-2">
              <div className="field">
                <label>Name</label>
                <input
                  placeholder="e.g. Ravi"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  placeholder="Optional"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
  type="password"
  placeholder="Password"
  value={form.password}
  onChange={(e) =>
    setForm({ ...form, password: e.target.value })
  }
  required
/>

              </div>

              <div className="field">
                <label>Ward</label>
                <input
                  placeholder="e.g. 12"
                  value={form.ward}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ward: e.target.value.replace(/\D/g, ""), // ✅ numbers only
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="actions">
              <button className="btn primary" disabled={loading}>
                {loading ? "Creating..." : "Create Operator"}
              </button>
            </div>
          </form>
        </div>

        {/* ======================
            RIGHT: OPERATORS LIST
        ====================== */}
        <div className="panel">
          <div className="list-header">
            <h3>All Operators</h3>
            <input
              className="search"
              placeholder="Search name, email, ward"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="operators-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Ward</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="muted">
                      No operators found
                    </td>
                  </tr>
                )}

                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.phone || "—"}</td>
                    <td>{o.ward}</td>
                    <td>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}