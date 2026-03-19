import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  validateEmail,
  validatePassword,
  isStrongPassword,
  validateCartQuantity,
  validateCartItem,
  validatePaymentAmount,
  validatePaymentData,
} from '@/utils/validators'

describe('validators', () => {
  describe('Email validation', () => {
    it('accepts valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@domain.co.in')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('@nodomain.com')).toBe(false)
      expect(isValidEmail('missing@')).toBe(false)
    })

    it('validateEmail returns null for valid email', () => {
      expect(validateEmail('valid@test.com')).toBeNull()
    })

    it('validateEmail returns error for empty email', () => {
      expect(validateEmail('')).toBeTruthy()
    })

    it('validateEmail returns error for invalid email', () => {
      expect(validateEmail('invalid')).toBeTruthy()
    })
  })

  describe('Password validation', () => {
    it('accepts strong passwords', () => {
      expect(isStrongPassword('Secure1pass')).toBe(true)
      expect(isStrongPassword('MyP4ssword')).toBe(true)
    })

    it('rejects passwords shorter than 8 chars', () => {
      const result = validatePassword('Sh0rt')
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('8 characters'))).toBe(true)
    })

    it('rejects passwords missing uppercase', () => {
      const result = validatePassword('lowercase1')
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('uppercase'))).toBe(true)
    })

    it('rejects passwords missing digit', () => {
      const result = validatePassword('NoDigitsHere')
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('digit'))).toBe(true)
    })
  })

  describe('Cart validation', () => {
    it('accepts valid quantity', () => {
      expect(validateCartQuantity(1).valid).toBe(true)
      expect(validateCartQuantity(50).valid).toBe(true)
    })

    it('rejects zero or negative quantity', () => {
      expect(validateCartQuantity(0).valid).toBe(false)
      expect(validateCartQuantity(-1).valid).toBe(false)
    })

    it('rejects quantity over 100', () => {
      expect(validateCartQuantity(101).valid).toBe(false)
    })

    it('validateCartItem rejects empty productId', () => {
      expect(validateCartItem('', 1).valid).toBe(false)
    })

    it('validateCartItem passes with valid inputs', () => {
      expect(validateCartItem('product123', 2).valid).toBe(true)
    })
  })

  describe('Payment validation', () => {
    it('validatePaymentAmount accepts positive numbers', () => {
      expect(validatePaymentAmount(100)).toBeNull()
      expect(validatePaymentAmount(0.01)).toBeNull()
    })

    it('validatePaymentAmount rejects zero and negative', () => {
      expect(validatePaymentAmount(0)).toBeTruthy()
      expect(validatePaymentAmount(-50)).toBeTruthy()
    })

    it('validatePaymentData accepts valid payment data', () => {
      expect(validatePaymentData({ razorpay_payment_id: 'pay_1' })).toBeNull()
    })

    it('validatePaymentData rejects empty object', () => {
      expect(validatePaymentData({})).toBeTruthy()
    })
  })
})
