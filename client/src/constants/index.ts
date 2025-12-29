/**
 * Application constants
 */

/**
 * Application name
 */
export const APP_NAME = 'Strong Admin';

/**
 * Application version
 */
export const APP_VERSION = '2.0.0';

/**
 * Resource names
 */
export const RESOURCES = {
  PRODUCTS: 'products',
  WAREHOUSES: 'warehouses',
} as const;

/**
 * Resource labels
 */
export const RESOURCE_LABELS = {
  [RESOURCES.PRODUCTS]: 'Товары',
  [RESOURCES.WAREHOUSES]: 'Склады',
} as const;
