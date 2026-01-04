import axios from "axios";

// ==========================
// Base Axios instance
// ==========================
const API_BASE_URL = "https://v-nement-scientifique.onrender.com/api"; // include /api if backend requires it

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
// Evaluations API
// ==========================
export const getAssignedEvaluations = async () => {
  const response = await api.get("/evaluations/assigned");
  return response.data;
};
// ==========================
// Axios Interceptor (Add TOKEN)
// ==========================
api.interceptors.request.use((config) => {
  // Skip token for login and register
  if (!config.headers.skipAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ← مصحح: backticks لـ interpolation
    }
  } else {
    // Remove skipAuth from headers
    delete config.headers.skipAuth;
  }
  return config;
});

// ==========================
// Auth API
// ==========================

// LOGIN (skip token)
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/login",
      { email, password },
      { headers: { skipAuth: true } } // <-- skip sending token
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (err) {
    console.error("loginUser error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Login failed" };  // ← message مع quotes (جيد أصلاً، لكن تأكيد)
  }
};

// REGISTER (skip token)
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData, {
      headers: { skipAuth: true },
    });
    return response.data;
  } catch (err) {
    console.error("registerUser error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Registration failed" };
  }
};

// GET profile (needs token)
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// LOGOUT helper
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ==========================
// Proposals API (needs token)
// ==========================
export const getMyProposals = async () => {
  const response = await api.get("/cfp/my-proposals");
  return response.data;
};

export const submitProposal = async (data) => {
  const response = await api.post("/cfp/submit", data);
  return response.data;
};

// ==========================
// Files API
// ==========================
export const getProposalFiles = async (proposalId) => {
  const response = await api.get(`/cfp/${proposalId}/files`);  // ← مصحح: backticks
  return response.data;
};

export const uploadFile = async (proposalId, formData) => {
  const response = await api.post(
    `/cfp/${proposalId}/upload-file`,  // ← مصحح: backticks
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);  // ← مصحح: backticks + إزالة العلامات الزائدة
  return response.data;  // ← إزالة '' الزائدة
};

export const downloadFile = async (fileId) => {
  const response = await api.get(`/files/${fileId}`, { responseType: "blob" });  // ← مصحح: backticks
  return response.data;
};