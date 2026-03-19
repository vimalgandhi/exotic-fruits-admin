export const AUTH_SESSION_KEY = 'auth_session';
export const AUTH_USER_KEY = 'auth_user';

/**
 * Sets a simple session presence cookie so the middleware can detect
 * whether a user is currently logged in — no secret value is carried.
 */
export function setSession(days = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${AUTH_SESSION_KEY}=1;expires=${expires.toUTCString()};path=/;SameSite=Strict${secure}`;
}

export function clearSession(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_SESSION_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
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
  clearSession();
  removeStoredUser();
}
