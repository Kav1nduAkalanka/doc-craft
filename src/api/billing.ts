/**
 * Billing / Subscription API endpoints
 * Maps to: GET /quota, GET /subscription, POST /billing/checkout, POST /billing/portal
 */

import { get, post } from './client';
import type { Quota, Subscription, CheckoutResponse, PortalResponse } from '../types';

/** GET /quota — Get daily generation quota status */
export function getQuota(): Promise<Quota> {
  return get<Quota>('/quota');
}

/** GET /subscription — Get subscription status */
export function getSubscription(): Promise<Subscription> {
  return get<Subscription>('/subscription');
}

/** POST /billing/checkout — Create Stripe checkout session */
export function createCheckout(plan: 'pro_monthly' | 'pro_annual'): Promise<CheckoutResponse> {
  return post<CheckoutResponse>('/billing/checkout', { plan });
}

/** POST /billing/portal — Create Stripe billing portal session */
export function createPortal(): Promise<PortalResponse> {
  return post<PortalResponse>('/billing/portal');
}
