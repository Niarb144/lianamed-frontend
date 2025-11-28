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


export default function Rider() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState("dashboard");


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "rider") {
      navigate("/login");
      return;
    }

    setAuthToken(token);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medRes, billingRes] = await Promise.all([
        api.get("/medicines"),
        api.get("/billing/all"),
      ]);

      setOrders(Array.isArray(billingRes.data) ? billingRes.data : []);
      setError(null);
    } catch (err: any) {
      console.error("Error loading dashboard:", err.response?.data || err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
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
              <h3 className="text-2xl font-semibold mb-6">Rider Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

          {/* Orders */}
          {activeSection === "orders" && (
            <section>
              <AllOrders />
            </section>
          )}
        </div>
        </div>

  <Footer />
</main>

  );
}
