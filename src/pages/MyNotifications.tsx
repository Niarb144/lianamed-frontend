import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";
import UserNav from "../components/UserNav";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MyNotifications() {
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    api.get("/notifications")
      .then((res) => setList(res.data))
      .catch(() => alert("Failed to load notifications"));
  }, []);

  const markAsRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    setList((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <main>
      <UserNav />
    <div style={{ padding: "20px"}}>
      <h2>Notifications</h2>

      {list.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "80px" }}>
          {list.map((n) => (
            <li
              key={n._id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                background: n.read ? "#f1f1f1" : "#dff5ff",
                borderRadius: "5px",
              }}
            >
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n._id)}
                  style={{
                    marginLeft: "10px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Mark Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </main>
  );
}
