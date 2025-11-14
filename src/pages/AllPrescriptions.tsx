import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

interface Prescription {
  _id: string;
  file: string;
  notes: string;
  status: string;
  uploadedAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AllPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const navigate = useNavigate();

  // 🟦 Load prescriptions
  const loadAll = () => {
    api
      .get("/prescriptions/all")
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
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to view prescriptions.");
      navigate("/login");
      return;
    }

    setAuthToken(token);
    loadAll();
  }, [navigate]);

  // 🟢 Approve / Reject handler
  const updateStatus = async (id: string, status: "approved" | "rejected") => {
  try {
    await api.put(`/prescriptions/status/${id}`, { status });
    alert("Status updated!");

    setPrescriptions((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
  } catch {
    alert("Failed to update.");
  }
};

  // 🎨 Badge styling
  const badgeStyle = (status: string) => {
    switch (status) {
      case "approved":
        return { color: "white", background: "green", padding: "4px 8px", borderRadius: "6px" };
      case "rejected":
        return { color: "white", background: "red", padding: "4px 8px", borderRadius: "6px" };
      default:
        return { color: "white", background: "gray", padding: "4px 8px", borderRadius: "6px" };
    }
  };

  return (
    <main>
      <div style={{ padding: "20px" }}>
        <h2>All User Prescriptions</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>File</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Actions</th> {/* NEW COLUMN */}
            </tr>
          </thead>

          <tbody>
            {prescriptions.map((p) => (
              <tr key={p._id}>
                <td>{p.user?.name}</td>
                <td>{p.user?.email}</td>

                <td>
                  <a href={`http://localhost:5000${p.file}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>

                <td>{p.notes || "No notes"}</td>

                {/* Status badge */}
                <td>
                  <strong>{p.status}</strong>
                </td>

                {/* Approve / Reject buttons */}
                <td>
                  <button
                    onClick={() => updateStatus(p._id, "approved")}
                    disabled={p.status === "approved"}
                    style={{ background: "green", color: "white", marginRight: "5px" }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(p._id, "rejected")}
                    disabled={p.status === "rejected"}
                    style={{ background: "red", color: "white" }}
                  >
                    Reject
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
