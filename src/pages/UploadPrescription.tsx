import React, { useState } from "react";
import { api } from "../api/api";

export default function UploadPrescription() {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a prescription file");

    const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to upload a prescription");
    return;
  }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("notes", notes);

    try {
      const res = await api.post("/prescriptions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
         },
      });
      alert("✅ Uploaded successfully!");
      console.log(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload prescription");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Prescription</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginBottom: "10px", display: "block" }}
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        />
        <button type="submit" className="btn">
          Upload
        </button>
      </form>
    </div>
  );
}
