/**
 * User Management API endpoints
 * Maps to: GET /users/me, PATCH /users/me
 */

import { get, patch } from './client';
import type { User } from '../types';

/** GET /users/me — Get authenticated user profile */
export function getProfile(): Promise<User> {
  return get<User>('/users/me');
}

/** PATCH /users/me — Update user profile settings */
export function updateProfile(data: Partial<Pick<User, 'full_name' | 'timezone'>>): Promise<User> {
  return patch<User>('/users/me', data);
}
