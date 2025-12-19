import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  Invoice,
  BillingHistory,
  Subscription,
} from '../types/billing';

/**
 * Classe d'erreur personnalisée pour les erreurs de facturation
 */
export class BillingError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'BillingError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Service de facturation et paiements Stripe
 * Gère les checkouts, abonnements et factures
 */
class BillingService {
  /**
   * Crée une session Stripe Checkout
   * @throws {BillingError} Si la création échoue
   */
  async createCheckoutSession(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    try {
      // Validation des données
      if (!request.pro_localisation_id) {
        throw new BillingError('ID de ProLocalisation manquant', 400);
      }

      if (!request.success_url || !request.cancel_url) {
        throw new BillingError('URLs de redirection manquantes', 400);
      }

      const { data } = await apiClient.post<CreateCheckoutResponse>(
        '/stripe/create-checkout/',
        request
      );

      if (!data.checkout_url || !data.session_id) {
        throw new BillingError('Réponse invalide du serveur', 500);
      }

      return data;
    } catch (error) {
      if (error instanceof BillingError) throw error;
      throw this.handleError(error, 'Impossible de créer la session de paiement');
    }
  }

  /**
   * Récupère l'historique des factures
   * @throws {BillingError} Si la requête échoue
   */
  async getInvoices(limit: number = 10): Promise<BillingHistory> {
    try {
      const { data } = await apiClient.get<BillingHistory>('/stripe/invoices/', {
        params: { limit },
      });
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger l\'historique des factures');
    }
  }

  /**
   * Récupère les détails d'une facture
   * @throws {BillingError} Si la facture n'existe pas
   */
  async getInvoiceDetail(invoiceId: string): Promise<Invoice> {
    try {
      const { data } = await apiClient.get<Invoice>(`/stripe/invoices/${invoiceId}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger la facture');
    }
  }

  /**
   * Récupère les informations d'abonnement actif
   * @throws {BillingError} Si la requête échoue
   */
  async getSubscription(): Promise<Subscription | null> {
    try {
      const { data } = await apiClient.get<Subscription>('/stripe/subscription/');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Pas d'abonnement actif
      }
      throw this.handleError(error, 'Impossible de charger l\'abonnement');
    }
  }

  /**
   * Annule un abonnement
   * @throws {BillingError} Si l'annulation échoue
   */
  async cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.post<{ message: string }>(
        `/stripe/subscription/${subscriptionId}/cancel/`
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible d\'annuler l\'abonnement');
    }
  }

  /**
   * Réactive un abonnement annulé
   * @throws {BillingError} Si la réactivation échoue
   */
  async reactivateSubscription(subscriptionId: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.post<{ message: string }>(
        `/stripe/subscription/${subscriptionId}/reactivate/`
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de réactiver l\'abonnement');
    }
  }

  /**
   * Télécharge une facture en PDF
   */
  downloadInvoice(invoiceUrl: string): void {
    if (!invoiceUrl) {
      throw new BillingError('URL de facture invalide', 400);
    }
    window.open(invoiceUrl, '_blank');
  }

  /**
   * Formate un montant en euros
   */
  formatAmount(amountInCents: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amountInCents / 100);
  }

  /**
   * Formate une date timestamp
   */
  formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(timestamp * 1000));
  }

  /**
   * Obtient le statut de paiement lisible
   */
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      paid: 'Payée',
      open: 'En attente',
      void: 'Annulée',
      uncollectible: 'Impayée',
      active: 'Actif',
      past_due: 'En retard',
      canceled: 'Résilié',
      incomplete: 'Incomplet',
      trialing: 'Essai',
    };
    return labels[status] || status;
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): BillingError {
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

      // Message spécifique pour limite de sponsors
      if (axiosError.response?.status === 403) {
        return new BillingError(
          'La limite de 5 sponsors est atteinte pour cette localisation',
          403
        );
      }

      return new BillingError(
        errorMessage,
        axiosError.response?.status,
        axiosError.response?.data as Record<string, string[]>
      );
    }

    if (error instanceof BillingError) {
      return error;
    }

    return new BillingError(defaultMessage);
  }
}

export const billingService = new BillingService();
