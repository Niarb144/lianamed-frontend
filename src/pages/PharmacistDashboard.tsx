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
import Products from "./Products";

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

interface Prescriptions {
  _id: string;
  user: { name: string; email: string };
  image: string;
  date: string;
}

export default function PharmacistDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescriptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showMedicineModal, setShowMedicineModal] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [editMedicineData, setEditMedicineData] = useState<Partial<Medicine>>({});
  const [editMedicineImage, setEditMedicineImage] = useState<File | null>(null);

  const [activeSection, setActiveSection] = useState("dashboard");


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "pharmacist") {
      navigate("/login");
      return;
    }

    setAuthToken(token);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medRes, billingRes, presRes] = await Promise.all([
        api.get("/medicines"),
        api.get("/billing/all"),
        api.get("/prescriptions/all"),
      ]);

      setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
      setOrders(Array.isArray(billingRes.data) ? billingRes.data : []);
      setPrescriptions(Array.isArray(presRes.data) ? presRes.data : []);
      setError(null);
    } catch (err: any) {
      console.error("Error loading dashboard:", err.response?.data || err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditMedicineData({ ...editMedicineData, [e.target.name]: e.target.value });
    };


  // ✏ Open medicine edit modal
  const openMedicineModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setEditMedicineData({ ...medicine });
    setShowMedicineModal(true);
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
          <h2 className="text-xl font-bold mb-6">Pharmacist Panel</h2>

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
                onClick={() => setActiveSection("medicines")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "medicines" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                💊 Products
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
                onClick={() => setActiveSection("shop")}
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  activeSection === "shop" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                Shop
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
              <h3 className="text-2xl font-semibold mb-6">📊 Pharmacist Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

                 {/* Users Card */}
                <div
                  onClick={() => setActiveSection("prescriptions")}
                  className="cursor-pointer bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold mb-2">Total Prescriptions</h4>
                  <p className="text-4xl font-black text-blue-600">{prescriptions.length}</p>
                  <p className="text-gray-500 mt-1">View all prescriptions →</p>
                </div>

              </div>
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

          {/* SHOP SECTION */}
          {activeSection === "shop" && (
            <section>
              <Products />
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
