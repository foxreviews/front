/**
 * Types pour la facturation et paiements Stripe
 */

import type { UUID, ISODateTime, StripePaymentStatus, StripeInvoiceStatus } from './common';

export interface CreateCheckoutRequest {
  pro_localisation_id: UUID;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface Invoice {
  id: UUID;
  subscription: UUID;
  entreprise: UUID;
  stripe_invoice_id: string;
  stripe_payment_intent_id?: string;
  invoice_number: string;
  status: StripeInvoiceStatus;
  amount_due: number;
  amount_paid: number;
  currency: string;
  period_start: ISODateTime;
  period_end: ISODateTime;
  due_date?: ISODateTime;
  invoice_pdf?: string;
  hosted_invoice_url?: string;
  is_paid: boolean;
  created_at: ISODateTime;
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
  id: UUID;
  entreprise: UUID;
  entreprise_nom: string;
  pro_localisation?: UUID;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_checkout_session_id?: string;
  status: StripePaymentStatus;
  current_period_start: ISODateTime;
  current_period_end: ISODateTime;
  cancel_at_period_end: boolean;
  canceled_at?: ISODateTime;
  ended_at?: ISODateTime;
  trial_start?: ISODateTime;
  trial_end?: ISODateTime;
  amount: number;
  currency: string;
  is_active: boolean;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}
