import axios from 'axios';

// 1. กำหนด Base URL ไปที่ Port 5000 ของคุณ
const API_URL = "http://localhost:5000";

// 2. สร้าง Instance ของ Axios เพื่อความสะดวกในการตั้งค่า Header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 3. Middleware ฝั่ง Frontend: แนบ Token ไปกับทุก Request อัตโนมัติ (Module 7)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ==========================
   API Services
   ========================== */

// --- Auth Service ---
export const login = async (credentials) => {
  // ส่งไปที่ POST /auth/login
  const response = await api.post('/auth/login', credentials);
  return response.data; 
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// --- Product Service ---
export const getProducts = async () => {
  // ส่งไปที่ GET /products
  const response = await api.get('/products');
  return response.data;
};

// --- Order Service ---
export const createOrder = async (orderData) => {
  // ส่งไปที่ POST /orders
  const response = await api.post('/orders', orderData);
  return response.data;
};

export default api;