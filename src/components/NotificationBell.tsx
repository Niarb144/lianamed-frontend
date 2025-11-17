import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";
import { RiUserSettingsLine, RiNotification4Line } from "react-icons/ri";

export default function NavBar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.get("/notifications")
      .then((res) => {
        const unread = res.data.filter((n: any) => !n.read).length;
        setCount(unread);
      });
  }, []);

  return (
    <nav>
      <Link to="/notifications" style={{ position: "relative" }}>
        <RiNotification4Line size={24} />
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -10,
              background: "red",
              color: "white",
              padding: "2px 6px",
              borderRadius: "50%",
              fontSize: "12px",
            }}
          >
            {count}
          </span>
        )}
      </Link>
    </nav>
  );
}
