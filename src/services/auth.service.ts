import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  LoginCredentials,
  RegisterData,
  AuthToken,
  User,
  AccountData,
  AccountUpdateData,
  PasswordResetRequest,
  PasswordResetResponse,
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
      const { data } = await apiClient.post<AuthToken>('auth/login/', credentials);
      
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

      // Règle backend: un client DOIT être lié à une entreprise existante
      // Au moins un des 3 champs doit être fourni: entreprise_id, siren, siret
      const hasEntrepriseLink = Boolean(
        (data.entreprise_id && data.entreprise_id.trim()) ||
          (data.siren && data.siren.trim()) ||
          (data.siret && data.siret.trim())
      );

      if (!hasEntrepriseLink) {
        throw new AuthError(
          'Veuillez fournir un SIREN/SIRET (ou un identifiant entreprise) pour lier votre compte.',
          400
        );
      }

      // Appel API d'inscription
      const { data: responseData } = await apiClient.post<AuthToken>('auth/register/', {
        email: data.email,
        password: data.password,
        ...(data.name ? { name: data.name } : {}),
        ...(data.entreprise_id ? { entreprise_id: data.entreprise_id } : {}),
        ...(data.siren ? { siren: data.siren } : {}),
        ...(data.siret ? { siret: data.siret } : {}),
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
          siren?: string[];
          siret?: string[];
          non_field_errors?: string[];
        }>;
        
        const errorData = axiosError.response?.data;
        let errorMessage = 'Une erreur est survenue lors de l\'inscription';

        if (errorData?.email) {
          errorMessage = errorData.email[0];
        } else if (errorData?.password) {
          errorMessage = errorData.password[0];
        } else if (errorData?.siren) {
          errorMessage = errorData.siren[0];
        } else if (errorData?.siret) {
          errorMessage = errorData.siret[0];
        } else if (errorData?.non_field_errors?.[0]) {
          errorMessage = errorData.non_field_errors[0];
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
      const accountData = await this.getAccount();
      
      // Convertir AccountData en User
      const user: User = {
        id: accountData.id,
        email: accountData.email,
        name: accountData.name,
        is_active: accountData.is_active ?? true,
        role: accountData.role,
        phone: accountData.phone,
        entreprise_id: accountData.entreprise_id,
        created_at: accountData.created_at,
        updated_at: accountData.updated_at,
      };
      
      this.setUser(user);
      return user;
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

  /**
   * Demande de réinitialisation du mot de passe
   * Envoie un email avec un lien de réinitialisation
   * @throws {AuthError} Si l'email est invalide
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetResponse> {
    try {
      const { data } = await apiClient.post<PasswordResetResponse>(
        'auth/password-reset/',
        request
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ 
          error?: string; 
          detail?: string;
          email?: string[];
        }>;
        
        const errorData = axiosError.response?.data;
        let errorMessage = 'Une erreur est survenue lors de la demande de réinitialisation';

        if (errorData?.email) {
          errorMessage = errorData.email[0];
        } else if (errorData?.error || errorData?.detail) {
          errorMessage = errorData.error || errorData.detail || errorMessage;
        }

        throw new AuthError(
          errorMessage,
          axiosError.response?.status,
        );
      }
      
      throw new AuthError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Récupère les informations du compte utilisateur connecté
   * @throws {AuthError} Si l'utilisateur n'est pas authentifié
   */
  async getAccount(): Promise<AccountData> {
    try {
      type AccountApiResponse = Partial<AccountData> & {
        id: string | number;
        email: string;
        name?: string;
        role?: AccountData['role'];
      };

      const normalize = (data: any): AccountData => {
        // Normalisation: certains backends renvoient `entreprise_id`, d'autres un objet `entreprise`
        const entrepriseId = data.entreprise?.id ?? data.entreprise_id;
        const entrepriseNom = data.entreprise?.nom ?? data.entreprise_nom;

        return {
          id: data.id,
          email: data.email,
          name: data.name ?? '',
          role: (data.role ?? 'CLIENT') as AccountData['role'],
          is_active: data.is_active,
          phone: data.phone,
          entreprise_id: entrepriseId,
          entreprise_nom: entrepriseNom,
          entreprise: data.entreprise,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      };

      // Try the most common "me" endpoints in order.
      const candidates = ['auth/account/', 'me/', 'account/me/', 'auth/me/'];
      let lastError: unknown;

      for (const url of candidates) {
        try {
          const { data } = await apiClient.get<AccountApiResponse>(url);
          return normalize(data);
        } catch (error: any) {
          lastError = error;
          if (error?.response?.status === 404) continue;
          throw error;
        }
      }

      throw lastError;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          this.clearToken();
          throw new AuthError('Session expirée. Veuillez vous reconnecter.', 401);
        }
      }
      throw new AuthError('Impossible de récupérer les informations du compte');
    }
  }

  /**
   * Met à jour les informations du compte utilisateur
   * @throws {AuthError} Si la mise à jour échoue
   */
  async updateAccount(updateData: AccountUpdateData): Promise<AccountData> {
    try {
      const { data } = await apiClient.put<AccountData>(
        'account/update/',
        updateData
      );
      
      // Mettre à jour l'utilisateur en cache si nécessaire
      const currentUser = this.getUser();
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          name: data.name,
          phone: data.phone,
        };
        this.setUser(updatedUser);
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ 
          error?: string; 
          detail?: string;
          name?: string[];
          phone?: string[];
        }>;
        
        const errorData = axiosError.response?.data;
        let errorMessage = 'Une erreur est survenue lors de la mise à jour';

        if (errorData?.name) {
          errorMessage = errorData.name[0];
        } else if (errorData?.phone) {
          errorMessage = errorData.phone[0];
        } else if (errorData?.error || errorData?.detail) {
          errorMessage = errorData.error || errorData.detail || errorMessage;
        }

        throw new AuthError(
          errorMessage,
          axiosError.response?.status,
          errorData as Record<string, string[]>
        );
      }
      
      throw new AuthError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }
}

export const authService = new AuthService();
