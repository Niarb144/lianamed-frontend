import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import UserNav from "../components/UserNav";
import Footer from "../components/Footer";

interface Order {
  _id: string;
  totalAmount: number;
  date: string;
  customer: { name: string; email: string };
  medicines: { med: { name: string }; qty: number; price: number }[];
  status: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view your orders.");
      navigate("/login");
      return;
    }

    setAuthToken(token);

    api.get("/billing/my")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load your orders.");
      });
  }, [navigate]);

  return (
    <main>
      <UserNav />
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">💊 All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const statusColors: Record<string, string> = {
              Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
              Shipped: "bg-blue-100 text-blue-700 border-blue-300",
              Delivered: "bg-green-100 text-green-700 border-green-300",
              Cancelled: "bg-red-100 text-red-700 border-red-300",
            };
            const badgeStyle =
              statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-300";

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      👤 {order.customer?.name || "Unknown"}
                    </h4>
                    <p className="text-sm text-gray-500">{order.customer?.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium border rounded-full ${badgeStyle}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Medicines List */}
                <div className="p-5 bg-gray-50 flex-1">
                  <ul className="divide-y divide-gray-200">
                    {order.medicines.map((m, i) => (
                      <li key={i} className="py-2 flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{m.med.name}</span>
                        <span className="text-gray-600">
                          {m.qty} ×{" "}
                          <span className="font-semibold text-gray-800">KES {m.price}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="p-5 flex justify-between items-center border-t border-gray-100">
                  <div className="text-gray-800 font-semibold">
                    Total: <span className="text-blue-700">KES {order.totalAmount}</span>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    <Footer />
    </main>
  );
}
