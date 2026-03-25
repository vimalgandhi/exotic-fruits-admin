import { create } from 'zustand';
import type { User, AuthState, LoginCredentials } from '@/types';
import { setSession, clearSession, setStoredUser, removeStoredUser, getStoredUser, getToken, setToken, removeToken } from '@/lib/auth';
import apiClient from '@/lib/api';
import { logger } from '@/lib/logger';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  initialize: () => {
    const user = getStoredUser<User>();
    const token = getToken();
    if (user) {
      set({ user, token, isAuthenticated: true });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      let user: User;
      let token: string | null = null;

      const response = await apiClient.post<{ data: { user: User; accessToken?: string } }>(
        '/auth/login',
        credentials
      );
      user = response.data.data.user;
      token = response.data.data.accessToken ?? null;
      logger.info('auth/login', 'Login successful via API', { email: credentials.email });

      setStoredUser(user);
      setSession();
      if (token) {
        setToken(token);
      }
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      logger.error('auth/login', 'Login failed', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    logger.info('auth/logout', 'User logged out');
    clearSession();
    removeStoredUser();
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
