/**
 * Quota Store — Zustand
 * Manages quota status and subscription info.
 */

import { create } from 'zustand';
import type { Quota, Subscription } from '../types';
import * as billingApi from '../api/billing';

interface QuotaState {
  quota: Quota | null;
  subscription: Subscription | null;
  showUpgradeModal: boolean;
  isLoading: boolean;
  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Fetch the current daily quota usage and limits for the user */
  fetchQuota: () => Promise<void>;
  
  /** Fetch the user's active subscription status from Stripe */
  fetchSubscription: () => Promise<void>;
  
  /** Redirect the user to a Stripe Checkout session to upgrade their plan */
  checkout: (plan: 'pro_monthly' | 'pro_annual') => Promise<void>;
  
  /** Redirect the user to the Stripe Billing Portal to manage their subscription */
  openPortal: () => Promise<void>;
  
  /** Toggle the visibility of the "Upgrade to Pro" modal */
  setShowUpgradeModal: (show: boolean) => void;
}

export const useQuotaStore = create<QuotaState>((set) => ({
  quota: null,
  subscription: null,
  showUpgradeModal: false,
  isLoading: false,

  fetchQuota: async () => {
    try {
      const quota = await billingApi.getQuota();
      set({ quota });
    } catch {
      // Silent fail
    }
  },

  fetchSubscription: async () => {
    try {
      const subscription = await billingApi.getSubscription();
      set({ subscription });
    } catch {
      // Silent fail — user may not have a subscription
    }
  },

  checkout: async (plan: 'pro_monthly' | 'pro_annual') => {
    set({ isLoading: true });
    try {
      const response = await billingApi.createCheckout(plan);
      window.location.href = response.checkout_url;
    } catch {
      set({ isLoading: false });
    }
  },

  openPortal: async () => {
    try {
      const response = await billingApi.createPortal();
      window.location.href = response.portal_url;
    } catch {
      // Silent fail
    }
  },

  setShowUpgradeModal: (show: boolean) => set({ showUpgradeModal: show }),
}));
