// ---------------------------------------------------------------------------
// Email validation
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return 'Email is required.'
  if (!isValidEmail(email)) return 'Please enter a valid email address.'
  return null
}

// ---------------------------------------------------------------------------
// Password validation
// ---------------------------------------------------------------------------

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  if (!password) {
    errors.push('Password is required.')
    return { valid: false, errors }
  }
  if (password.length < 8) errors.push('Password must be at least 8 characters.')
  if (!/[A-Z]/.test(password))
    errors.push('Password must contain at least one uppercase letter.')
  if (!/[a-z]/.test(password))
    errors.push('Password must contain at least one lowercase letter.')
  if (!/\d/.test(password))
    errors.push('Password must contain at least one digit.')
  return { valid: errors.length === 0, errors }
}

export function isStrongPassword(password: string): boolean {
  return validatePassword(password).valid
}

// ---------------------------------------------------------------------------
// Cart validation
// ---------------------------------------------------------------------------

export interface CartValidationResult {
  valid: boolean
  error: string | null
}

export function validateCartQuantity(quantity: number): CartValidationResult {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { valid: false, error: 'Quantity must be a positive whole number.' }
  }
  if (quantity > 100) {
    return { valid: false, error: 'Quantity cannot exceed 100 per item.' }
  }
  return { valid: true, error: null }
}

export function validateCartItem(
  productId: string,
  quantity: number
): CartValidationResult {
  if (!productId || !productId.trim()) {
    return { valid: false, error: 'Product ID is required.' }
  }
  return validateCartQuantity(quantity)
}

// ---------------------------------------------------------------------------
// Payment validation
// ---------------------------------------------------------------------------

export function validatePaymentAmount(amount: number): string | null {
  if (typeof amount !== 'number' || isNaN(amount))
    return 'Amount must be a valid number.'
  if (amount <= 0) return 'Amount must be greater than zero.'
  return null
}

export function validatePaymentData(data: unknown): string | null {
  if (!data || typeof data !== 'object') return 'Payment data is required.'
  const d = data as Record<string, unknown>
  if (!d.razorpay_payment_id && !d.paymentId)
    return 'Payment ID is missing from payment data.'
  return null
}
