import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  Invoice,
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

      const { data } = await apiClient.post<CreateCheckoutResponse>('sponsorisation/checkout/', request);

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
   * Ouvre le Customer Portal Stripe
   */
  async createCustomerPortalSession(returnUrl: string): Promise<{ url: string }> {
    try {
      const { data } = await apiClient.post<{ url: string }>('billing/portal/', {
        return_url: returnUrl,
      });

      if (!data.url) {
        throw new BillingError('URL du portail non reçue', 500);
      }

      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible d\'accéder au portail de gestion');
    }
  }

  /**
   * Liste des abonnements
   */
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const { data } = await apiClient.get<Subscription[]>('billing/api/subscriptions/');
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les abonnements');
    }
  }

  /**
   * Compat: retourne l'abonnement actif (ou null)
   */
  async getSubscription(): Promise<Subscription | null> {
    const subscriptions = await this.getSubscriptions();
    return subscriptions.find((s) => s.status === 'active') || null;
  }

  /**
   * Détails d'un abonnement
   */
  async getSubscriptionDetail(subscriptionId: number | string): Promise<Subscription> {
    try {
      const { data } = await apiClient.get<Subscription>(`billing/api/subscriptions/${subscriptionId}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger le détail de l\'abonnement');
    }
  }

  /**
   * Récupère l'historique des factures
   * @throws {BillingError} Si la requête échoue
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      const { data } = await apiClient.get<Invoice[]>('billing/api/invoices/');
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger l\'historique des factures');
    }
  }

  /**
   * Détails d'une facture
   */
  async getInvoiceDetail(invoiceId: number | string): Promise<Invoice> {
    try {
      const { data } = await apiClient.get<Invoice>(`billing/api/invoices/${invoiceId}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger la facture');
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
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  /**
   * Formate une date ISO
   */
  formatDate(isoDate: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(isoDate));
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
          axiosError.response?.data?.error || 'Limite de 5 sponsors atteinte pour cette catégorie/ville',
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
