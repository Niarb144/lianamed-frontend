import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import ProductModal from "../components/ProductModal";
import CartIcon from "../components/CartIcon";
import { useCart } from "../context/CartContext";

interface Medicine {
  _id: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

export default function Products() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Medicine | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/medicines");
        setMedicines(res.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    };
    fetchData();
  }, []);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>💊 Medicine Store</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
          <CartIcon />
        </div>
      </header>

      {filtered.length === 0 ? (
        <p>No medicines available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filtered.map((m) => (
            <div
              key={m._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "12px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  overflow: "hidden",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={
                    m.image
                      ? `${import.meta.env.VITE_API_BASE}${m.image}`
                      : "https://via.placeholder.com/200x150?text=No+Image"
                  }
                  alt={m.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3>{m.name}</h3>
              <p>{m.description || "No description"}</p>
              <p>
                <strong>KES {m.price}</strong>
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => addToCart(m)}
                  style={{
                    flex: 1,
                    background: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  🛒 Add
                </button>
                <button
                  onClick={() => setSelected(m)}
                  style={{
                    flex: 1,
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  👁 View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
