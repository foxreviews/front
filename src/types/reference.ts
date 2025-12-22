/**
 * Types pour les catégories
 */
import type { UUID, ISODateTime } from './common';

export interface Categorie {
  id: UUID;
  nom: string;
  slug: string;
  description?: string;
  ordre?: number;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
}

/**
 * Catégorie avec ses sous-catégories
 */
export interface CategorieDetail extends Categorie {
  nb_sous_categories: number;
  sous_categories: SousCategorie[];
}

/**
 * Types pour les sous-catégories
 */
export interface SousCategorie {
  id: UUID;
  nom: string;
  slug: string;
  description?: string;
  categorie: UUID;
  categorie_slug?: string;
  ordre?: number;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
}

/**
 * Type pour l'autocomplete de sous-catégories
 */
export interface SousCategorieAutocompleteItem {
  id: UUID;
  nom: string;
  slug: string;
  categorie: UUID;
  categorie_nom: string;
}

/**
 * Paramètres pour l'autocomplete de sous-catégories
 */
export interface SousCategorieAutocompleteParams {
  q: string;
  categorie?: UUID;
  limit?: number;
}

/**
 * Types pour les villes
 */
export interface Ville {
  id: UUID;
  nom: string;
  slug: string;
  code_postal: string;
  code_insee?: string;
  departement?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
}

/**
 * Réponse paginée générique (pour rétro-compatibilité)
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Type pour l'autocomplete de villes (format optimisé)
 */
export interface VilleAutocompleteItem {
  id: UUID;
  nom: string;
  code_postal_principal: string;
  departement: string;
  slug: string;
}

/**
 * Paramètres pour l'autocomplete de villes
 */
export interface VilleAutocompleteParams {
  q?: string;
  code_postal?: string;
  region?: string;
  departement?: string;
  limit?: number;
}

/**
 * Réponse d'autocomplete de villes
 */
export interface VilleAutocompleteResponse {
  results: VilleAutocompleteItem[];
}

/**
 * Paramètres pour lookup de ville
 */
export interface VilleLookupParams {
  id?: UUID;
  slug?: string;
}

/**
 * Statistiques des villes
 */
export interface VilleStats {
  total_villes: number;
  total_departements: number;
  total_regions: number;
  population_totale: number | null;
  population_moyenne: number | null;
}
