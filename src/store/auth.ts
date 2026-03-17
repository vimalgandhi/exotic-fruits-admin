import { create } from 'zustand';
import type { User, AuthState, LoginCredentials } from '@/types';
import { setToken, removeToken, setStoredUser, removeStoredUser, getStoredUser, getToken } from '@/lib/auth';
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
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (
        credentials.email !== MOCK_CREDENTIALS.email ||
        credentials.password !== MOCK_CREDENTIALS.password
      ) {
        throw new Error('Invalid email or password');
      }

      const token = 'mock_token_' + Date.now();
      const user = MOCK_USER;

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
