import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type { Sponsorisation } from '../types/client';
import type { PaginatedResponse, StripePaymentStatus } from '../types/common';

/**
 * Filtres pour la liste des sponsorisations
 */
export interface SponsorisationFilters {
  is_active?: boolean;
  statut_paiement?: StripePaymentStatus;
  page?: number;
  page_size?: number;
}

/**
 * Réponse paginée pour les sponsorisations
 */
export type SponsorisationListResponse = PaginatedResponse<Sponsorisation>;

/**
 * Classe d'erreur personnalisée pour les erreurs de sponsorisation
 */
export class SponsorisationError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'SponsorisationError';
    this.statusCode = statusCode;
  }
}

/**
 * Service de gestion des sponsorisations
 * Gère les sponsors et leur affichage rotatif
 */
class SponsorisationService {
  /**
   * Récupère la liste des sponsorisations avec filtres
   * @throws {SponsorisationError} Si la requête échoue
   */
  async getSponsorisations(
    filters: SponsorisationFilters = {}
  ): Promise<SponsorisationListResponse> {
    try {
      const { data } = await apiClient.get<SponsorisationListResponse>(
        '/sponsorisations/',
        { params: filters }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les sponsorisations');
    }
  }

  /**
   * Récupère uniquement les sponsorisations actives
   * @throws {SponsorisationError} Si la requête échoue
   */
  async getActiveSponsorisations(): Promise<Sponsorisation[]> {
    try {
      const response = await this.getSponsorisations({ 
        is_active: true,
        page_size: 100 
      });
      return response.results;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les sponsorisations actives');
    }
  }

  /**
   * Récupère les détails d'une sponsorisation
   * @throws {SponsorisationError} Si la sponsorisation n'existe pas
   */
  async getSponsorisation(id: string): Promise<Sponsorisation> {
    try {
      const { data } = await apiClient.get<Sponsorisation>(
        `/sponsorisations/${id}/`
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger la sponsorisation');
    }
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): SponsorisationError {
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

      return new SponsorisationError(errorMessage, axiosError.response?.status);
    }

    if (error instanceof SponsorisationError) {
      return error;
    }

    return new SponsorisationError(defaultMessage);
  }
}

export const sponsorisationService = new SponsorisationService();
