/**
 * Auth API endpoints
 *
 * Maps to:
 *   POST /auth/register       — Email/password registration
 *   POST /auth/login          — Email/password login
 *   POST /auth/logout         — Invalidate current session
 *   POST /auth/password-reset — Send password reset email
 *   POST /auth/guest          — Create anonymous guest session
 *   GET  /auth/oauth/google   — Redirect to Google OAuth consent screen
 *   GET  /users/me            — Fetch authenticated user profile
 */

import { post, get, API_BASE_URL } from './client';
import type { AuthResponse, RegisterResponse } from '../types';

/** POST /auth/register — Register with email and password */
export function register(email: string, password: string): Promise<RegisterResponse> {
  return post<RegisterResponse>('/auth/register', { email, password }, false);
}

/** POST /auth/login — Log in with email and password */
export function login(email: string, password: string): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', { email, password }, false);
}

/** POST /auth/logout — Invalidate current session */
export function logout(): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/logout');
}

/** POST /auth/password-reset — Send password reset email */
export function passwordReset(email: string): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/password-reset', { email }, false);
}

/** GET /auth/oauth/google — Redirect to Google OAuth */
export function getGoogleOAuthUrl(redirectTo?: string): string {
  const params = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : '';
  return `${API_BASE_URL}/auth/oauth/google${params}`;
}

/** GET /users/me — Get current authenticated user profile */
export function getMe() {
  return get<import('../types').User>('/users/me');
}
