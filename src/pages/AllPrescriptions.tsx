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
  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/prescriptions/status/${id}`, { status });
      loadAll(); // refresh UI
    } catch (err: any) {
      console.error(err);
      alert("Failed to update status.");
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
                  <span style={badgeStyle(p.status)}>{p.status}</span>
                </td>

                {/* Approve / Reject buttons */}
                <td>
                  <button
                    onClick={() => updateStatus(p._id, "approved")}
                    style={{ background: "green", color: "white", marginRight: "5px" }}
                    disabled={p.status === "approved"}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(p._id, "rejected")}
                    style={{ background: "red", color: "white" }}
                    disabled={p.status === "rejected"}
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
