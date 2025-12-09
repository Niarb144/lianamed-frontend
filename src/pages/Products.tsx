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
  category: string;
}

export default function Products() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("none");
  const [category, setCategory] = useState("all");

  const categories = ["all", ...new Set(medicines.map(m => m.category))];


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

  let filtered = medicines.filter((m) =>
  m.name.toLowerCase().includes(search.toLowerCase())
  );

  if (category !== "all") {
    filtered = filtered.filter((m) => m.category === category);
  }

  if (sortType === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortType === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortType === "az") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "za") {
    filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
  }


  const openDetails = (id: string) => navigate(`/product/${id}`);

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto my-8">

      <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="md:w-50 mb-2 md:mb-0">
          <img src="/images/lianamed-logo.png" className="w-auto h-auto" alt="Lianamed" />
        </div>
        {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border w-80 px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">

        {/* Category Filter */}
        <select
          className="border px-4 py-2 rounded-xl"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          className="border px-4 py-2 rounded-xl"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="none">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="az">Name: A → Z</option>
          <option value="za">Name: Z → A</option>
        </select>

      </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <p>No medicines available.</p>
      ) : (
        <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
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
                      ? `https://lianamed-backend.onrender.com${m.image}`
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
