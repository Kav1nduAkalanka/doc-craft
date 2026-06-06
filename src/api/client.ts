/**
 * Centralized API Client for DocCraft
 * All HTTP requests to the backend go through this module.
 * Base URL is configured via VITE_API_BASE_URL environment variable.
 */

import type { ApiError } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/v1';

/** Get the auth token from localStorage */
function getToken(): string | null {
  return localStorage.getItem('doccraft_token');
}

/** Set the auth token in localStorage */
export function setToken(token: string): void {
  localStorage.setItem('doccraft_token', token);
}

/** Clear the auth token */
export function clearToken(): void {
  localStorage.removeItem('doccraft_token');
}

/** Custom error class for API errors */
export class ApiRequestError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = body.error;
    this.details = body.details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  responseType?: 'json' | 'blob';
}

/**
 * Core fetch wrapper.
 * - Automatically injects Bearer token for authenticated requests
 * - Serializes JSON bodies
 * - Parses error responses into ApiRequestError
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    responseType = 'json',
  } = options;

  const url = `${BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {
        error: 'unknown_error',
        message: `Request failed with status ${response.status}`,
      };
    }
    throw new ApiRequestError(response.status, errorBody);
  }

  if (responseType === 'blob') {
    return (await response.blob()) as unknown as T;
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

/** Shorthand for GET requests */
export function get<T>(endpoint: string, auth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', auth });
}

/** Shorthand for POST requests */
export function post<T>(endpoint: string, body?: unknown, auth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, auth });
}

/** Shorthand for PATCH requests */
export function patch<T>(endpoint: string, body?: unknown, auth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body, auth });
}
