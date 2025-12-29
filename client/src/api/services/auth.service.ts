/**
 * Authentication Service
 * Handles authentication operations with PocketBase
 */

import { pb } from '../pocketbase.client';
import { AuthStorageService } from '../storage';
import { COLLECTIONS, TOKEN_REFRESH_INTERVAL } from '../../config/pocketbase.config';
import type { UserRecord } from '../../types/pocketbase.types';
import type { LoginParams, UserIdentity } from '../../types/react-admin.types';

/**
 * Authentication service
 */
export class AuthService {
  private static refreshInterval: NodeJS.Timeout | null = null;
  private static isAdmin: boolean = false;

  /**
   * Initialize authentication service
   * - Restore session from localStorage
   * - Setup auth change listener
   * - Start token refresh interval
   */
  public static initialize(): void {
    this.restoreSession();
    this.setupAuthChangeListener();
    this.startTokenRefresh();
  }

  /**
   * Login with username and password
   * Automatically tries admin login first, then falls back to regular user
   */
  public static async login(params: LoginParams): Promise<void> {
    const { username, password } = params;

    try {
      // Сначала пытаемся войти как администратор (используем коллекцию _superusers)
      try {
        const authData = await pb.collection('_superusers').authWithPassword(username, password);

        if (authData && pb.authStore.token && pb.authStore.model) {
          this.isAdmin = true;
          AuthStorageService.save(pb.authStore.token, pb.authStore.model as UserRecord);
          console.log('✓ Login successful as ADMIN, session saved');
          return;
        }
      } catch (adminError) {
        // Если не удалось войти как администратор, пробуем обычного пользователя
        console.log('⚠ Not an admin, trying regular user login...');
      }

      // Пытаемся войти как обычный пользователь
      const authData = await pb.collection(COLLECTIONS.USERS).authWithPassword(username, password);

      if (authData && pb.authStore.token && pb.authStore.model) {
        this.isAdmin = false;
        AuthStorageService.save(pb.authStore.token, pb.authStore.model as UserRecord);
        console.log('✓ Login successful as USER, session saved');
      }
    } catch (error) {
      console.error('✗ Login failed:', error);
      throw new Error('Неверный логин или пароль');
    }
  }

  /**
   * Logout and clear session
   */
  public static logout(): void {
    pb.authStore.clear();
    AuthStorageService.clear();
    this.isAdmin = false;
    this.stopTokenRefresh();
    console.log('✓ Logout successful');
  }

  /**
   * Check if user is authenticated
   */
  public static isAuthenticated(): boolean {
    const hasToken = !!pb.authStore.token;
    const hasModel = !!pb.authStore.model;

    if (!hasToken || !hasModel) {
      console.warn('⚠ checkAuth failed - no token or model in authStore');
      return false;
    }

    return true;
  }

  /**
   * Check if current user is admin
   */
  public static isAdminUser(): boolean {
    return this.isAdmin;
  }

  /**
   * Get current user identity
   */
  public static getUserIdentity(): UserIdentity | null {
    const user = pb.authStore.model as UserRecord | null;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      fullName: user.username || user.email,
      avatar: user.avatar,
    };
  }

  /**
   * Handle authentication errors
   */
  public static handleAuthError(error: any): boolean {
    const status = error?.status;

    if (status === 401 || status === 403) {
      console.warn('⚠ Auth error detected, clearing session');
      this.logout();
      return true;
    }

    return false;
  }

  /**
   * Restore session from localStorage
   */
  private static restoreSession(): void {
    const authData = AuthStorageService.load();

    if (authData && authData.token && authData.model) {
      pb.authStore.save(authData.token, authData.model);

      // Определяем тип пользователя по токену
      try {
        const payload = JSON.parse(atob(authData.token.split('.')[1]));
        this.isAdmin = payload.type === 'admin';
        console.log(`✓ Session restored from localStorage (${this.isAdmin ? 'ADMIN' : 'USER'})`);
      } catch (e) {
        console.log('✓ Session restored from localStorage');
      }
    }
  }

  /**
   * Setup auth change listener to persist changes
   */
  private static setupAuthChangeListener(): void {
    pb.authStore.onChange((token, model) => {
      if (token && model) {
        AuthStorageService.save(token, model as UserRecord);
      } else {
        AuthStorageService.clear();
      }
    });
  }

  /**
   * Start automatic token refresh
   */
  private static startTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      if (pb.authStore.token && pb.authStore.model) {
        const refreshPromise = this.isAdmin
          ? pb.collection('_superusers').authRefresh()
          : pb.collection(COLLECTIONS.USERS).authRefresh();

        refreshPromise
          .then(() => console.log(`✓ Token refreshed (${this.isAdmin ? 'ADMIN' : 'USER'})`))
          .catch((err) => {
            console.warn('⚠ Token refresh failed:', err.message);
          });
      }
    }, TOKEN_REFRESH_INTERVAL);
  }

  /**
   * Stop automatic token refresh
   */
  private static stopTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
