export type ErrorCategory =
  | 'NETWORK'
  | 'AUTH'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'SERVER'
  | 'UNKNOWN'

export interface AppError {
  category: ErrorCategory
  message: string
  statusCode?: number
  original?: unknown
}

/** Map an HTTP status code to an error category */
function categorizeByStatus(status: number): ErrorCategory {
  if (status === 401 || status === 403) return 'AUTH'
  if (status === 404) return 'NOT_FOUND'
  if (status === 422 || status === 400) return 'VALIDATION'
  if (status >= 500) return 'SERVER'
  return 'UNKNOWN'
}

/** Human-readable default messages per category */
const DEFAULT_MESSAGES: Record<ErrorCategory, string> = {
  NETWORK: 'Network error – please check your connection and try again.',
  AUTH: 'Authentication failed – please log in again.',
  VALIDATION: 'The request contains invalid data.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'A server error occurred – please try again later.',
  UNKNOWN: 'An unexpected error occurred.',
}

/** Convert any thrown value into a structured AppError */
export function categorizeError(error: unknown): AppError {
  // Axios-style error with response
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response: unknown }).response === 'object' &&
    (error as { response: { status: number; data?: { message?: string } } })
      .response !== null
  ) {
    const axiosErr = error as {
      response: { status: number; data?: { message?: string } }
    }
    const status = axiosErr.response.status
    const category = categorizeByStatus(status)
    const message =
      axiosErr.response.data?.message ?? DEFAULT_MESSAGES[category]
    return { category, message, statusCode: status, original: error }
  }

  // Fetch-based Error thrown by handleResponse
  if (error instanceof Error) {
    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('network')
    ) {
      return {
        category: 'NETWORK',
        message: DEFAULT_MESSAGES.NETWORK,
        original: error,
      }
    }
    return { category: 'UNKNOWN', message: error.message, original: error }
  }

  return {
    category: 'UNKNOWN',
    message: DEFAULT_MESSAGES.UNKNOWN,
    original: error,
  }
}

/** Format an AppError into a display-friendly string */
export function formatError(error: AppError): string {
  return error.message
}

/** Returns true when the error is an authentication / authorisation failure */
export function isAuthError(error: AppError): boolean {
  return error.category === 'AUTH'
}

/** Returns true when the error is caused by network connectivity issues */
export function isNetworkError(error: AppError): boolean {
  return error.category === 'NETWORK'
}

/** Convenience wrapper – categorise and format in one call */
export function getErrorMessage(error: unknown): string {
  return formatError(categorizeError(error))
}
