export interface ProLocalisation {
  id: string;
  entreprise_nom: string;
  sous_categorie_nom: string;
  ville_nom: string;
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
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  filters: {
    categorie: string | null;
    sous_categorie: string | null;
    ville: string | null;
  };
}
