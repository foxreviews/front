import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  StripeCheckoutSessionRequest,
  StripeCheckoutSessionResponse,
  StripePortalSessionRequest,
  StripePortalSessionResponse,
  Invoice,
  Subscription,
} from '../types/billing';

/**
 * Classe d'erreur pour les erreurs Stripe
 */
export class StripeError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'StripeError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Service de gestion des paiements Stripe
 * Gère la création de sessions checkout et l'accès au portail client
 */
class StripeService {
  /**
   * Crée une session Stripe Checkout pour la sponsorisation
   * Redirige l'utilisateur vers la page de paiement Stripe
   * @param request - Données de sponsorisation
   * @returns URL de checkout et ID de session
   * @throws {StripeError} Si la création échoue
   */
  async createCheckoutSession(
    request: StripeCheckoutSessionRequest
  ): Promise<StripeCheckoutSessionResponse> {
    try {
      const { data } = await apiClient.post<StripeCheckoutSessionResponse>(
        'sponsorisation/checkout/',
        request
      );

      if (!data.checkout_url || !data.session_id) {
        throw new StripeError('Données de session incomplètes', 500);
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error?: string;
          detail?: string;
        }>;

        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Impossible de créer la session de paiement';

        throw new StripeError(
          errorMessage,
          axiosError.response?.status
        );
      }

      if (error instanceof StripeError) {
        throw error;
      }

      throw new StripeError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Crée une session Stripe Customer Portal
   * Permet à l'utilisateur de gérer son abonnement, paiements et factures
   * @param request - URL de retour après gestion
   * @returns URL du portail client
   * @throws {StripeError} Si la création échoue
   */
  async createPortalSession(
    request: StripePortalSessionRequest
  ): Promise<StripePortalSessionResponse> {
    try {
      const { data } = await apiClient.post<{ url: string }>(
        'billing/portal/',
        request
      );

      if (!data.url) {
        throw new StripeError('URL du portail non reçue', 500);
      }

      return { url: data.url };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error?: string;
          detail?: string;
        }>;

        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Impossible d\'accéder au portail de gestion';

        throw new StripeError(
          errorMessage,
          axiosError.response?.status
        );
      }

      if (error instanceof StripeError) {
        throw error;
      }

      throw new StripeError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Récupère les abonnements de l'utilisateur
   * @returns Liste des abonnements actifs et historiques
   * @throws {StripeError} Si la récupération échoue
   */
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const { data } = await apiClient.get<Subscription[]>('billing/api/subscriptions/');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error?: string;
          detail?: string;
        }>;

        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Impossible de récupérer les abonnements';

        throw new StripeError(
          errorMessage,
          axiosError.response?.status
        );
      }

      throw new StripeError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Vérifie si l'utilisateur a un abonnement actif
   * @returns true si l'utilisateur a un abonnement premium actif
   */
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscriptions = await this.getSubscriptions();
      return subscriptions.some(sub => sub.status === 'active' || sub.is_active === true);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  }

  /**
   * Détails d'un abonnement
   */
  async getSubscriptionDetail(subscriptionId: number | string): Promise<Subscription> {
    try {
      const { data } = await apiClient.get<Subscription>(`billing/api/subscriptions/${subscriptionId}/`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string; detail?: string }>;
        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Impossible de récupérer le détail de l\'abonnement';
        throw new StripeError(errorMessage, axiosError.response?.status);
      }

      throw new StripeError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Liste des factures
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      const { data } = await apiClient.get<Invoice[]>('billing/api/invoices/');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string; detail?: string }>;
        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Impossible de récupérer les factures';
        throw new StripeError(errorMessage, axiosError.response?.status);
      }

      throw new StripeError('Une erreur réseau est survenue. Veuillez réessayer.');
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
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string; detail?: string }>;
        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Impossible de récupérer le détail de la facture';
        throw new StripeError(errorMessage, axiosError.response?.status);
      }

      throw new StripeError('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  }
}

// Instance unique du service
export const stripeService = new StripeService();
export default stripeService;
