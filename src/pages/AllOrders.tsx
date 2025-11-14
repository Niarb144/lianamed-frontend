import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  totalAmount: number;
  date: string;
  customer: { name: string; email: string };
  medicines: { med: { name: string }; qty: number; price: number }[];
}

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "pharmacist") {
      alert("Only pharmacists can view all orders.");
      navigate("/login");
      return;
    }

    setAuthToken(token);

    api.get("/billing/all")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load all orders.");
      });
  }, [navigate]);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>💊 All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h4>👤 {order.customer?.name || "Unknown"}</h4>
            <p>Email: {order.customer?.email}</p>
            <p>🕓 {new Date(order.date).toLocaleString()}</p>
            <ul>
              {order.medicines.map((m, i) => (
                <li key={i}>
                  {m.med.name} — {m.qty} × KES {m.price}
                </li>
              ))}
            </ul>
            <strong>Total: KES {order.totalAmount}</strong>
          </div>
        ))
      )}
    </div>
  );
}
