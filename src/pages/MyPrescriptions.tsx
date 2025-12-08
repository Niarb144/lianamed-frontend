import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import UserNav from "../components/UserNav";

interface Prescription {
  _id: string;
  file: string;
  notes: string;
  status: string;
  uploadedAt: string;
}

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view prescriptions.");
      navigate("/login");
      return;
    }

    setAuthToken(token);

    api
      .get("/prescriptions/my")
      .then((res) => {
        const sorted = res.data.sort(
          (a: Prescription, b: Prescription) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        setPrescriptions(sorted);
      })
      .catch((err) => {
        console.error("Error fetching prescriptions:", err);
        alert("Failed to load prescriptions.");
      });
  }, [navigate]);

  return (
    <main>
        <UserNav />

        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <header
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "80px",
            }}
        >
            <h2>🩺 My Prescriptions</h2>
            <button
            onClick={() => navigate("/addPrescription")}
            style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
            }}
            >
            📤 Upload New
            </button>
        </header>

        {prescriptions.length === 0 ? (
            <p style={{ textAlign: "center" }}>No prescriptions uploaded.</p>
        ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
            {prescriptions.map((p) => (
                <li
                key={p._id}
                style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px 20px",
                    marginBottom: "15px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
                >
                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    }}
                >
                    <strong style={{ color: "#007BFF" }}>
                    Prescription #{p._id.slice(-5).toUpperCase()}
                    </strong>
                    <span style={{ fontSize: "0.9em", color: "#555" }}>
                    📅{" "}
                    {new Date(p.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    </span>
                </div>

                <p style={{ margin: "8px 0" }}>
                    📝 <strong>Notes:</strong> {p.notes || "No notes"}
                </p>
                <p style={{ margin: "8px 0" }}>
                    ⚙️ <strong>Status:</strong>{" "}
                    <span
                    style={{
                        color:
                        p.status === "approved"
                            ? "green"
                            : p.status === "pending"
                            ? "orange"
                            : "red",
                        fontWeight: 600,
                    }}
                    >
                    {p.status}
                    </span>
                </p>

                <a
                    href={`http://localhost:5000${p.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                    display: "inline-block",
                    marginTop: "10px",
                    color: "white",
                    background: "#007BFF",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    fontWeight: 500,
                    }}
                >
                    📂 View File
                </a>
                </li>
            ))}
            </ul>
        )}
        </div>
    </main>
  );
}
