import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Medicine {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Medicine>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    setAuthToken(token);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, medRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/medicines"),
      ]);

      // Ensure data is arrays
      setUsers(Array.isArray(userRes.data.users) ? userRes.data.users : []);
      setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
      setError(null);
    } catch (err: any) {
      console.error("Error loading dashboard:", err.response?.data || err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Delete a user
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      alert("❌ User deleted successfully!");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  // 🪟 Open edit modal
  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setEditUserData({ ...user });
    setShowUserModal(true);
  };

  // 🧾 Handle change in modal form
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  // 💾 Save updated user data
  const saveUserChanges = async () => {
    if (!selectedUser) return;

    try {
      await api.put(`/admin/users/${selectedUser._id}`, editUserData);
      alert("✅ User updated successfully!");
      setShowUserModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  // 🧾 Edit medicine handlers
  const handleEdit = (m: Medicine) => {
    setEditingId(m._id);
    setEditForm({
      name: m.name,
      category: m.category,
      description: m.description,
      price: m.price,
      stock: m.stock,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/medicines/${id}`, {
        ...editForm,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      });
      alert("✅ Medicine updated successfully!");
      setEditingId(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update medicine");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;

    try {
      await api.delete(`/medicines/${id}`);
      alert("❌ Medicine deleted successfully!");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete medicine");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Admin Dashboard</h2>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* HEADER */}
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Admin Dashboard</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/add-medicine")}
            className="btn"
            style={{ background: "#4CAF50", color: "white" }}
          >
            ➕ Add Medicine
          </button>
          <button
            onClick={() => navigate("/medicines")}
            className="btn"
            style={{ background: "#007BFF", color: "white" }}
          >
            💊 View Medicines
          </button>
          <button
            className="btn btn-logout"
            onClick={() => logout(navigate)}
            style={{ background: "#dc3545", color: "#fff" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          ⚠️ {error}
        </p>
      )}

      {/* 👥 USERS TABLE */}
      <section style={{ marginTop: "20px" }}>
        <h3>👥 Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Email</th>
                <th style={{ padding: "10px" }}>Role</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{u.name}</td>
                  <td style={{ padding: "10px" }}>{u.email}</td>
                  <td style={{ padding: "10px" }}>{u.role}</td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => openUserModal(u)}
                      className="btn"
                      style={{ background: "#ffc107", color: "#000" }}
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn"
                      style={{ background: "#dc3545", color: "white", marginLeft: "5px" }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 💊 MEDICINES TABLE */}
      <section style={{ marginTop: "40px" }}>
        <h3>💊 Medicines</h3>
        {medicines.length === 0 ? (
          <p>No medicines available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Category</th>
                <th style={{ padding: "10px" }}>Description</th>
                <th style={{ padding: "10px" }}>Price (KES)</th>
                <th style={{ padding: "10px" }}>Image</th>
                <th style={{ padding: "10px" }}>Stock</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m._id} style={{ borderBottom: "1px solid #eee" }}>
                  {editingId === m._id ? (
                    <>
                      <td><input name="name" value={editForm.name || ""} onChange={handleEditChange} /></td>
                      <td><input name="category" value={editForm.category || ""} onChange={handleEditChange} /></td>
                      <td><input name="description" value={editForm.description || ""} onChange={handleEditChange} /></td>
                      <td><input name="price" type="number" value={editForm.price || ""} onChange={handleEditChange} /></td>
                      <td><input type="file" accept="image/*" value={editForm.image || "No Image"} onChange={handleEditChange} /></td>
                      <td><input name="stock" type="number" value={editForm.stock || ""} onChange={handleEditChange} /></td>
                      <td>
                        <button onClick={() => saveEdit(m._id)} className="btn" style={{ background: "#28a745", color: "white" }}>
                          💾 Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn" style={{ background: "#6c757d", color: "white", marginLeft: "5px" }}>
                          ✖ Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "10px" }}>{m.name}</td>
                      <td style={{ padding: "10px" }}>{m.category || "-"}</td>
                      <td style={{ padding: "10px" }}>{m.description || "-"}</td>
                      <td style={{ padding: "10px" }}>{m.price}</td>
                      <td style={{ padding: "10px" }}>
                        {m.image ? (
                          <img
                            src={`${(import.meta as any).env.VITE_API_BASE}${m.image}`}
                            alt={m.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td style={{ padding: "10px" }}>{m.stock}</td>

                      <td style={{ padding: "10px" }}>{m.stock}</td>
                      <td style={{ padding: "10px" }}>
                        <button onClick={() => handleEdit(m)} className="btn" style={{ background: "#ffc107", color: "#000" }}>
                          ✏ Edit
                        </button>
                        <button onClick={() => handleDelete(m._id)} className="btn" style={{ background: "#dc3545", color: "white", marginLeft: "5px" }}>
                          🗑 Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 🪟 EDIT USER MODAL */}
      {showUserModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Edit User</h3>
            <label>Name:</label>
            <input
              name="name"
              value={editUserData.name || ""}
              onChange={handleUserChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <label>Email:</label>
            <input
              name="email"
              value={editUserData.email || ""}
              onChange={handleUserChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <label>Role:</label>
            <select
              name="role"
              value={editUserData.role || ""}
              onChange={handleUserChange}
              style={{ width: "100%", marginBottom: "15px" }}
            >
              <option value="user">User</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setShowUserModal(false)}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button
                onClick={saveUserChanges}
                style={{ background: "#28a745", color: "#fff" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
