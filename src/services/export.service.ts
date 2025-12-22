import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';

/**
 * Classe d'erreur personnalisée pour les erreurs d'export
 */
export class ExportError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ExportError';
    this.statusCode = statusCode;
  }
}

/**
 * Service d'export de données
 * Gère l'export des entreprises, avis, ProLocalisations, etc.
 */
class ExportService {
  /**
   * Exporte les entreprises en CSV
   * @throws {ExportError} Si l'export échoue
   */
  async exportEntreprises(): Promise<Blob> {
    try {
      const { data } = await apiClient.get('/export/entreprises/', {
        responseType: 'blob',
      });
      return new Blob([data], { type: 'text/csv' });
    } catch (error) {
      throw this.handleError(error, 'Impossible d\'exporter les entreprises');
    }
  }

  /**
   * Exporte les ProLocalisations en CSV
   * @throws {ExportError} Si l'export échoue
   */
  async exportProLocalisations(): Promise<Blob> {
    try {
      const { data } = await apiClient.get('/export/prolocalisations/', {
        responseType: 'blob',
      });
      return new Blob([data], { type: 'text/csv' });
    } catch (error) {
      throw this.handleError(error, 'Impossible d\'exporter les ProLocalisations');
    }
  }

  /**
   * Exporte les avis décryptés en CSV
   * @throws {ExportError} Si l'export échoue
   */
  async exportAvis(): Promise<Blob> {
    try {
      const { data } = await apiClient.get('/export/avis/', {
        responseType: 'blob',
      });
      return new Blob([data], { type: 'text/csv' });
    } catch (error) {
      throw this.handleError(error, 'Impossible d\'exporter les avis');
    }
  }

  /**
   * Exporte les pages WordPress en JSON
   * @throws {ExportError} Si l'export échoue
   */
  async exportPagesWordPress(): Promise<any> {
    try {
      const { data } = await apiClient.get('/export/pages-wordpress/');
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible d\'exporter les pages WordPress');
    }
  }

  /**
   * Récupère les statistiques globales
   * @throws {ExportError} Si la requête échoue
   */
  async getStats(): Promise<any> {
    try {
      const { data } = await apiClient.get('/export/stats/');
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les statistiques');
    }
  }

  /**
   * Télécharge un fichier CSV
   */
  downloadCSV(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Télécharge les entreprises en CSV
   */
  async downloadEntreprises(filename: string = 'entreprises.csv'): Promise<void> {
    const blob = await this.exportEntreprises();
    this.downloadCSV(blob, filename);
  }

  /**
   * Télécharge les ProLocalisations en CSV
   */
  async downloadProLocalisations(filename: string = 'prolocalisations.csv'): Promise<void> {
    const blob = await this.exportProLocalisations();
    this.downloadCSV(blob, filename);
  }

  /**
   * Télécharge les avis en CSV
   */
  async downloadAvis(filename: string = 'avis.csv'): Promise<void> {
    const blob = await this.exportAvis();
    this.downloadCSV(blob, filename);
  }

  /**
   * Télécharge les données WordPress en JSON
   */
  async downloadWordPressData(filename: string = 'wordpress-pages.json'): Promise<void> {
    const data = await this.exportPagesWordPress();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    this.downloadCSV(blob, filename);
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): ExportError {
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

      return new ExportError(errorMessage, axiosError.response?.status);
    }

    if (error instanceof ExportError) {
      return error;
    }

    return new ExportError(defaultMessage);
  }
}

export const exportService = new ExportService();
