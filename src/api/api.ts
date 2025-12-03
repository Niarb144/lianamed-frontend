import axios from 'axios';


// const API_BASE = 'http://localhost:5000/api';
const VITE_FILE_BASE='http://localhost:5000';
const ONLINE_API_BASE = 'https://lianamed-backend.onrender.com/api';


export const api = axios.create({
  baseURL: ONLINE_API_BASE,
  timeout: 10000,
});

export const setAuthToken = (token: string | null) => {
  if(token){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
