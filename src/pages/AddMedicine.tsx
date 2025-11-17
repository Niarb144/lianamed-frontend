import React, { useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";

export default function AddMedicine() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append("image", image);

      await api.post("/medicines/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Medicine added successfully!");
      navigate("/admin-dashboard");
    } catch (err: any) {
      console.error("Add medicine error:", err);
      alert(err.response?.data?.message || "Failed to add medicine");
    }
  };

  return (
    <main>
      
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-4 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Medicine Name</label>
            <input
              name="name"
              placeholder="Enter medicine name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <input
              name="category"
              placeholder="e.g Painkiller"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Short description about the medicine"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Price (KES)</label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Medicine Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full cursor-pointer bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
            />

            {image && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Add Medicine
          </button>
        </form>
      </div>


    </main>
  );
}
