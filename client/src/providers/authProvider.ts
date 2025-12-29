/**
 * React Admin Auth Provider
 * Integrates AuthService with React Admin
 */

import { AuthService } from '../api/services';
import type { AuthProvider as RAAuthProvider } from 'react-admin';

/**
 * Initialize auth service on module load
 */
AuthService.initialize();

/**
 * Auth provider implementation for React Admin
 */
const authProvider: RAAuthProvider = {
  /**
   * Login user with username and password
   */
  login: async (params) => {
    await AuthService.login(params);
  },

  /**
   * Logout user and clear session
   */
  logout: async () => {
    AuthService.logout();
  },

  /**
   * Check if user is authenticated
   */
  checkAuth: async () => {
    if (!AuthService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
  },

  /**
   * Handle errors from API calls
   */
  checkError: async (error) => {
    const shouldLogout = AuthService.handleAuthError(error);
    if (shouldLogout) {
      throw new Error('Authentication error');
    }
  },

  /**
   * Get current user identity
   */
  getIdentity: async () => {
    const identity = AuthService.getUserIdentity();
    if (!identity) {
      throw new Error('User not found');
    }
    return identity;
  },

  /**
   * Get user permissions (placeholder)
   */
  getPermissions: async () => {
    return Promise.resolve();
  },
};

export default authProvider;
