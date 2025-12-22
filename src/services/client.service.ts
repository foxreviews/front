import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  Dashboard,
  Entreprise,
  EntrepriseCreateData,
  EntrepriseUpdateData,
  AvisDecrypte,
  AvisFilters,
  UploadAvisRequest,
  UploadAvisResponse,
  Sponsorisation,
} from '../types/client';
import type { PaginatedResponse } from '../types/common';

/**
 * Classe d'erreur personnalisée pour les erreurs client
 */
export class ClientError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Service pour l'espace client
 * Gère le dashboard, les entreprises et les avis
 */
class ClientService {
  /**
   * Récupère les données du dashboard
   * @throws {ClientError} Si la requête échoue
   */
  async getDashboard(entrepriseId: string): Promise<Dashboard> {
    try {
      const { data } = await apiClient.get<Dashboard>('/dashboard/', {
        params: { entreprise_id: entrepriseId },
      });
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger le tableau de bord');
    }
  }

  /**
   * Récupère les détails d'une entreprise
   * @throws {ClientError} Si l'entreprise n'existe pas
   */
  async getEntreprise(id: string): Promise<Entreprise> {
    try {
      const { data } = await apiClient.get<Entreprise>(`/entreprises/${id}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les informations de l\'entreprise');
    }
  }

  /**
   * Met à jour les informations d'une entreprise (PATCH)
   * @throws {ClientError} Si la mise à jour échoue
   */
  async updateEntreprise(id: string, updateData: EntrepriseUpdateData): Promise<Entreprise> {
    try {
      // Validation des données
      if (updateData.email_contact && !this.isValidEmail(updateData.email_contact)) {
        throw new ClientError('L\'adresse email est invalide', 400);
      }

      if (updateData.site_web && !this.isValidUrl(updateData.site_web)) {
        throw new ClientError('L\'URL du site web est invalide', 400);
      }

      const { data } = await apiClient.patch<Entreprise>(`/entreprises/${id}/`, updateData);
      return data;
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw this.handleError(error, 'Impossible de mettre à jour l\'entreprise');
    }
  }

  /**
   * Crée une nouvelle entreprise
   * @throws {ClientError} Si la création échoue
   */
  async createEntreprise(createData: EntrepriseCreateData): Promise<Entreprise> {
    try {
      // Validation des données
      if (!createData.siren || createData.siren.length !== 9) {
        throw new ClientError('Le SIREN doit contenir 9 chiffres', 400);
      }

      if (createData.email_contact && !this.isValidEmail(createData.email_contact)) {
        throw new ClientError('L\'adresse email est invalide', 400);
      }

      if (createData.site_web && !this.isValidUrl(createData.site_web)) {
        throw new ClientError('L\'URL du site web est invalide', 400);
      }

      const { data } = await apiClient.post<Entreprise>('/entreprises/', createData);
      return data;
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw this.handleError(error, 'Impossible de créer l\'entreprise');
    }
  }

  /**
   * Met à jour complètement une entreprise (PUT)
   * @throws {ClientError} Si la mise à jour échoue
   */
  async replaceEntreprise(id: string, updateData: EntrepriseCreateData): Promise<Entreprise> {
    try {
      const { data } = await apiClient.put<Entreprise>(`/entreprises/${id}/`, updateData);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de remplacer l\'entreprise');
    }
  }

  /**
   * Supprime une entreprise
   * @throws {ClientError} Si la suppression échoue
   */
  async deleteEntreprise(id: string): Promise<void> {
    try {
      await apiClient.delete(`/entreprises/${id}/`);
    } catch (error) {
      throw this.handleError(error, 'Impossible de supprimer l\'entreprise');
    }
  }

  /**
   * Upload un avis de remplacement
   * @throws {ClientError} Si l'upload échoue
   */
  async uploadAvis(entrepriseId: string, avisData: UploadAvisRequest): Promise<UploadAvisResponse> {
    try {
      // Validation du texte
      if (!avisData.texte_avis || avisData.texte_avis.trim().length < 50) {
        throw new ClientError('L\'avis doit contenir au moins 50 caractères', 400);
      }

      const { data } = await apiClient.post<UploadAvisResponse>(
        `/entreprises/${entrepriseId}/upload_avis/`,
        avisData
      );
      return data;
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw this.handleError(error, 'Impossible d\'envoyer l\'avis');
    }
  }

  /**
   * Récupère la liste des avis avec filtres
   * @throws {ClientError} Si la requête échoue
   */
  async getAvisDecryptes(filters: AvisFilters = {}): Promise<PaginatedResponse<AvisDecrypte>> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<AvisDecrypte>>(
        '/avis-decryptes/',
        { params: filters }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les avis');
    }
  }

  /**
   * Récupère les détails d'un avis
   * @throws {ClientError} Si l'avis n'existe pas
   */
  async getAvisDecrypte(avisId: string): Promise<AvisDecrypte> {
    try {
      const { data } = await apiClient.get<AvisDecrypte>(`/avis-decryptes/${avisId}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger l\'avis');
    }
  }

  /**
   * Récupère la liste des avis d'une entreprise (méthode simplifiée)
   * @deprecated Utiliser getAvisDecryptes avec filtres
   */
  async getAvis(entrepriseId: string, page: number = 1): Promise<{ results: AvisDecrypte[]; count: number; next: string | null }> {
    try {
      const { data } = await apiClient.get<{ results: AvisDecrypte[]; count: number; next: string | null }>(
        '/avis-decryptes/',
        {
          params: { entreprise: entrepriseId, page, page_size: 10 },
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les avis');
    }
  }

  /**
   * Récupère les détails d'un avis (méthode simplifiée)
   * @deprecated Utiliser getAvisDecrypte
   */
  async getAvisDetail(avisId: string): Promise<AvisDecrypte> {
    return this.getAvisDecrypte(avisId);
  }

  /**
   * Récupère les sponsorisations actives
   * @throws {ClientError} Si la requête échoue
   */
  async getSponsorisations(isActive?: boolean): Promise<Sponsorisation[]> {
    try {
      const { data } = await apiClient.get<{ results: Sponsorisation[] }>('/sponsorisations/', {
        params: { is_active: isActive },
      });
      return data.results;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les sponsorisations');
    }
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): ClientError {
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

      return new ClientError(
        errorMessage,
        axiosError.response?.status,
        axiosError.response?.data as Record<string, string[]>
      );
    }

    if (error instanceof ClientError) {
      return error;
    }

    return new ClientError(defaultMessage);
  }

  /**
   * Validation d'email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validation d'URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export const clientService = new ClientService();
