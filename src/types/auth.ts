/**
 * Types pour l'authentification
 */

export interface LoginCredentials {
  username: string; // Email
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  entreprise_name?: string;
  siren?: string;
}

export interface AuthToken {
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  entreprise_id?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
