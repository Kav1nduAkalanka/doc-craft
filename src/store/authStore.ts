/**
 * Auth Store — Zustand
 * Manages user authentication state, tokens, and session management.
 */

import { create } from 'zustand';
import type { User, GuestSession } from '../types';
import * as authApi from '../api/auth';
import { setToken, clearToken } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestSession: GuestSession | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  guestLogin: () => Promise<void>;
  googleAuth: () => void;
  passwordReset: (email: string) => Promise<string>;
  demoLogin: () => void;
  toggleDemoPlan: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  guestSession: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      setToken(response.access_token);
      set({
        user: response.user,
        isAuthenticated: true,
        isGuest: false,
        guestSession: null,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register(email, password);
      // After registration, auto-login
      await get().login(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout even if API call fails
    }
    clearToken();
    set({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      guestSession: null,
    });
  },

  guestLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await authApi.guestLogin();
      setToken(session.session_token);
      set({
        isAuthenticated: true,
        isGuest: true,
        guestSession: session,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Guest session failed.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  googleAuth: () => {
    const url = authApi.getGoogleOAuthUrl(window.location.origin);
    window.location.href = url;
  },

  passwordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.passwordReset(email);
      set({ isLoading: false });
      return response.message;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  demoLogin: () => {
    const demoUser: User = {
      user_id: 'demo-user-001',
      email: 'demo@doccraft.app',
      full_name: 'Demo User',
      auth_provider: 'email',
      plan: 'free',
      timezone: 'Asia/Colombo',
    };
    setToken('demo_token_for_testing');
    set({
      user: demoUser,
      isAuthenticated: true,
      isGuest: false,
      guestSession: null,
      isLoading: false,
      error: null,
    });
  },

  toggleDemoPlan: () => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          plan: currentUser.plan === 'free' ? 'pro' : 'free',
        }
      });
    }
  },

  setUser: (user: User) => set({ user }),

  setToken: (token: string) => {
    setToken(token);
    set({ isAuthenticated: true });
  },

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    const token = localStorage.getItem('doccraft_token');
    if (!token) return;
    
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isGuest: false });
    } catch {
      clearToken();
      set({ user: null, isAuthenticated: false });
    }
  },
}));
