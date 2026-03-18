import { useCallback } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import { Product } from '@/types'
import { toast } from 'sonner'

export function useWishlist() {
  const { items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist } =
    useWishlistStore()

  const addToWishlist = useCallback(
    (product: Product) => {
      addItem(product)
      toast.success(`${product.name} added to Wishlist ❤️`)
    },
    [addItem]
  )

  const removeFromWishlist = useCallback(
    (product: Product) => {
      removeItem(product.id)
      toast.info(`${product.name} removed from Wishlist`)
    },
    [removeItem]
  )

  const toggle = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) {
        removeItem(product.id)
        toast.info(`${product.name} removed from Wishlist`)
      } else {
        addItem(product)
        toast.success(`${product.name} added to Wishlist ❤️`)
      }
    },
    [addItem, removeItem, isInWishlist]
  )

  return {
    items,
    wishlistCount: items.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist: toggle,
    isInWishlist,
    clearWishlist,
  }
}
