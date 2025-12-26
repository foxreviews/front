import { useState, useEffect, useCallback } from 'react';
import { billingService, BillingError } from '../services/billing.service';
import type { 
  CreateCheckoutRequest, 
  Invoice, 
  Subscription 
} from '../types/billing';

/**
 * Hook pour gérer la facturation et les paiements
 */
export function useBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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

  const fetchSubscriptions = useCallback(async () => {
    try {
      const data = await billingService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      const errorMessage = err instanceof BillingError 
        ? err.message 
        : 'Impossible de charger les abonnements';
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchInvoices(), fetchSubscriptions()]);
    };
    loadData();
  }, [fetchInvoices, fetchSubscriptions]);

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

  const openPortal = useCallback(async (returnUrl: string): Promise<boolean> => {
    setProcessing(true);
    setError(null);

    try {
      const { url } = await billingService.createCustomerPortalSession(returnUrl);
      window.location.href = url;
      return true;
    } catch (err) {
      const errorMessage = err instanceof BillingError
        ? err.message
        : 'Impossible d\'accéder au portail de gestion';
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
    fetchSubscriptions();
  }, [fetchInvoices, fetchSubscriptions]);

  const activeSubscription = subscriptions.find((s) => s.status === 'active') || null;

  return {
    invoices,
    subscriptions,
    subscription: activeSubscription,
    loading,
    error,
    processing,
    createCheckout,
    openPortal,
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
      const data = await billingService.getInvoiceDetail(invoiceId);
      setInvoice(data);
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
