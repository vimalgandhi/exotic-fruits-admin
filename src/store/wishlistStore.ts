import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product) =>
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) return state
          return { items: [...state.items, product] }
        }),
      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      toggleItem: (product: Product) => {
        const { items } = get()
        if (items.find((item) => item.id === product.id)) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== product.id),
          }))
        } else {
          set((state) => ({ items: [...state.items, product] }))
        }
      },
      isInWishlist: (productId: string) =>
        get().items.some((item) => item.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'wishlist-store' }
  )
)
