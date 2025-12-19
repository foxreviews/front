/**
 * Types pour les catégories
 */
export interface Categorie {
  id: string; // UUID côté backend
  nom: string;
  slug: string;
  description?: string;
}

/**
 * Types pour les sous-catégories
 */
export interface SousCategorie {
  id: string; // UUID côté backend
  nom: string;
  slug: string;
  categorie: string; // UUID de la catégorie
  categorie_slug?: string;
}

/**
 * Types pour les villes
 */
export interface Ville {
  id: string;
  nom: string;
  slug: string;
  code_postal_principal?: string;
  codes_postaux?: string[];
  departement?: string;
  region?: string;
  lat?: number;
  lng?: number;
  population?: number;
  created_at?: string;
  updated_at?: string;
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
