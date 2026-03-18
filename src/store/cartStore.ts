import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, PriceListItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number, unit?: PriceListItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateUnit: (productId: string, unit: PriceListItem) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product, quantity: number, unit?: PriceListItem) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      selectedUnit: unit ?? item.selectedUnit,
                    }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity, selectedUnit: unit }] }
        }),
      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),
      updateUnit: (productId: string, unit: PriceListItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, selectedUnit: unit } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((total, item) => {
          const unitPrice = item.selectedUnit
            ? item.selectedUnit.afterDiscountPrice
            : item.product.price
          return total + unitPrice * item.quantity
        }, 0),
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'cart-store' }
  )
)
