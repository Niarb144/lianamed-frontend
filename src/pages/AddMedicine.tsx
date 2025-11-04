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
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={{ width: "120px", borderRadius: "6px" }}
            />
          </div>
        )}
        <button type="submit" className="btn">Add Medicine</button>
      </form>
    </div>
  );
}
