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
  const [search, setSearch] = useState("");
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

  const filteredPrescriptions = prescriptions.filter((prescription) => {
  const term = search.toLowerCase();
  return (
    prescription._id.toLowerCase().includes(term) ||
    prescription.user?.name?.toLowerCase().includes(term) ||
    prescription.user?.email?.toLowerCase().includes(term) ||
    prescription.status.toLowerCase().includes(term)
  );
});

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
  <div>
    <h2 className="text-3xl font-bold mb-6">📄 All User Prescriptions</h2>

    {/* Search bar */}
    <input
      type="text"
      placeholder="Search prescriptions..."
      className="w-full md:w-1/2 p-3 mb-6 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* Table container */}
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="py-3 px-4 font-semibold text-gray-700">User</th>
            <th className="py-3 px-4 font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 font-semibold text-gray-700">File</th>
            <th className="py-3 px-4 font-semibold text-gray-700">Notes</th>
            <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPrescriptions.map((p) => {
            const statusColor =
              p.status === "approved"
                ? "bg-green-100 text-green-600 border border-green-300"
                : p.status === "rejected"
                ? "bg-red-100 text-red-600 border border-red-300"
                : "bg-yellow-100 text-yellow-700 border border-yellow-300";

            return (
              <tr
                key={p._id}
                className="transition hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="py-3 px-4">{p.user?.name}</td>
                <td className="py-3 px-4">{p.user?.email}</td>

                <td className="py-3 px-4">
                  <a
                    href={`http://localhost:5000${p.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View File
                  </a>
                </td>

                <td className="py-3 px-4 text-gray-600">
                  {p.notes || "No notes"}
                </td>

                {/* Status badge */}
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(p._id, "approved")}
                    disabled={p.status === "approved"}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition 
                      ${
                        p.status === "approved"
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    `}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(p._id, "rejected")}
                    disabled={p.status === "rejected"}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition
                      ${
                        p.status === "rejected"
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }
                    `}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</main>

  );
}
