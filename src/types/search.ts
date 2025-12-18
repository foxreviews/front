export interface ProLocalisation {
  id: string;
  // Ancien format
  entreprise_nom?: string;
  sous_categorie_nom?: string;
  ville_nom?: string;
  // Nouveau format API
  nom?: string;
  slug?: string;
  ville?: string;
  categorie?: string;
  sous_categorie?: string;
  avis_redaction?: string;
  is_sponsored?: boolean;
  note_moyenne: number;
  nb_avis: number;
  score_global: number;
  is_verified: boolean;
}

export interface SearchFilters {
  categorie?: string;
  sous_categorie?: string;
  ville?: string;
  page?: number;
}

export interface SearchResponse {
  sponsored: ProLocalisation[];
  organic: ProLocalisation[];
  // Champs normalisés pour le front
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  filters: {
    categorie: string | null;
    sous_categorie: string | null;
    ville: string | null;
  };
  // Métadonnées brutes éventuelles renvoyées par l'API
  meta?: {
    total_results: number;
    sponsored_count: number;
    organic_count: number;
    page: number;
    page_size: number;
    max_organic_per_page: number;
    max_sponsored_per_page: number;
    has_next: boolean;
    rotation_active: boolean;
    rotation_type: string;
    pool_size: number;
    sponsoring_active: boolean;
  };
}
