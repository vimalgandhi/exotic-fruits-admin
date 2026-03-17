export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + AUTH_TOKEN_KEY + '=([^;]+)'));
  return match ? match[2] : null;
}

export function setToken(token: string, days = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${AUTH_TOKEN_KEY}=${token};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

export function removeToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function getStoredUser<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const userData = localStorage.getItem(AUTH_USER_KEY);
    return userData ? (JSON.parse(userData) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_USER_KEY);
}

export function clearAuth(): void {
  removeToken();
  removeStoredUser();
}
