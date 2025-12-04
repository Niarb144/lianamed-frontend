import axios from "axios";

// Detect if running locally
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Local backend
const LOCAL_API_BASE = "http://localhost:5000/api";
const LOCAL_FILE_BASE = "http://localhost:5000";

// Online backend (Render)
const ONLINE_API_BASE = "https://lianamed-backend.onrender.com/api";

// Automatically switch depending on where the frontend is opened
const API_BASE = isLocal ? LOCAL_API_BASE : ONLINE_API_BASE;

// Export file base if needed
export const FILE_BASE = isLocal ? LOCAL_FILE_BASE : "https://lianamed-backend.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

