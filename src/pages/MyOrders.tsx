import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import UserNav from "../components/UserNav";
import Footer from "../components/Footer";

interface Order {
  _id: string;
  totalAmount: number;
  date: string;
  medicines: { med: { name: string }; qty: number; price: number }[];
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
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>🧾 My Orders</h2>
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
            <h4>🕓 {new Date(order.date).toLocaleString()}</h4>
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
    <Footer />
    </main>
  );
}
