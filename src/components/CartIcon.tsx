import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";

export default function CartIcon() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => navigate("/cart")}
    >
      <span style={{ fontSize: "24px" }}>
        <CiShoppingCart />
      </span>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-8px",
            background: "red",
            color: "white",
            fontSize: "12px",
            borderRadius: "50%",
            padding: "2px 6px",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
