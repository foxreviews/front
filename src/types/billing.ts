/**
 * Types pour la facturation et paiements Stripe
 */

import type { UUID, ISODateTime, StripePaymentStatus, StripeInvoiceStatus } from './common';

export interface CreateCheckoutRequest {
  pro_localisation_id: UUID;
  duration_months?: number;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface Invoice {
  /**
   * Le backend renvoie un id numérique (interne) dans la doc.
   * On garde la compatibilité en acceptant aussi UUID string.
   */
  id: number | UUID;

  invoice_number: string;
  status: StripeInvoiceStatus;
  amount_due: number;
  amount_paid?: number;
  currency: string;

  period_start?: ISODateTime;
  period_end?: ISODateTime;
  due_date?: ISODateTime;

  invoice_pdf?: string;
  hosted_invoice_url?: string;

  created_at: ISODateTime;

  /** Champs legacy / optionnels selon impl backend */
  subscription?: UUID;
  entreprise?: UUID;
  stripe_invoice_id?: string;
  stripe_payment_intent_id?: string;
  is_paid?: boolean;
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
  id: number | UUID;
  entreprise_nom: string;
  status: StripePaymentStatus;
  amount: number;
  currency: string;
  current_period_start: ISODateTime;
  current_period_end: ISODateTime;
  cancel_at_period_end: boolean;
  canceled_at?: ISODateTime | null;
  created_at: ISODateTime;

  /**
   * Le backend expose un objet pro_localisation_info dans la doc.
   */
  pro_localisation_info?: {
    sous_categorie: string;
    ville: string;
  };

  /** Champs legacy / optionnels selon impl backend */
  entreprise?: UUID;
  pro_localisation?: UUID;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_checkout_session_id?: string;
  ended_at?: ISODateTime;
  trial_start?: ISODateTime;
  trial_end?: ISODateTime;
  is_active?: boolean;
  updated_at?: ISODateTime;
}

export interface StripeCheckoutSessionRequest {
  pro_localisation_id: UUID;
  duration_months?: number;
  success_url: string;
  cancel_url: string;
}

export interface StripeCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface StripePortalSessionRequest {
  return_url: string;
}

export interface StripePortalSessionResponse {
  url: string;
}
