import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";
import { FaPowerOff } from "react-icons/fa6";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import AddMedicine from "./AddMedicine";
import AllOrders from "./AllOrders";
import AllPrescriptions from "./AllPrescriptions";

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

interface Orders {
  _id: string;
  totalAmount: number;
  date: string;
  customer: { name: string; email: string };
  medicines: { med: { name: string }; qty: number; price: number }[];
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User & { password?: string }>>({});

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [editMedicineData, setEditMedicineData] = useState<Partial<Medicine>>({});
  const [editMedicineImage, setEditMedicineImage] = useState<File | null>(null);

  const [activeSection, setActiveSection] = useState("dashboard");


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
      const [userRes, medRes, billingRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/medicines"),
        api.get("/billing/all"),
      ]);

      setUsers(Array.isArray(userRes.data.users) ? userRes.data.users : []);
      setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
      setOrders(Array.isArray(billingRes.data) ? billingRes.data : []);
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
    <main>
      <AdminNav />
      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <aside
          className="w-64 bg-white shadow-lg p-5 border-r border-gray-200"
          style={{ minHeight: "100vh" }}
        >
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "dashboard" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                📊 Dashboard
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("users")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                👥 Users
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("medicines")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "medicines" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                💊 Medicines
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("addMedicine")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "addMedicine" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                ➕ Add Products
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("orders")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "orders" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                📦 Orders
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("prescriptions")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "prescriptions" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                📄 Prescriptions
              </button>
            </li>

            <li>
              <button
                onClick={() => logout(navigate)}
                className="w-auto text-left px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center gap-2"
              >
                <FaPowerOff /> 
              </button>
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8">

          {/* DASHBOARD OVERVIEW SECTION */}
          {activeSection === "dashboard" && (
            <section>
              <h3 className="text-2xl font-semibold mb-6">📊 Admin Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Users Card */}
                <div
                  onClick={() => setActiveSection("users")}
                  className="cursor-pointer bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold mb-2">Total Users</h4>
                  <p className="text-4xl font-black text-blue-600">{users.length}</p>
                  <p className="text-gray-500 mt-1">View all users →</p>
                </div>

                {/* Medicines Card */}
                <div
                  onClick={() => setActiveSection("medicines")}
                  className="cursor-pointer bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold mb-2">Total Products</h4>
                  <p className="text-4xl font-black text-green-600">{medicines.length}</p>
                  <p className="text-gray-500 mt-1">Manage products →</p>
                </div>

                {/* Orders Card (Optional) */}
                <div
                  onClick={() => setActiveSection("orders")}
                  className="cursor-pointer bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold mb-2">Total Orders</h4>
                  <p className="text-4xl font-black text-purple-600">{orders.length}</p>
                  <p className="text-gray-500 mt-1">View all orders →</p>
                </div>

              </div>
            </section>
          )}

          
          {/* USERS SECTION */}
          {activeSection === "users" && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">👥 Users</h3>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <table className="w-full border-collapse bg-white shadow rounded-lg">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.role}</td>
                        <td className="p-3">
                          <button
                            onClick={() => openUserModal(u)}
                            className="px-3 py-1 bg-yellow-400 text-black rounded"
                          >
                            ✏ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded ml-2"
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
          )}

          {/* MEDICINES SECTION */}
          {activeSection === "medicines" && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">💊 Medicines</h3>

              <table className="w-full border-collapse bg-white shadow rounded-lg">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((m) => (
                    <tr key={m._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{m.name}</td>
                      <td className="p-3">{m.category || "-"}</td>
                      <td className="p-3">{m.price}</td>
                      <td className="p-3">
                        {m.image ? (
                          <img
                            src={`http://localhost:5000${m.image}`}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="p-3">{m.stock}</td>
                      <td className="p-3">
                        <button
                          onClick={() => openMedicineModal(m)}
                          className="px-3 py-1 bg-yellow-400 text-black rounded"
                        >
                          ✏ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMedicine(m._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded ml-2"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* ADD MEDICINE SECTION */}
          {activeSection === "addMedicine" && (
            <section>
              <AddMedicine />
            </section>
          )}

          {/* Orders */}
          {activeSection === "orders" && (
            <section>
              <AllOrders />
            </section>
          )}

          {/* PRESCRIPTIONS */}
          {activeSection === "prescriptions" && (
            <section>
              <AllPrescriptions />
            </section>
          )}

          {/* ================= USER EDIT MODAL ================= */}
          {showUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">✏ Edit User</h2>

                <div className="space-y-3">
                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    value={editUserData.name}
                    onChange={handleUserChange}
                    className="w-full border p-2 rounded"
                    placeholder="Name"
                  />

                  {/* Email */}
                  <input
                    type="email"
                    name="email"
                    value={editUserData.email}
                    onChange={handleUserChange}
                    className="w-full border p-2 rounded"
                    placeholder="Email"
                  />

                  {/* Role */}
                  <select
                    name="role"
                    value={editUserData.role}
                    onChange={handleUserChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>

                  {/* Password */}
                  <input
                    type="password"
                    name="password"
                    value={editUserData.password || ""}
                    onChange={handleUserChange}
                    className="w-full border p-2 rounded"
                    placeholder="New Password (optional)"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-5 space-x-3">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveUserChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MEDICINE EDIT MODAL ================= */}
          {showMedicineModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">✏ Edit Medicine</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    value={editMedicineData.name}
                    onChange={handleMedicineChange}
                    className="border p-2 rounded"
                    placeholder="Name"
                  />

                  {/* Category */}
                  <input
                    type="text"
                    name="category"
                    value={editMedicineData.category || ""}
                    onChange={handleMedicineChange}
                    className="border p-2 rounded"
                    placeholder="Category"
                  />

                  {/* Price */}
                  <input
                    type="number"
                    name="price"
                    value={editMedicineData.price}
                    onChange={handleMedicineChange}
                    className="border p-2 rounded"
                    placeholder="Price"
                  />

                  {/* Stock */}
                  <input
                    type="number"
                    name="stock"
                    value={editMedicineData.stock}
                    onChange={handleMedicineChange}
                    className="border p-2 rounded"
                    placeholder="Stock"
                  />
                </div>

                {/* Image Upload */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Image</label>

                  {/* Preview existing image */}
                  {selectedMedicine?.image && (
                    <img
                      src={`http://localhost:5000${selectedMedicine.image}`}
                      className="w-20 h-20 object-cover rounded mb-3"
                      alt="medicine"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditMedicineImage(e.target.files?.[0] || null)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-5 space-x-3">
                  <button
                    onClick={() => setShowMedicineModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveMedicineChanges}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
        </div>

  <Footer />
</main>

  );
}
