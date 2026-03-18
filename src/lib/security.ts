import { z } from 'zod'

/**
 * Strip HTML tags from a string to prevent XSS when rendering user input.
 * Applies the strip repeatedly until no more tags are found.
 */
export function stripHtml(input: string): string {
  let result = input
  let previous: string
  do {
    previous = result
    result = result.replace(/<[^>]*>/g, '')
  } while (result !== previous)
  return result.trim()
}

/**
 * Truncate a string to a maximum length, appending an ellipsis if truncated.
 */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return `${input.slice(0, maxLength).trimEnd()}…`
}

/**
 * Escape characters that have special meaning in HTML to prevent injection.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Sanitise a string for safe display: strip HTML then escape remaining chars.
 */
export function sanitise(input: string): string {
  return escapeHtml(stripHtml(input))
}

// ---------------------------------------------------------------------------
// Reusable Zod schemas for common input fields
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .transform((v) => v.toLowerCase().trim())

export const indianMobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')

export const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits')

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be 100 characters or fewer')
  .transform((v) => sanitise(v))

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * Validate that a value is a safe absolute URL (http/https only).
 */
export function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
