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

export default function AllPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
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
    }, [navigate]);

  return (
    <main>
        <UserNav />
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
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p: any) => (
            <tr key={p._id}>
              <td>{p.user?.name}</td>
              <td>{p.user?.email}</td>
              <td>
                <a href={`http://localhost:5000${p.file}`} target="_blank">
                  View
                </a>
              </td>
              <td>{p.notes}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </main>
  );
}
