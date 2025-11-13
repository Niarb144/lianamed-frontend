import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AllPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get("/prescriptions/all")
      .then((res) => setPrescriptions(res.data))
      .catch(() => alert("Failed to load prescriptions"));
  }, []);

  return (
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
  );
}
