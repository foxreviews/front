import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  ProLocalisation,
  ProLocalisationFilters,
  ProLocalisationListResponse,
} from '../types/prolocalisation';

/**
 * Classe d'erreur personnalisée pour les erreurs de ProLocalisation
 */
export class ProLocalisationError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ProLocalisationError';
    this.statusCode = statusCode;
  }
}

/**
 * Service de gestion des ProLocalisations
 * Gère le triplet Entreprise × Sous-catégorie × Ville
 */
class ProLocalisationService {
  /**
   * Récupère la liste des ProLocalisations avec filtres
   * @throws {ProLocalisationError} Si la requête échoue
   */
  async getProLocalisations(
    filters: ProLocalisationFilters = {}
  ): Promise<ProLocalisationListResponse> {
    try {
      const { data } = await apiClient.get<ProLocalisationListResponse>(
        '/pro-localisations/',
        { params: filters }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les ProLocalisations');
    }
  }

  /**
   * Récupère les détails d'une ProLocalisation
   * @throws {ProLocalisationError} Si la ProLocalisation n'existe pas
   */
  async getProLocalisation(id: string): Promise<ProLocalisation> {
    try {
      const { data } = await apiClient.get<ProLocalisation>(
        `/pro-localisations/${id}/`
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger la ProLocalisation');
    }
  }

  /**
   * Récupère les ProLocalisations d'une entreprise
   * @throws {ProLocalisationError} Si la requête échoue
   */
  async getByEntreprise(entrepriseId: string): Promise<ProLocalisation[]> {
    try {
      const response = await this.getProLocalisations({ 
        entreprise: entrepriseId,
        page_size: 100 
      });
      return response.results;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les ProLocalisations de l\'entreprise');
    }
  }

  /**
   * Récupère les ProLocalisations d'une sous-catégorie
   * @throws {ProLocalisationError} Si la requête échoue
   */
  async getBySousCategorie(sousCategorieId: string): Promise<ProLocalisation[]> {
    try {
      const response = await this.getProLocalisations({ 
        sous_categorie: sousCategorieId,
        page_size: 100 
      });
      return response.results;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les ProLocalisations de la sous-catégorie');
    }
  }

  /**
   * Récupère les ProLocalisations d'une ville
   * @throws {ProLocalisationError} Si la requête échoue
   */
  async getByVille(villeId: string): Promise<ProLocalisation[]> {
    try {
      const response = await this.getProLocalisations({ 
        ville: villeId,
        page_size: 100 
      });
      return response.results;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les ProLocalisations de la ville');
    }
  }

  /**
   * Recherche de ProLocalisations
   * @throws {ProLocalisationError} Si la requête échoue
   */
  async search(searchQuery: string, page: number = 1): Promise<ProLocalisationListResponse> {
    try {
      return await this.getProLocalisations({ 
        search: searchQuery, 
        page,
        page_size: 20 
      });
    } catch (error) {
      throw this.handleError(error, 'Impossible de rechercher les ProLocalisations');
    }
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): ProLocalisationError {
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

      return new ProLocalisationError(errorMessage, axiosError.response?.status);
    }

    if (error instanceof ProLocalisationError) {
      return error;
    }

    return new ProLocalisationError(defaultMessage);
  }
}

export const proLocalisationService = new ProLocalisationService();
