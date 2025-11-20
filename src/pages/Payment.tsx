"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import UserNav from "../components/UserNav";
import Footer from "../components/Footer";

interface Order {
  _id: string;
  totalAmount: number;
  paymentMethod: "Mpesa" | "Card" | "PayPal";
  paymentStatus: string;
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/billing/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load order.");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handlePayment = async () => {
    if (!order) return;
    setProcessing(true);

    try {
      // Simulate payment success
      const res = await api.put(`/billing/${order._id}/pay`, { success: true });
      alert("Payment successful!");
      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading order...</p>;

  if (!order) return null;

  return (
    <main>
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Payment</h2>

        <div className="bg-white border rounded-lg shadow p-6 space-y-4">
          <p><span className="font-semibold">Order ID:</span> {order._id}</p>
          <p><span className="font-semibold">Total Amount:</span> KES {order.totalAmount}</p>
          <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
          <p>
            <span className="font-semibold">Payment Status:</span>{" "}
            <span className={order.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"}>
              {order.paymentStatus}
            </span>
          </p>

          {order.paymentStatus === "Paid" ? (
            <p className="text-green-700 font-medium">✅ This order has already been paid.</p>
          ) : (
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4 disabled:opacity-50"
            >
              {processing ? "Processing..." : `Pay with ${order.paymentMethod}`}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
