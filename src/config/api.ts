/**
 * Configuration de l'API
 */

/**
 * URL de base de l'API
 * En développement, utilise le proxy Vite ('/api' sera redirigé vers le backend)
 * En production, utilise la variable d'environnement VITE_API_URL
 */
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL ?? 
  (import.meta.env.DEV ? '/api' : 'http://135.125.74.206:8003/api');

/**
 * Timeout par défaut pour les requêtes API (en millisecondes)
 */
export const API_TIMEOUT = 30000; // 30 secondes

/**
 * Nombre de tentatives de retry pour les requêtes échouées
 */
export const API_RETRY_COUNT = 3;

/**
 * Délai entre les tentatives de retry (en millisecondes)
 */
export const API_RETRY_DELAY = 1000;

/**
 * Clé de stockage du token d'authentification
 */
export const TOKEN_STORAGE_KEY = 'fox_reviews_token';

/**
 * Clé de stockage de l'utilisateur
 */
export const USER_STORAGE_KEY = 'fox_reviews_user';