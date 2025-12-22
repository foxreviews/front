/**
 * Types communs réutilisables à travers l'application
 */

/**
 * Erreur API standard
 */
export interface ApiError {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Erreur de validation avec champs spécifiques
 */
export interface ValidationError {
  [field: string]: string[];
}

/**
 * Réponse paginée générique
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * Métadonnées de pagination pour les réponses
 */
export interface PaginationMeta {
  total_results: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

/**
 * Statuts de paiement Stripe
 */
export type StripePaymentStatus = 
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'incomplete' 
  | 'incomplete_expired' 
  | 'trialing' 
  | 'unpaid';

/**
 * Statuts de facture Stripe
 */
export type StripeInvoiceStatus = 
  | 'draft' 
  | 'open' 
  | 'paid' 
  | 'void' 
  | 'uncollectible';

/**
 * Sources d'avis possibles
 */
export type AvisSource = 
  | 'google' 
  | 'trustpilot' 
  | 'facebook' 
  | 'yelp' 
  | 'custom';

/**
 * Rôles utilisateur
 */
export type UserRole = 
  | 'CLIENT' 
  | 'MANAGER' 
  | 'ADMIN' 
  | 'VISITEUR';

/**
 * Statut générique
 */
export type Status = 
  | 'success' 
  | 'pending' 
  | 'error' 
  | 'warning';

/**
 * Type pour les UUID
 */
export type UUID = string;

/**
 * Type pour les timestamps ISO
 */
export type ISODateTime = string;

/**
 * Type pour les slugs
 */
export type Slug = string;

/**
 * Réponse générique de l'API
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status: Status;
  errors?: ValidationError;
}

/**
 * Options de tri
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filtres de recherche génériques
 */
export interface SearchFilters extends PaginationParams {
  search?: string;
  ordering?: string;
  [key: string]: unknown;
}
