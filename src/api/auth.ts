/**
 * Auth API endpoints
 * Maps to: POST /auth/register, POST /auth/login, POST /auth/logout,
 *          POST /auth/password-reset, POST /auth/guest, GET /auth/oauth/google
 */

import { post, get } from './client';
import type { AuthResponse, RegisterResponse, GuestSession } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/v1';

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

/** POST /auth/guest — Create anonymous guest session */
export function guestLogin(): Promise<GuestSession> {
  return post<GuestSession>('/auth/guest', undefined, false);
}

/** GET /auth/oauth/google — Redirect to Google OAuth */
export function getGoogleOAuthUrl(redirectTo?: string): string {
  const params = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : '';
  return `${BASE_URL}/auth/oauth/google${params}`;
}

/** GET /users/me — Get current authenticated user profile */
export function getMe() {
  return get<import('../types').User>('/users/me');
}
