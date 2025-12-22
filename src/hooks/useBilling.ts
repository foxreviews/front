import { useState, useEffect, useCallback } from 'react';
import { billingService, BillingError } from '../services/billing.service';
import type { 
  CreateCheckoutRequest, 
  BillingHistory, 
  Invoice, 
  Subscription 
} from '../types/billing';

/**
 * Hook pour gérer la facturation et les paiements
 */
export function useBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await billingService.getInvoices();
      setInvoices(data);
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de charger l\'historique des factures';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    try {
      const data = await billingService.getSubscription();
      setSubscription(data);
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de charger l\'abonnement';
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchInvoices(), fetchSubscription()]);
    };
    loadData();
  }, [fetchInvoices, fetchSubscription]);

  const createCheckout = useCallback(async (request: CreateCheckoutRequest): Promise<string | null> => {
    setProcessing(true);
    setError(null);

    try {
      const response = await billingService.createCheckoutSession(request);
      return response.checkout_url;
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de créer la session de paiement';
      setError(errorMessage);
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const cancelSubscription = useCallback(async (_subscriptionId: string): Promise<boolean> => {
    setProcessing(true);
    setError(null);

    try {
      // TODO: Implement cancelSubscription in billing service
      setError('Fonctionnalité non implémentée');
      return false;
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible d\'annuler l\'abonnement';
      setError(errorMessage);
      return false;
    } finally {
      setProcessing(false);
    }
  }, []);

  const reactivateSubscription = useCallback(async (_subscriptionId: string): Promise<boolean> => {
    setProcessing(true);
    setError(null);

    try {
      // TODO: Implement reactivateSubscription in billing service
      setError('Fonctionnalité non implémentée');
      return false;
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de réactiver l\'abonnement';
      setError(errorMessage);
      return false;
    } finally {
      setProcessing(false);
    }
  }, []);

  const downloadInvoice = useCallback((invoiceUrl: string) => {
    try {
      billingService.downloadInvoice(invoiceUrl);
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de télécharger la facture';
      setError(errorMessage);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchInvoices();
    fetchSubscription();
  }, [fetchInvoices, fetchSubscription]);

  return {
    invoices,
    subscription,
    loading,
    error,
    processing,
    createCheckout,
    cancelSubscription,
    reactivateSubscription,
    downloadInvoice,
    refresh,
    formatAmount: billingService.formatAmount.bind(billingService),
    formatDate: billingService.formatDate.bind(billingService),
    getStatusLabel: billingService.getStatusLabel.bind(billingService),
  };
}

/**
 * Hook pour gérer une facture spécifique
 */
export function useInvoice(invoiceId: string | null) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    if (!invoiceId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement getInvoiceDetail in billing service
      setError('Fonctionnalité non implémentée');
      setInvoice(null);
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de charger la facture';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  return { invoice, loading, error };
}
