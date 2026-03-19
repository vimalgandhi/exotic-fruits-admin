import { useState, useCallback } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import { Product } from '@/types'
import { toast } from 'sonner'
import * as api from '@/lib/api'

export function useWishlist() {
  const { items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist } =
    useWishlistStore()

  const [loading, setLoading] = useState(false)

  /** Fetch the user's server-side wishlist */
  const fetchWishlist = useCallback(async () => {
    setLoading(true)
    try {
      return await api.getWishlist()
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const addToWishlist = useCallback(
    async (product: Product) => {
      addItem(product)
      toast.success(`${product.name} added to Wishlist ❤️`)
      try {
        await api.addToWishlist(product.id)
      } catch {
        // keep local state even if backend fails
      }
    },
    [addItem]
  )

  const removeFromWishlist = useCallback(
    async (product: Product) => {
      removeItem(product.id)
      toast.info(`${product.name} removed from Wishlist`)
      try {
        await api.removeFromWishlist(product.id)
      } catch {
        // keep local state even if backend fails
      }
    },
    [removeItem]
  )

  const toggle = useCallback(
    async (product: Product) => {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product)
      } else {
        await addToWishlist(product)
      }
    },
    [addToWishlist, removeFromWishlist, isInWishlist]
  )

  return {
    items,
    wishlistCount: items.length,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist: toggle,
    isInWishlist,
    clearWishlist,
    fetchWishlist,
    // legacy compat
    toggleItem,
  }
}
