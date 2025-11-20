import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api"; 
import UserNav from "../components/UserNav";
import Footer from "../components/Footer";


export default function Cart() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
  try {
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    const orderData = {
      userId,
      items: cart.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
      })),
    };

    console.log("🧾 Checkout payload:", orderData);

    // When user clicks "Checkout"
    navigate("/checkout");

  } catch (err: any) {
    console.error("❌ Checkout error:", err.response?.data || err);
    alert(err.response?.data?.message || "Failed to checkout.");
  }
};


  return (
    <main>
      <UserNav />
    <div
      className="container"
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>🛒 Your Cart</h2>
        <button
          onClick={() => navigate("/home")}
          style={{
            background: "#007BFF",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Store
        </button>
      </header>

      {cart.length === 0 ? (
        <p>Your cart is empty. Start shopping!</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px" }}>Product</th>
                <th style={{ padding: "10px" }}>Price</th>
                <th style={{ padding: "10px" }}>Quantity</th>
                <th style={{ padding: "10px" }}>Subtotal</th>
                <th style={{ padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr
                  key={item._id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={
                        item.image
                          ? `${"http://locahlost:5000"}${item.image}`
                          : "https://via.placeholder.com/50x50?text=No+Image"
                      }
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    {item.name}
                  </td>

                  <td style={{ padding: "10px" }}>KES {item.price}</td>

                  {/* ✅ Quantity Controls */}
                  <td style={{ padding: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        style={{
                          background: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          cursor: "pointer",
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        style={{
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td style={{ padding: "10px" }}>
                    KES {item.price * item.quantity}
                  </td>

                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={clearCart}
              style={{
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Clear Cart
            </button>

            <div>
              <h3>Total: KES {total}</h3>
              <button
                onClick={handleCheckout}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    <Footer />
    </main>
  );
}
