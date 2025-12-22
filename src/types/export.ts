/**
 * Types pour les exports de données
 */

/**
 * Format d'export disponible
 */
export type ExportFormat = 'csv' | 'json';

/**
 * Paramètres pour l'export des entreprises
 */
export interface ExportEntreprisesParams {
  /** Filtrer par ville */
  ville?: string;
  /** Filtrer par sous-catégorie */
  sous_categorie?: string;
  /** Filtrer par catégorie */
  categorie?: string;
  /** Filtrer par statut d'activation */
  is_active?: boolean;
}

/**
 * Paramètres pour l'export des avis
 */
export interface ExportAvisParams {
  /** Filtrer par entreprise */
  entreprise_id?: string;
  /** Filtrer par ville */
  ville?: string;
  /** Filtrer par catégorie */
  categorie?: string;
}

/**
 * Paramètres pour l'export WordPress
 */
export interface ExportWordPressParams {
  /** Filtrer par ville */
  ville?: string;
  /** Filtrer par catégorie */
  categorie?: string;
}
