import { create } from 'zustand';
import type { User, AuthState, LoginCredentials } from '@/types';
import { setToken, removeToken, setStoredUser, removeStoredUser, getStoredUser, getToken } from '@/lib/auth';
import apiClient from '@/lib/api';
import { MOCK_CREDENTIALS, MOCK_USER } from '@/lib/mock-data';

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
    const token = getToken();
    const user = getStoredUser<User>();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      let token: string;
      let user: User;

      try {
        const response = await apiClient.post<{ data: { user: User; token: string } }>(
          '/auth/login',
          credentials
        );
        token = response.data.data.token;
        user = response.data.data.user;
      } catch {
        // Fall back to mock credentials when the backend is not available
        if (
          credentials.email !== MOCK_CREDENTIALS.email ||
          credentials.password !== MOCK_CREDENTIALS.password
        ) {
          throw new Error('Invalid email or password');
        }
        token = 'mock_token_' + Date.now();
        user = MOCK_USER;
      }

      setToken(token);
      setStoredUser(user);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeToken();
    removeStoredUser();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
