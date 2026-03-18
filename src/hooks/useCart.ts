import { useCartStore } from '@/store/cartStore'

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, updateUnit, clearCart, getTotal, getItemCount } =
    useCartStore()

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateUnit,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
  }
}
