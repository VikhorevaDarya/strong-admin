/**
 * PocketBase Configuration
 * Centralized configuration for PocketBase client
 */

/**
 * PocketBase API URL
 */
export const POCKETBASE_URL = process.env.REACT_APP_POCKETBASE_URL || 'http://127.0.0.1:8090';

/**
 * Authentication storage key
 */
export const AUTH_STORAGE_KEY = 'pocketbase_auth';

/**
 * Token refresh interval in milliseconds (5 minutes)
 */
export const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000;

/**
 * Collection names for type safety
 */
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  WAREHOUSES: 'warehouses',
} as const;

/**
 * Expand relations configuration
 */
export const EXPAND_CONFIG = {
  products: 'warehouse',
  warehouses: 'products',
} as const;
