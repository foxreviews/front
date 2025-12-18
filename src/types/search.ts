export interface EntrepriseDetails {
  id: string;
  siren: string;
  siret: string;
  nom: string;
  nom_commercial: string;
  adresse: string;
  code_postal: string;
  ville_nom: string;
  naf_code: string;
  naf_libelle: string;
  telephone: string;
  email_contact: string;
  site_web: string;
  is_active: boolean;
  nb_pro_localisations: number;
  created_at: string;
  updated_at: string;
}

export interface SousCategorieDetails {
  id: string;
  categorie: string;
  categorie_nom: string;
  nom: string;
  slug: string;
  ordre: number;
  created_at: string;
  updated_at: string;
  description: string;
  mots_cles: string;
}

export interface VilleDetails {
  id: string;
  nom: string;
  slug: string;
  code_postal_principal: string;
  codes_postaux: string[];
  departement: string;
  region: string;
  lat: number;
  lng: number;
  population: number;
  created_at: string;
  updated_at: string;
}

export interface ProLocalisation {
  id: string;
  // Ancien / format liste
  entreprise_nom?: string;
  sous_categorie_nom?: string;
  ville_nom?: string;
  // Nouveau format API (liste)
  nom?: string;
  slug?: string;
  ville?: string;
  categorie?: string;
  sous_categorie?: string;
  avis_redaction?: string;
  is_sponsored?: boolean;
  // Détails enrichis (endpoint de détail)
  entreprise?: EntrepriseDetails;
  sous_categorie_detail?: SousCategorieDetails;
  ville_detail?: VilleDetails;
  zone_description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Scores
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
