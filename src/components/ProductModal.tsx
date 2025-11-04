import React from "react";
import { CartItem, useCart } from "../context/CartContext";

interface ProductModalProps {
  product: CartItem | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "400px",
          width: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        <img
          src={
            product.image
              ? `${(import.meta as any).env.VITE_API_BASE}${product.image}`
              : "https://via.placeholder.com/250x180?text=No+Image"
          }
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: "8px",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
        <h3>{product.name}</h3>
        <p style={{ color: "#555" }}>{(product as any).description || ""}</p>
        <p>
          <strong>KES {product.price}</strong>
        </p>
        <button
          onClick={() => {
            addToCart(product);
            onClose();
          }}
          style={{
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
