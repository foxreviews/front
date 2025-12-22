/**
 * Types pour le tracking analytics
 */

import type { UUID, ISODateTime } from './common';

/**
 * Type de page pour le tracking
 */
export type PageType = 
  | 'search_results' 
  | 'profile' 
  | 'home' 
  | 'category' 
  | 'subcategory' 
  | 'city';

/**
 * Requête d'enregistrement de clic
 */
export interface TrackClickRequest {
  entreprise_id: UUID;
  pro_localisation_id?: UUID;
  page_type: PageType;
  position?: number;
  search_query?: string;
}

/**
 * Requête d'enregistrement de vue
 */
export interface TrackViewRequest {
  entreprise_id: UUID;
  pro_localisation_id?: UUID;
  page_type: PageType;
  position?: number;
  search_query?: string;
}

/**
 * Événement de clic
 */
export interface ClickEvent {
  id: UUID;
  entreprise_id: UUID;
  pro_localisation_id?: UUID;
  page_type: PageType;
  position?: number;
  search_query?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: ISODateTime;
}

/**
 * Événement de vue
 */
export interface ViewEvent {
  id: UUID;
  entreprise_id: UUID;
  pro_localisation_id?: UUID;
  page_type: PageType;
  position?: number;
  search_query?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: ISODateTime;
}

/**
 * Statistiques de tracking
 */
export interface TrackingStats {
  entreprise_id: UUID;
  total_clicks: number;
  total_views: number;
  click_through_rate: number;
  period_start: ISODateTime;
  period_end: ISODateTime;
  daily_stats: DailyStats[];
  top_pages: PageStats[];
  top_positions: PositionStats[];
}

/**
 * Statistiques quotidiennes
 */
export interface DailyStats {
  date: string;
  clicks: number;
  views: number;
  ctr: number;
}

/**
 * Statistiques par page
 */
export interface PageStats {
  page_type: PageType;
  clicks: number;
  views: number;
  ctr: number;
}

/**
 * Statistiques par position
 */
export interface PositionStats {
  position: number;
  clicks: number;
  views: number;
  ctr: number;
}

/**
 * Réponse d'enregistrement de tracking
 */
export interface TrackingResponse {
  message: string;
  event_id: UUID;
}
