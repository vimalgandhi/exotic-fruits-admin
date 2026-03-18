import { create } from 'zustand'

interface CheckoutData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  paymentMethod: string
}

interface CheckoutState {
  orderData: CheckoutData | null
  orderId: string | null
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | null
  setOrderData: (data: CheckoutData) => void
  setOrderId: (id: string) => void
  setPaymentStatus: (status: 'PENDING' | 'PAID' | 'FAILED') => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  orderData: null,
  orderId: null,
  paymentStatus: null,
  setOrderData: (data: CheckoutData) => set({ orderData: data }),
  setOrderId: (id: string) => set({ orderId: id }),
  setPaymentStatus: (status: 'PENDING' | 'PAID' | 'FAILED') =>
    set({ paymentStatus: status }),
  reset: () => set({ orderData: null, orderId: null, paymentStatus: null }),
}))
