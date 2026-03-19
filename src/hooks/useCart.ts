import { useCallback } from 'react'
import { useCartStore } from '@/store/cartStore'
import * as api from '@/lib/api'
import { Product, PriceListItem } from '@/types'

export function useCart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateUnit,
    clearCart: storeClearCart,
    getTotal,
    getItemCount,
  } = useCartStore()

  /** Sync cart with backend – call after login */
  const syncCart = useCallback(async () => {
    try {
      const data = await api.getCart() as { items?: unknown[] }
      return data
    } catch {
      // If backend fetch fails we silently fall back to local store
      return null
    }
  }, [])

  const addToCart = useCallback(
    async (product: Product, quantity: number, unit?: PriceListItem) => {
      addItem(product, quantity, unit)
      try {
        await api.addToCart(product.id, quantity)
      } catch {
        // keep local state even if backend fails
      }
    },
    [addItem]
  )

  const removeFromCart = useCallback(
    async (productId: string) => {
      removeItem(productId)
      try {
        await api.removeFromCart(productId)
      } catch {
        // keep local state even if backend fails
      }
    },
    [removeItem]
  )

  const updateCartItemQuantity = useCallback(
    async (productId: string, quantity: number) => {
      updateQuantity(productId, quantity)
      try {
        await api.updateCartItem(productId, quantity)
      } catch {
        // keep local state even if backend fails
      }
    },
    [updateQuantity]
  )

  const clearCart = useCallback(async () => {
    storeClearCart()
    try {
      await api.clearCart()
    } catch {
      // keep local state even if backend fails
    }
  }, [storeClearCart])

  return {
    items,
    cartTotal: getTotal(),
    itemCount: getItemCount(),
    addToCart,
    removeFromCart,
    updateCartItem: updateCartItemQuantity,
    updateUnit,
    clearCart,
    syncCart,
    // keep legacy names for backward compat
    addItem,
    removeItem,
    updateQuantity,
    total: getTotal(),
  }
}
