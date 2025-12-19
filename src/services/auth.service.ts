import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  LoginCredentials,
  RegisterData,
  AuthToken,
  User,
} from '../types/auth';

/**
 * Classe d'erreur personnalisée pour les erreurs d'authentification
 */
export class AuthError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Service d'authentification
 * Gère la connexion, l'inscription et la gestion du token
 */
class AuthService {
  private readonly TOKEN_KEY = 'fox_reviews_token';
  private readonly USER_KEY = 'fox_reviews_user';

  /**
   * Récupère le token stocké localement
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Stocke le token localement et configure l'axios client
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  }

  /**
   * Supprime le token et les données utilisateur
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  }

  /**
   * Récupère l'utilisateur stocké localement
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Stocke les données utilisateur localement
   */
  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Initialise l'authentification au démarrage de l'app
   */
  initAuth(): void {
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
  }

  /**
   * Connexion utilisateur
   * @throws {AuthError} Si les identifiants sont invalides
   */
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      const { data } = await apiClient.post<AuthToken>('/auth-token/', credentials);
      
      if (!data.token) {
        throw new AuthError('Token non reçu du serveur', 500);
      }

      // Configure le token pour les prochaines requêtes
      this.setToken(data.token);

      // Récupère les informations de l'utilisateur
      const user = await this.getCurrentUser();

      return { token: data.token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string; detail?: string; non_field_errors?: string[] }>;
        const errorMessage = 
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.non_field_errors?.[0] ||
          'Identifiants invalides. Veuillez vérifier votre email et mot de passe.';
        
        throw new AuthError(
          errorMessage,
          axiosError.response?.status,
        );
      }
      throw new AuthError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @throws {AuthError} Si les données sont invalides
   */
  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    try {
      // Validation côté client
      if (data.password !== data.password_confirm) {
        throw new AuthError('Les mots de passe ne correspondent pas', 400);
      }

      if (data.password.length < 8) {
        throw new AuthError('Le mot de passe doit contenir au moins 8 caractères', 400);
      }

      // Appel API d'inscription (à adapter selon votre backend)
      const { data: responseData } = await apiClient.post<AuthToken>('/register/', {
        email: data.email,
        password: data.password,
        entreprise_name: data.entreprise_name,
        siren: data.siren,
      });

      if (!responseData.token) {
        throw new AuthError('Token non reçu du serveur', 500);
      }

      this.setToken(responseData.token);
      const user = await this.getCurrentUser();

      return { token: responseData.token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ 
          error?: string; 
          detail?: string;
          email?: string[];
          password?: string[];
        }>;
        
        const errorData = axiosError.response?.data;
        let errorMessage = 'Une erreur est survenue lors de l\'inscription';

        if (errorData?.email) {
          errorMessage = errorData.email[0];
        } else if (errorData?.password) {
          errorMessage = errorData.password[0];
        } else if (errorData?.error || errorData?.detail) {
          errorMessage = errorData.error || errorData.detail || errorMessage;
        }

        throw new AuthError(
          errorMessage,
          axiosError.response?.status,
          errorData as Record<string, string[]>
        );
      }
      
      if (error instanceof AuthError) {
        throw error;
      }

      throw new AuthError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   * @throws {AuthError} Si l'utilisateur n'est pas authentifié
   */
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await apiClient.get<User>('/users/me/');
      this.setUser(data);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          this.clearToken();
          throw new AuthError('Session expirée. Veuillez vous reconnecter.', 401);
        }
      }
      throw new AuthError('Impossible de récupérer les informations utilisateur');
    }
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    this.clearToken();
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
