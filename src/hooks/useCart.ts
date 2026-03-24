import { useCallback, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from './useAuth'
import { PriceListItem, Product } from '@/types'

export function useCart() {
  const { isAuthenticated } = useAuth()
  const {
    items,
    isLoading,
    setLoading,
    setItems,
    addItem: addToLocalStore,
    removeItem,
    updateQuantity,
    updateUnit,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore()

  // Fetch cart from backend on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartFromBackend()
    } else {
      // Clear cart if user logs out
      clearCart()
    }
  }, [isAuthenticated])

  const fetchCartFromBackend = useCallback(async () => {
    try {
      setLoading(true)
      const cartItems = await getCart()
      setItems(cartItems)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      // Don't show error toast on initial load - it might just mean empty cart
    } finally {
      setLoading(false)
    }
  }, [setLoading, setItems])

  const addItem = useCallback(
    async (product: Product, quantity: number, unit?: PriceListItem) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart')
        return
      }

      try {
        setLoading(true)
        // Call backend API
        await apiAddToCart(product.id, quantity, unit as any)
        // Update local store optimistically
        addToLocalStore(product, quantity, unit)
        toast.success('Added to cart!')
        // Fetch latest cart from backend to ensure consistency
        await fetchCartFromBackend()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to add to cart',
        )
        console.error('Add to cart error:', error)
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, setLoading, addToLocalStore, fetchCartFromBackend],
  )

  const updateItem = useCallback(
    async (productId: string, quantity: number, unit?: PriceListItem) => {
      if (!isAuthenticated) {
        toast.error('Please login to update cart')
        return
      }

      try {
        setLoading(true)
        // Find the cart item ID
        const existingItem = items.find(
          (item) => item.product.id === productId,
        )
        if (!existingItem || !existingItem.id) {
          throw new Error('Cart item not found')
        }

        // Call backend API
        await apiUpdateCartItem(existingItem.id.toString(), quantity, unit as any)
        // Update local store
        if (quantity > 0) {
          updateQuantity(productId, quantity)
          if (unit) {
            updateUnit(productId, unit)
          }
        }
        // Fetch latest cart from backend
        await fetchCartFromBackend()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to update cart item',
        )
        console.error('Update cart error:', error)
      } finally {
        setLoading(false)
      }
    },
    [
      isAuthenticated,
      items,
      setLoading,
      updateQuantity,
      updateUnit,
      fetchCartFromBackend,
    ],
  )

  const removeItemFromCart = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) {
        toast.error('Please login to update cart')
        return
      }

      try {
        setLoading(true)
        // Find the cart item ID
        const existingItem = items.find(
          (item) => item.product.id === productId,
        )
        if (!existingItem || !existingItem.id) {
          throw new Error('Cart item not found')
        }

        // Call backend API
        await apiRemoveFromCart(existingItem.id.toString())
        // Update local store
        removeItem(productId)
        toast.success('Removed from cart')
        // Fetch latest cart from backend
        await fetchCartFromBackend()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to remove from cart',
        )
        console.error('Remove from cart error:', error)
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, items, setLoading, removeItem, fetchCartFromBackend],
  )

  const clearCartItems = useCallback(async () => {
    if (!isAuthenticated) {
      clearCart()
      return
    }

    try {
      setLoading(true)
      // Call backend API
      await apiClearCart()
      // Update local store
      clearCart()
      toast.success('Cart cleared')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to clear cart',
      )
      console.error('Clear cart error:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, setLoading, clearCart])

  return {
    items,
    isLoading,
    addItem,
    removeItem: removeItemFromCart,
    updateItem,
    clearCart: clearCartItems,
    total: getTotal(),
    itemCount: getItemCount(),
    refetchCart: fetchCartFromBackend,
  }
}
