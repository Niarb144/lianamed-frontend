"use client";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import UserNav from "../components/UserNav";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mpesa");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const res = await api.post("/billing/checkout", {
        userId,
        items: cart.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        billingAddress,
        paymentMethod,
      });

      const orderId = res.data.billingId;
      alert("Order created! Redirecting to payment...");

      navigate(`/payment/${orderId}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <main>
      <UserNav />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        <div className="bg-white shadow-md rounded-lg p-6 border">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Delivery Address */}
            <div>
              <label className="font-medium block mb-1">Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery location"
                className="w-full border rounded-md p-3 focus:outline-blue-600"
                required
              />
            </div>

            {/* Billing Address */}
            <div>
              <label className="font-medium block mb-1">Billing Address</label>
              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter billing address"
                className="w-full border rounded-md p-3 focus:outline-blue-600"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="font-medium block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-md p-3 cursor-pointer focus:outline-blue-600"
              >
                <option value="Mpesa">Mpesa</option>
                <option value="Card">Card</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            {/* Total */}
            <div className="text-xl font-semibold text-right">
              Total: KES {total}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-md"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
