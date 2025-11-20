import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface Medicine {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

export default function Products() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  const openDetails = (id: string) => navigate(`/product/${id}`);

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="🔍 Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border w-80 px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <p>No medicines available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border"
            >
              {/* Clickable image */}
              <div
                className="cursor-pointer"
                onClick={() => openDetails(m._id)}
              >
                <img
                  src={
                    m.image
                      ? `http://localhost:5000${m.image}`
                      : "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={m.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {m.name}
                </h3>

                <p className="text-blue-600 font-bold text-xl text-center mt-1">
                  KES {m.price}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => addToCart(m)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-all"
                  >
                    🛒 Add
                  </button>

                  <button
                    onClick={() => openDetails(m._id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl transition-all"
                  >
                    👁 View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
