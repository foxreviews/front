/**
 * Types pour la facturation et paiements Stripe
 */

export interface CreateCheckoutRequest {
  pro_localisation_id: string;
  duration_months?: number;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: number;
  due_date?: number;
  paid_at?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
}

export interface BillingHistory {
  invoices: Invoice[];
  total_count: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface Subscription {
  id: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
}
