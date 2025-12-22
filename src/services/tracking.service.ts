import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  TrackClickRequest,
  TrackViewRequest,
  TrackingStats,
  TrackingResponse,
} from '../types/tracking';

/**
 * Classe d'erreur personnalisée pour les erreurs de tracking
 */
export class TrackingError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'TrackingError';
    this.statusCode = statusCode;
  }
}

/**
 * Service de tracking analytics
 * Gère l'enregistrement des clics, vues et statistiques
 */
class TrackingService {
  /**
   * Enregistre un clic sur une entreprise
   * Endpoint public - pas besoin d'authentification
   * @throws {TrackingError} Si l'enregistrement échoue
   */
  async trackClick(request: TrackClickRequest): Promise<TrackingResponse> {
    try {
      const { data } = await apiClient.post<TrackingResponse>(
        '/billing/track/click/',
        request
      );
      return data;
    } catch (error) {
      // Ne pas bloquer l'UX si le tracking échoue
      console.error('Erreur lors du tracking du clic:', error);
      throw this.handleError(error, 'Impossible d\'enregistrer le clic');
    }
  }

  /**
   * Enregistre l'affichage d'une entreprise
   * Endpoint public - pas besoin d'authentification
   * @throws {TrackingError} Si l'enregistrement échoue
   */
  async trackView(request: TrackViewRequest): Promise<TrackingResponse> {
    try {
      const { data } = await apiClient.post<TrackingResponse>(
        '/billing/track/view/',
        request
      );
      return data;
    } catch (error) {
      // Ne pas bloquer l'UX si le tracking échoue
      console.error('Erreur lors du tracking de la vue:', error);
      throw this.handleError(error, 'Impossible d\'enregistrer la vue');
    }
  }

  /**
   * Récupère les statistiques de tracking pour une entreprise
   * Nécessite authentification
   * @throws {TrackingError} Si la requête échoue
   */
  async getStats(entrepriseId?: string): Promise<TrackingStats> {
    try {
      const params = entrepriseId ? { entreprise_id: entrepriseId } : {};
      const { data } = await apiClient.get<TrackingStats>(
        '/billing/track/stats/',
        { params }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les statistiques');
    }
  }

  /**
   * Track un clic de manière silencieuse (ne lance pas d'erreur)
   * Utile pour les cas où on ne veut pas interrompre l'UX
   */
  async trackClickSilent(request: TrackClickRequest): Promise<void> {
    try {
      await this.trackClick(request);
    } catch (error) {
      // Silencieux - juste logger
      console.debug('Track click failed silently', error);
    }
  }

  /**
   * Track une vue de manière silencieuse (ne lance pas d'erreur)
   * Utile pour les cas où on ne veut pas interrompre l'UX
   */
  async trackViewSilent(request: TrackViewRequest): Promise<void> {
    try {
      await this.trackView(request);
    } catch (error) {
      // Silencieux - juste logger
      console.debug('Track view failed silently', error);
    }
  }

  /**
   * Calcule le CTR (Click-Through Rate) en pourcentage
   */
  calculateCTR(clicks: number, views: number): number {
    if (views === 0) return 0;
    return (clicks / views) * 100;
  }

  /**
   * Formate le CTR pour l'affichage
   */
  formatCTR(ctr: number): string {
    return `${ctr.toFixed(2)}%`;
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): TrackingError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        error?: string;
        detail?: string;
        message?: string;
      }>;

      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        defaultMessage;

      return new TrackingError(errorMessage, axiosError.response?.status);
    }

    if (error instanceof TrackingError) {
      return error;
    }

    return new TrackingError(defaultMessage);
  }
}

export const trackingService = new TrackingService();
