/**
 * Types pour l'espace client
 */

export interface Entreprise {
  id: string;
  siren: string;
  siret: string;
  nom: string;
  nom_commercial?: string;
  adresse: string;
  code_postal: string;
  ville_nom: string;
  naf_code?: string;
  naf_libelle?: string;
  telephone?: string;
  email_contact?: string;
  site_web?: string;
  is_active: boolean;
  nb_pro_localisations?: number;
  created_at: string;
  updated_at: string;
}

export interface EntrepriseUpdateData {
  nom_commercial?: string;
  adresse?: string;
  code_postal?: string;
  ville_nom?: string;
  telephone?: string;
  email_contact?: string;
  site_web?: string;
}

export interface Sponsorisation {
  id: string;
  pro_localisation: string;
  date_debut: string;
  date_fin: string;
  is_active: boolean;
  nb_impressions: number;
  nb_clicks: number;
  subscription_id?: string;
  montant_mensuel: number;
  statut_paiement: 'active' | 'past_due' | 'canceled';
  created_at: string;
}

export interface DashboardStatistiques {
  impressions_totales: number;
  clicks_totaux: number;
  taux_clic: number;
  rotation_position: number;
}

export interface Dashboard {
  entreprise: Entreprise;
  sponsorisation: {
    is_active: boolean;
    date_debut: string;
    date_fin: string;
    montant_mensuel: number;
    statut_paiement: 'active' | 'past_due' | 'canceled';
  } | null;
  statistiques: DashboardStatistiques;
  avis_recents: AvisDecrypte[];
}

export interface AvisDecrypte {
  id: string;
  entreprise: string;
  entreprise_nom: string;
  pro_localisation: string;
  texte_brut: string;
  texte_decrypte: string;
  source: 'google' | 'trustpilot' | 'facebook' | 'yelp' | 'custom';
  date_generation: string;
  date_expiration?: string;
  needs_regeneration: boolean;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface UploadAvisRequest {
  texte_avis: string;
}

export interface UploadAvisResponse {
  message: string;
  avis_id: string;
  texte_decrypte: string;
  status: 'success' | 'pending' | 'error';
}

export type AvisStatus = 'pending' | 'validated' | 'rejected';

export interface AvisHistoryItem extends AvisDecrypte {
  status: AvisStatus;
}
