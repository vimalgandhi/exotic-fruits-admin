import { describe, it, expect } from 'vitest'
import {
  categorizeError,
  formatError,
  isAuthError,
  isNetworkError,
  getErrorMessage,
} from '@/utils/errorHandler'

describe('errorHandler', () => {
  describe('categorizeError', () => {
    it('categorizes 401 response as AUTH error', () => {
      const err = { response: { status: 401, data: { message: 'Unauthorized' } } }
      const result = categorizeError(err)
      expect(result.category).toBe('AUTH')
      expect(result.statusCode).toBe(401)
    })

    it('categorizes 404 response as NOT_FOUND', () => {
      const err = { response: { status: 404, data: {} } }
      expect(categorizeError(err).category).toBe('NOT_FOUND')
    })

    it('categorizes 500 response as SERVER error', () => {
      const err = { response: { status: 500, data: { message: 'Internal error' } } }
      expect(categorizeError(err).category).toBe('SERVER')
    })

    it('categorizes network Error as NETWORK', () => {
      const err = new Error('Failed to fetch')
      expect(categorizeError(err).category).toBe('NETWORK')
    })

    it('categorizes unknown errors as UNKNOWN', () => {
      expect(categorizeError('some string').category).toBe('UNKNOWN')
    })

    it('uses response message when available', () => {
      const err = { response: { status: 400, data: { message: 'Bad request details' } } }
      expect(categorizeError(err).message).toBe('Bad request details')
    })
  })

  describe('formatError', () => {
    it('returns the error message', () => {
      const appErr = { category: 'AUTH' as const, message: 'Unauthorized', statusCode: 401 }
      expect(formatError(appErr)).toBe('Unauthorized')
    })
  })

  describe('isAuthError', () => {
    it('returns true for AUTH category', () => {
      const err = { category: 'AUTH' as const, message: 'Auth failed' }
      expect(isAuthError(err)).toBe(true)
    })

    it('returns false for non-AUTH category', () => {
      const err = { category: 'SERVER' as const, message: 'Server err' }
      expect(isAuthError(err)).toBe(false)
    })
  })

  describe('isNetworkError', () => {
    it('returns true for NETWORK category', () => {
      const err = { category: 'NETWORK' as const, message: 'No connection' }
      expect(isNetworkError(err)).toBe(true)
    })
  })

  describe('getErrorMessage', () => {
    it('extracts readable message from any error', () => {
      const err = new Error('Something went wrong')
      expect(getErrorMessage(err)).toBe('Something went wrong')
    })

    it('handles axios error with response', () => {
      const err = { response: { status: 403, data: { message: 'Forbidden' } } }
      expect(getErrorMessage(err)).toBe('Forbidden')
    })
  })
})
