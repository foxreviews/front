/**
 * Types pour l'espace client
 */

import type { UUID, ISODateTime, AvisSource, StripePaymentStatus } from './common';

export interface Entreprise {
  id: UUID;
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
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface EntrepriseCreateData {
  siren: string;
  siret?: string;
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
  is_active?: boolean;
}

export interface EntrepriseUpdateData {
  nom_commercial?: string;
  adresse?: string;
  code_postal?: string;
  ville_nom?: string;
  telephone?: string;
  email_contact?: string;
  site_web?: string;
  is_active?: boolean;
}

export interface Sponsorisation {
  id: UUID;
  pro_localisation: UUID;
  date_debut: ISODateTime;
  date_fin: ISODateTime;
  is_active: boolean;
  nb_impressions: number;
  nb_clicks: number;
  subscription_id?: string;
  montant_mensuel: number;
  statut_paiement: StripePaymentStatus;
  created_at: ISODateTime;
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
    date_debut: ISODateTime;
    date_fin: ISODateTime;
    montant_mensuel: number;
    statut_paiement: StripePaymentStatus;
  } | null;
  statistiques: DashboardStatistiques;
  avis_recents: AvisDecrypte[];
}

export interface AvisDecrypte {
  id: UUID;
  entreprise: UUID;
  entreprise_nom: string;
  pro_localisation: UUID;
  texte_brut: string;
  texte_decrypte: string;
  source: AvisSource;
  date_generation: ISODateTime;
  date_expiration?: ISODateTime;
  needs_regeneration: boolean;
  confidence_score: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface UploadAvisRequest {
  texte_avis: string;
}

export interface UploadAvisResponse {
  message: string;
  avis_id: UUID;
  texte_decrypte: string;
  status: 'success' | 'pending' | 'error';
}

/**
 * Filtres pour la liste des avis
 */
export interface AvisFilters {
  entreprise?: UUID;
  pro_localisation?: UUID;
  source?: AvisSource;
  needs_regeneration?: boolean;
  page?: number;
  page_size?: number;
}

export type AvisStatus = 'pending' | 'validated' | 'rejected';

export interface AvisHistoryItem extends AvisDecrypte {
  status: AvisStatus;
}
