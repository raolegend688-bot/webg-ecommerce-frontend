import axios from "axios";

const API = axios.create({ baseURL: "https://webg-ecommerce-backend.onrender.com/api" });

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("webg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Store ──────────────────────────────────────────────────────
export const getStore = (slug) => API.get(`/store/${slug}`);
export const createStore = (data) => API.post("/store", data);
export const updateStore = (id, data) => API.put(`/store/${id}`, data);

// ── Products ──────────────────────────────────────────────────
export const getProducts = (params) => API.get("/products", { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ── Orders ────────────────────────────────────────────────────
export const placeOrder = (data) => API.post("/orders", data);
export const getOrders = (params) => API.get("/orders", { params });
export const getOrder = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, orderStatus) =>
  API.put(`/orders/${id}/status`, { orderStatus });

// ── Payment ───────────────────────────────────────────────────
export const createRazorpayOrder = (data) => API.post("/payment/create-order", data);
export const verifyPayment = (data) => API.post("/payment/verify", data);

// ── Auth ──────────────────────────────────────────────────────
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
