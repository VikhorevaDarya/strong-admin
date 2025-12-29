/**
 * PocketBase Client
 * Singleton instance of PocketBase client with configuration
 */

import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '../config/pocketbase.config';

/**
 * Create and configure PocketBase client instance
 */
class PocketBaseClient {
  private static instance: PocketBase | null = null;

  /**
   * Get singleton instance of PocketBase client
   */
  public static getInstance(): PocketBase {
    if (!PocketBaseClient.instance) {
      PocketBaseClient.instance = new PocketBase(POCKETBASE_URL);
      PocketBaseClient.instance.autoCancellation(false);
    }
    return PocketBaseClient.instance;
  }

  /**
   * Reset instance (useful for testing)
   */
  public static resetInstance(): void {
    PocketBaseClient.instance = null;
  }
}

/**
 * Export singleton instance
 */
export const pb = PocketBaseClient.getInstance();

/**
 * Export client class for testing
 */
export { PocketBaseClient };
