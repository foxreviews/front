import { useState, useCallback } from 'react';
import { stripeService, StripeError } from '../services/stripe.service';
import type { Subscription } from '../types/billing';

/**
 * Hook pour gérer les paiements et abonnements Stripe
 */
export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crée une session checkout et redirige vers Stripe
   */
  const createCheckout = useCallback(async (
    proLocalisationId: string,
    successUrl: string,
    cancelUrl: string,
    durationMonths: number = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await stripeService.createCheckoutSession({
        pro_localisation_id: proLocalisationId,
        duration_months: durationMonths,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      // Redirection vers Stripe Checkout
      window.location.href = response.checkout_url;
    } catch (err) {
      const errorMessage =
        err instanceof StripeError
          ? err.message
          : 'Une erreur est survenue lors de la création de la session de paiement';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Ouvre le portail client Stripe pour gérer l'abonnement
   */
  const openPortal = useCallback(async (returnUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await stripeService.createPortalSession({
        return_url: returnUrl,
      });

      // Redirection vers Stripe Customer Portal
      window.location.href = response.url;
    } catch (err) {
      const errorMessage =
        err instanceof StripeError
          ? err.message
          : 'Une erreur est survenue lors de l\'accès au portail client';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Récupère les abonnements de l'utilisateur
   */
  const getSubscriptions = useCallback(async (): Promise<Subscription[]> => {
    setLoading(true);
    setError(null);

    try {
      const subscriptions = await stripeService.getSubscriptions();
      setLoading(false);
      return subscriptions;
    } catch (err) {
      const errorMessage =
        err instanceof StripeError
          ? err.message
          : 'Une erreur est survenue lors de la récupération des abonnements';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Vérifie si l'utilisateur a un abonnement actif
   */
  const checkActiveSubscription = useCallback(async (): Promise<boolean> => {
    try {
      return await stripeService.hasActiveSubscription();
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'abonnement:', err);
      return false;
    }
  }, []);

  /**
   * Efface l'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createCheckout,
    openPortal,
    getSubscriptions,
    checkActiveSubscription,
    clearError,
  };
}
