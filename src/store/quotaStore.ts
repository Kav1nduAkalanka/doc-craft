/**
 * Quota Store — Zustand
 * Manages quota status and subscription info.
 * Includes DEMO MODE with mock quota data.
 */

import { create } from 'zustand';
import type { Quota, Subscription } from '../types';
import * as billingApi from '../api/billing';

function isDemoMode(): boolean {
  return localStorage.getItem('doccraft_token') === 'demo_token_for_testing';
}

interface QuotaState {
  quota: Quota | null;
  subscription: Subscription | null;
  showUpgradeModal: boolean;
  isLoading: boolean;

  fetchQuota: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  checkout: (plan: 'pro_monthly' | 'pro_annual') => Promise<void>;
  openPortal: () => Promise<void>;
  setShowUpgradeModal: (show: boolean) => void;
}

export const useQuotaStore = create<QuotaState>((set) => ({
  quota: null,
  subscription: null,
  showUpgradeModal: false,
  isLoading: false,

  fetchQuota: async () => {
    if (isDemoMode()) {
      const authStore = await import('./authStore');
      const plan = authStore.useAuthStore.getState().user?.plan || 'free';
      set({
        quota: {
          plan,
          daily_limit: plan === 'pro' ? 9999 : 3,
          used_today: 1,
          remaining: plan === 'pro' ? 9998 : 2,
          resets_at: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
        },
      });
      return;
    }

    try {
      const quota = await billingApi.getQuota();
      set({ quota });
    } catch {
      // Silent fail
    }
  },

  fetchSubscription: async () => {
    if (isDemoMode()) {
      const authStore = await import('./authStore');
      const plan = authStore.useAuthStore.getState().user?.plan;
      if (plan === 'pro') {
        set({
          subscription: {
            plan: 'pro_monthly',
            status: 'active',
            current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            stripe_customer_id: 'demo_cus_123',

          }
        });
      } else {
        set({ subscription: null });
      }
      return;
    }

    try {
      const subscription = await billingApi.getSubscription();
      set({ subscription });
    } catch {
      // Silent fail — user may not have a subscription
    }
  },

  checkout: async (plan: 'pro_monthly' | 'pro_annual') => {
    if (isDemoMode()) {
      alert(`Demo mode: Would redirect to Stripe checkout for "${plan}" plan.`);
      return;
    }

    set({ isLoading: true });
    try {
      const response = await billingApi.createCheckout(plan);
      window.location.href = response.checkout_url;
    } catch {
      set({ isLoading: false });
    }
  },

  openPortal: async () => {
    if (isDemoMode()) {
      alert('Demo mode: Would redirect to Stripe billing portal.');
      return;
    }

    try {
      const response = await billingApi.createPortal();
      window.location.href = response.portal_url;
    } catch {
      // Silent fail
    }
  },

  setShowUpgradeModal: (show: boolean) => set({ showUpgradeModal: show }),
}));
