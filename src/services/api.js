import axios from "axios";

const API_BASE_URL = "https://v-nement-scientifique.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// تسجيل الدخول
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur de connexion" };
  }
};

// التسجيل
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur d'inscription" };
  }
};