/**
 * Centralized logger for the Admin application.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('useProducts', 'Fetching products');
 *   logger.warn('useCategories', 'Using fallback mock data', error);
 *   logger.error('useProducts/fetchProducts', 'Failed to fetch products', error);
 *
 * Logged entries are also persisted to sessionStorage under the key
 * 'ef_admin_logs' so they survive same-session page navigations.
 * Retrieve them at any time with:
 *   import { logger } from '@/lib/logger';
 *   console.table(logger.getLogs());
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  context: string;
  message: string;
  details?: Record<string, unknown>;
}

// Maximum number of entries kept in sessionStorage.
const MAX_STORED = 200;
const STORAGE_KEY = 'ef_admin_logs';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function now(): string {
  return new Date().toISOString();
}

/**
 * Extracts a plain serialisable object from any thrown value.
 * Axios errors are handled specially so you can see method, URL, status,
 * and the response body all in one place.
 */
export function extractErrorDetails(err: unknown): Record<string, unknown> {
  if (err === null || err === undefined) return {};

  // Axios errors expose `isAxiosError`
  if (
    typeof err === 'object' &&
    'isAxiosError' in err &&
    (err as { isAxiosError: boolean }).isAxiosError
  ) {
    const axiosErr = err as unknown as {
      message: string;
      code?: string;
      config?: {
        method?: string;
        url?: string;
        baseURL?: string;
        data?: unknown;
      };
      response?: {
        status: number;
        statusText: string;
        data: unknown;
        headers?: unknown;
      };
    };

    const url =
      axiosErr.config?.baseURL && axiosErr.config?.url
        ? `${axiosErr.config.baseURL}${axiosErr.config.url}`
        : (axiosErr.config?.url ?? '');

    return {
      message: axiosErr.message,
      code: axiosErr.code,
      method: axiosErr.config?.method?.toUpperCase(),
      url,
      requestBody: axiosErr.config?.data,
      status: axiosErr.response?.status,
      statusText: axiosErr.response?.statusText,
      responseBody: axiosErr.response?.data,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: err.stack,
    };
  }

  return { raw: String(err) };
}

function buildEntry(
  level: LogLevel,
  context: string,
  message: string,
  details?: Record<string, unknown>,
): LogEntry {
  return { level, timestamp: now(), context, message, details };
}

function persist(entry: LogEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const logs: LogEntry[] = raw ? (JSON.parse(raw) as LogEntry[]) : [];
    logs.push(entry);
    if (logs.length > MAX_STORED) {
      logs.splice(0, logs.length - MAX_STORED);
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // sessionStorage might be unavailable (private mode, full storage) – ignore
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const logger = {
  info(context: string, message: string, details?: Record<string, unknown>): void {
    const entry = buildEntry('info', context, message, details);
    // eslint-disable-next-line no-console
    console.info(`[INFO]  [${entry.timestamp}] [${context}] ${message}`, details ?? '');
    persist(entry);
  },

  warn(context: string, message: string, err?: unknown): void {
    const details = extractErrorDetails(err);
    const entry = buildEntry('warn', context, message, details);
    // eslint-disable-next-line no-console
    console.warn(`[WARN]  [${entry.timestamp}] [${context}] ${message}`, details);
    persist(entry);
  },

  error(context: string, message: string, err?: unknown): void {
    const details = extractErrorDetails(err);
    const entry = buildEntry('error', context, message, details);
    // eslint-disable-next-line no-console
    console.error(`[ERROR] [${entry.timestamp}] [${context}] ${message}`, details);
    persist(entry);
  },

  /** Returns all log entries stored in sessionStorage for this session. */
  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LogEntry[]) : [];
    } catch {
      return [];
    }
  },

  /** Returns only error-level entries. */
  getErrors(): LogEntry[] {
    return this.getLogs().filter((e) => e.level === 'error');
  },

  /** Removes all stored log entries. */
  clearLogs(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};

export default logger;
