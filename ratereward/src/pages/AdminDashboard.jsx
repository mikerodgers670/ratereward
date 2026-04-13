import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const SUPABASE_URL = "https://cajmxqlkxsdnuzypnbxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_fSRvlD3PY9xNfsaMD5vvuQ_VNBUbKll";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/members?select=*&order=created_at.desc`,
        { headers }
      );
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ status: newStatus }),
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };

  const filtered = members.filter((m) => {
    const matchSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalMembers = members.length;
  const totalRevenue = members.reduce((sum, m) => sum + m.amount_paid, 0);
  const pendingCount = members.filter((m) => m.status === "pending").length;
  const activeCount = members.filter((m) => m.status === "active").length;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>RateReward Admin</h1>
        <div className="header-right">
          <button className="refresh-btn" onClick={fetchMembers}>🔄 Refresh</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalMembers}</h3>
          <p>Total Members</p>
        </div>
        <div className="stat-card active">
          <h3>{activeCount}</h3>
          <p>Active</p>
        </div>
        <div className="stat-card pending">
          <h3>{pendingCount}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card revenue">
          <h3>KES {totalRevenue.toLocaleString()}</h3>
          <p>Total Collected</p>
        </div>
      </div>

      <div className="filters-row">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading members...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {members.length === 0
            ? "No members registered yet."
            : "No members match your search."}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan (KES)</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>{m.full_name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{m.amount_paid.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${m.status}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {m.status === "pending" && (
                      <button
                        className="action-btn approve"
                        onClick={() => updateStatus(m.id, "active")}
                      >
                        Approve
                      </button>
                    )}
                    {m.status === "active" && (
                      <button
                        className="action-btn complete"
                        onClick={() => updateStatus(m.id, "completed")}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => deleteMember(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
