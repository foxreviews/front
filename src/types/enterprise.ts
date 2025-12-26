/**
 * Types pour la recherche d'entreprises (INSEE import)
 */

export interface EnterpriseSearchResult {
  id: string;
  siren: string;
  siret: string;
  nom: string;
  nom_commercial: string | null;
  adresse: string;
  code_postal: string;
  ville_nom: string;
  naf_code: string;
}

export interface EnterpriseSearchResponse {
  results: EnterpriseSearchResult[];
  count: number;
}

export interface EnterpriseSearchParams {
  q: string;
  code_postal?: string;
}
