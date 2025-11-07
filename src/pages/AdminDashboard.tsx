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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User & { password?: string }>>({});

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [editMedicineData, setEditMedicineData] = useState<Partial<Medicine>>({});
  const [editMedicineImage, setEditMedicineImage] = useState<File | null>(null);

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

  // 🪟 Open modals
  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setEditUserData({ ...user });
    setShowUserModal(true);
  };
  const openMedicineModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setEditMedicineData({ ...medicine });
    setShowMedicineModal(true);
  };

  // 🧾 Handle input changes
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };
  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMedicineData({ ...editMedicineData, [e.target.name]: e.target.value });
  };

  // 💾 Save user (including password)
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

  // 💾 Save medicine (with image upload)
  const saveMedicineChanges = async () => {
    if (!selectedMedicine) return;

    try {
      const formData = new FormData();
      Object.entries(editMedicineData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      if (editMedicineImage) formData.append("image", editMedicineImage);

      await api.put(`/medicines/${selectedMedicine._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Medicine updated successfully!");
      setShowMedicineModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update medicine");
    }
  };

  // 🗑 Delete medicine
  const handleDeleteMedicine = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      alert("❌ Medicine deleted successfully!");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete medicine");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>
        <h3>Welcome, {localStorage.getItem("userName")}</h3>
        <div className="p-5 flex gap-4">
          <button onClick={() => navigate("/add-medicine")} className="btn">➕ Add Medicine</button>
          <button onClick={() => logout(navigate)} className="btn btn-logout">Logout</button>
        </div>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* USERS TABLE */}
      <section>
        <h3>👥 Users</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  <button onClick={() => openUserModal(u)}
                    className="btn"
                    style={{ background: "#ffc107", color: "#000" }}>✏ Edit</button>
                  <button onClick={() => handleDeleteUser(u._id)}
                    className="btn"
                    style={{ background: "#dc3545", color: "white", marginLeft: "5px" }}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* MEDICINES TABLE */}
      <section style={{ marginTop: "40px" }}>
        <h3>💊 Medicines</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Category</th>
              <th style={{ padding: "10px" }}>Price</th>
              <th style={{ padding: "10px" }}>Image</th>
              <th style={{ padding: "10px" }}>Stock</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m._id}>
                <td style={{ padding: "10px" }}>{m.name}</td>
                <td style={{ padding: "10px" }}>{m.category || "-"}</td>
                <td style={{ padding: "10px" }}>{m.price}</td>
                <td style={{ padding: "10px" }}>
                  {m.image ? (
                    <img
                      src={`${"http://localhost:5000"}${m.image}`}
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
                <td style={{ padding: "10px" }}>
                  <button onClick={() => openMedicineModal(m)}
                    className="btn"
                    style={{ background: "#ffc107", color: "#000" }}>✏ Edit</button>
                  <button onClick={() => handleDeleteMedicine(m._id)}
                    className="btn"
                    style={{ background: "#dc3545", color: "white", marginLeft: "5px" }}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* USER MODAL */}
      {showUserModal && selectedUser && (
        <div className="modal-backdrop"
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
          }}>
          <div className="modal"
          style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}>
            <h3>Edit User</h3>
            <label>Name</label>
            <input name="name" value={editUserData.name || ""} onChange={handleUserChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Email</label>
            <input name="email" value={editUserData.email || ""} onChange={handleUserChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Password (optional)</label>
            <input name="password" type="password" value={editUserData.password || ""} onChange={handleUserChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Role</label>
            <select name="role" value={editUserData.role || ""} onChange={handleUserChange}
            style={{ width: "100%", marginBottom: "15px" }}>
              <option value="user">User</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button onClick={() => setShowUserModal(false)}
                className="btn"
                style={{ marginRight: "10px" }}>Cancel</button>
              <button onClick={saveUserChanges}
                className="btn"
                style={{ background: "#28a745", color: "#fff" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* MEDICINE MODAL */}
      {showMedicineModal && selectedMedicine && (
        <div className="modal-backdrop"
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
          }}>
          <div className="modal"
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}>
            <h3>Edit Medicine</h3>
            <label>Name</label>
            <input name="name" value={editMedicineData.name || ""} onChange={handleMedicineChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Category</label>
            <input name="category" value={editMedicineData.category || ""} onChange={handleMedicineChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Description</label>
            <input name="description" value={editMedicineData.description || ""} onChange={handleMedicineChange}
            style={{ width: "100%", marginBottom: "10px" }} />
            <label>Price</label>
            <input name="price" type="number" value={editMedicineData.price || ""} onChange={handleMedicineChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Stock</label>
            <input name="stock" type="number" value={editMedicineData.stock || ""} onChange={handleMedicineChange} 
            style={{ width: "100%", marginBottom: "10px" }}/>
            <label>Image</label>
            <input type="file" accept="image/*" onChange={(e) => setEditMedicineImage(e.target.files?.[0] || null)} 
            style={{ width: "100%", marginBottom: "10px" }}/>

            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button onClick={() => setShowMedicineModal(false)}
                className="btn"
                style={{ marginRight: "10px" }}>Cancel</button>
              <button onClick={saveMedicineChanges}
                className="btn"
                style={{ background: "#28a745", color: "#fff" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
