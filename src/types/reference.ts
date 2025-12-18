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
  id: string; // UUID ou identifiant string
  nom: string;
  slug: string;
  code_postal?: string;
  departement?: string;
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
