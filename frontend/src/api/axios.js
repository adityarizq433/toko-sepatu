import axios from 'axios';

const api = axios.create({
  // Menggunakan URL dari Vercel saat deploy, atau localhost saat di komputer sendiri
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
