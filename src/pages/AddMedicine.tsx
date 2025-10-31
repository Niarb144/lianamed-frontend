import React, { useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddMedicine() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");
    setAuthToken(token);

    try {
      await api.post("/medicines/add", {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      alert("✅ Medicine added successfully!");
      navigate("/admin-dashboard");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add medicine");
    }
  };

  return (
    <div className="container">
      <h2>Add New Medicine</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="input"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="input"
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="btn">Add Medicine</button>
      </form>
    </div>
  );
}
