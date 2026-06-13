/**
 * Auth Store — Zustand
 * Manages user authentication state, tokens, and session management.
 */

import { create } from 'zustand';
import type { User } from '../types';
import * as authApi from '../api/auth';
import { setToken, clearToken } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Authenticate a user with email and password, setting the session token */
  login: (email: string, password: string) => Promise<void>;
  
  /** Register a new user and automatically log them in */
  register: (email: string, password: string) => Promise<void>;
  
  /** Invalidate the current session and clear local tokens */
  logout: () => Promise<void>;
  
  /** Redirect the browser to the Google OAuth consent screen */
  googleAuth: () => void;
  
  /** Request a password reset email */
  passwordReset: (email: string) => Promise<string>;
  
  /** Manually set the user object in state */
  setUser: (user: User) => void;
  
  /** Manually set the auth token and mark as authenticated */
  setToken: (token: string) => void;
  
  /** Clear any authentication errors from state */
  clearError: () => void;
  
  /** Verify if a stored token is still valid on app load */
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
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
    });
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
      set({ user, isAuthenticated: true });
    } catch {
      clearToken();
      set({ user: null, isAuthenticated: false });
    }
  },
}));
