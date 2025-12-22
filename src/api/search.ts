import axios, { AxiosError } from "axios";
import { API_BASE_URL, API_TIMEOUT, API_RETRY_COUNT, API_RETRY_DELAY, TOKEN_STORAGE_KEY } from "../config/api";

/**
 * Instance Axios configurée pour l'API FOX-Reviews
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Compteur de tentatives de retry par requête
 */
const retryCountMap = new Map<string, number>();

/**
 * Intercepteur de requête - Ajoute automatiquement le token d'authentification
 */
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    // Ajouter le token à l'en-tête Authorization si disponible
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse - Gestion des erreurs et retry automatique
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as typeof error.config & { _retry?: boolean };
    
    if (!config) {
      return Promise.reject(error);
    }

    // Gestion des erreurs 401 (Non authentifié)
    if (error.response?.status === 401) {
      // Nettoyer le token et rediriger vers la page de connexion
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem('fox_reviews_user');
      
      // Éviter la redirection si on est déjà sur la page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Gestion des erreurs 403 (Accès refusé)
    if (error.response?.status === 403) {
      console.error('Accès refusé - Permissions insuffisantes');
      return Promise.reject(error);
    }

    // Retry automatique pour les erreurs réseau et 5xx
    const shouldRetry = (
      !error.response || // Erreur réseau
      error.response.status >= 500 || // Erreur serveur
      error.code === 'ECONNABORTED' // Timeout
    );

    if (shouldRetry && !config._retry) {
      const requestKey = `${config.method}-${config.url}`;
      const retryCount = retryCountMap.get(requestKey) || 0;

      if (retryCount < API_RETRY_COUNT) {
        config._retry = true;
        retryCountMap.set(requestKey, retryCount + 1);

        // Attendre avant de retry avec backoff exponentiel
        const delay = API_RETRY_DELAY * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`Retry ${retryCount + 1}/${API_RETRY_COUNT} pour ${requestKey}`);
        
        return apiClient(config);
      } else {
        // Nettoyer le compteur après toutes les tentatives
        retryCountMap.delete(requestKey);
      }
    }

    // Nettoyer le compteur si la requête réussit après retry
    if (config.url) {
      const requestKey = `${config.method}-${config.url}`;
      retryCountMap.delete(requestKey);
    }

    return Promise.reject(error);
  }
);

/**
 * Configure le token d'authentification pour toutes les futures requêtes
 * @param token - Token d'authentification
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Récupère le token d'authentification actuel
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export default apiClient;
