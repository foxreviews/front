/**
 * Types pour les ProLocalisations (triplet Entreprise × Sous-catégorie × Ville)
 */

import type { UUID, ISODateTime, PaginatedResponse } from './common';

/**
 * ProLocalisation - Triplet Entreprise × Sous-catégorie × Ville
 */
export interface ProLocalisation {
  id: UUID;
  entreprise: UUID;
  entreprise_nom: string;
  sous_categorie: UUID;
  sous_categorie_nom: string;
  ville: UUID;
  ville_nom: string;
  note_moyenne: number;
  nb_avis: number;
  score_global: number;
  is_verified: boolean;
  is_active: boolean;
  zone_description?: string;
  texte_long_entreprise?: string;
  meta_description?: string;
  date_derniere_generation_ia?: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/**
 * Filtres pour la liste des ProLocalisations
 */
export interface ProLocalisationFilters {
  entreprise?: UUID;
  sous_categorie?: UUID;
  ville?: UUID;
  is_active?: boolean;
  is_verified?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

/**
 * Réponse paginée pour les ProLocalisations
 */
export type ProLocalisationListResponse = PaginatedResponse<ProLocalisation>;
