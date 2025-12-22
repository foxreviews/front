/**
 * Types pour l'authentification
 */

import type { UserRole } from './common';

export interface LoginCredentials {
  username: string; // Email
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
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
  role?: UserRole;
  phone?: string;
  entreprise_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Données du compte utilisateur
 */
export interface AccountData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  entreprise_id?: string;
  entreprise_nom?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Données pour mettre à jour le compte
 */
export interface AccountUpdateData {
  name?: string;
  phone?: string;
}

/**
 * Requête de réinitialisation de mot de passe
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Réponse de réinitialisation de mot de passe
 */
export interface PasswordResetResponse {
  message: string;
}
