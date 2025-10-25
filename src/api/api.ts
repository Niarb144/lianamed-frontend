import axios from 'axios';

// const API_BASE = 'http://192.168.0.152:5000/api';
const API_BASE = 'https://lianamed-backend.onrender.com/api';


export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const setAuthToken = (token: string | null) => {
  if(token){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
