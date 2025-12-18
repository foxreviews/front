import axios from "axios";
import { API_BASE_URL } from "../config/api";

// Instance Axios configurée
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour les erreurs globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Gestion de l'authentification
      console.error("Non authentifié");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
