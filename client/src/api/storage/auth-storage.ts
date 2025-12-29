/**
 * Authentication Storage Service
 * Handles localStorage operations for authentication data
 */

import { AUTH_STORAGE_KEY } from '../../config/pocketbase.config';
import type { UserRecord } from '../../types/pocketbase.types';

/**
 * Stored authentication data structure
 */
export interface StoredAuthData {
  token: string;
  model: UserRecord;
}

/**
 * Authentication storage service
 */
export class AuthStorageService {
  /**
   * Save authentication data to localStorage
   */
  public static save(token: string, model: UserRecord): void {
    try {
      const authData: StoredAuthData = { token, model };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      console.log('✓ Auth data saved to localStorage');
    } catch (error) {
      console.error('✗ Failed to save auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Load authentication data from localStorage
   */
  public static load(): StoredAuthData | null {
    try {
      const authDataStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authDataStr) {
        return null;
      }

      const authData = JSON.parse(authDataStr) as StoredAuthData;

      if (!authData.token || !authData.model) {
        console.warn('⚠ Invalid auth data structure in localStorage');
        this.clear();
        return null;
      }

      return authData;
    } catch (error) {
      console.error('✗ Failed to load auth data:', error);
      this.clear();
      return null;
    }
  }

  /**
   * Clear authentication data from localStorage
   */
  public static clear(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('✓ Auth data cleared from localStorage');
    } catch (error) {
      console.error('✗ Failed to clear auth data:', error);
    }
  }

  /**
   * Check if authentication data exists
   */
  public static hasAuthData(): boolean {
    return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
  }
}
