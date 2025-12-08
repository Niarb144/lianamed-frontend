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
        marginTop: "80px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <h2 style={{ fontSize: "1.5rem" }}>🛒 Your Cart</h2>
      <button
        onClick={() => navigate("/home")}
        style={{
          background: "#007BFF",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          width: "100%",
          maxWidth: "160px",
        }}
      >
        ⬅ Back to Store
      </button>
    </header>

    {cart.length === 0 ? (
      <p>Your cart is empty. Start shopping!</p>
    ) : (
      <>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              minWidth: "500px",
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
                <th style={{ padding: "10px" }}>Qty</th>
                <th style={{ padding: "10px" }}>Subtotal</th>
                <th style={{ padding: "10px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <img
                      src={
                        item.image
                          ? `${"http://localhost:5000"}${item.image}`
                          : "https://via.placeholder.com/50x50?text=No+Image"
                      }
                      alt={item.name}
                      style={{
                        width: "55px",
                        height: "55px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <span style={{ fontSize: "14px" }}>{item.name}</span>
                  </td>

                  <td style={{ padding: "10px", fontSize: "14px" }}>
                    KES {item.price}
                  </td>

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

                  <td style={{ padding: "10px", fontSize: "14px" }}>
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            flexWrap: "wrap",
            gap: "20px",
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
              width: "100%",
              maxWidth: "150px",
            }}
          >
            Clear Cart
          </button>

          <div style={{ textAlign: "right", width: "100%", maxWidth: "200px" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
              Total: KES {total}
            </h3>
            <button
              onClick={handleCheckout}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                cursor: "pointer",
                width: "100%",
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
