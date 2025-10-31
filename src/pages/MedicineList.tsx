import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

interface Medicine {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
}

export default function MedicineList() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setAuthToken(token);

    const fetchMedicines = async () => {
      try {
        const res = await api.get("/medicine");
        setMedicines(res.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching medicines:", err.response?.data || err);
        setError("Unable to fetch medicines.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [navigate]);

  if (loading) return <p>Loading medicines...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <header className="header">
        <h2>Medicine Inventory</h2>
        <button onClick={() => navigate("/add-medicine")} className="btn">
          ➕ Add New
        </button>
      </header>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price (KES)</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {medicines.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                No medicines found
              </td>
            </tr>
          ) : (
            medicines.map((m) => (
              <tr key={m._id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{m.name}</td>
                <td>{m.category || "-"}</td>
                <td>{m.description || "-"}</td>
                <td>{m.price}</td>
                <td>{m.stock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
