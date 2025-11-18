import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  totalAmount: number;
  date: string;
  customer: { name: string; email: string };
  medicines: { med: { name: string }; qty: number; price: number }[];
  status: string;
}

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "pharmacist" && role !== "admin")) {
      alert("Only authorized staff can view all orders.");
      navigate("/login");
      return;
    }

    setAuthToken(token);

    api
      .get("/billing/all")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load all orders.");
      });
  }, [navigate]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const updateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await api.put(`/billing/${selectedOrder._id}/status`, { status: newStatus });

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? { ...o, status: newStatus } : o))
      );

      closeModal();
      alert("Order status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  return (
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
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">🕓 {new Date(order.date).toLocaleString()}</div>
                    <button
                      onClick={() => openModal(order)}
                      className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Change Status</h3>
            <p className="mb-4">
              Order for <span className="font-semibold">{selectedOrder.customer.name}</span>
            </p>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
