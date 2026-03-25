import { create } from 'zustand'
import { CartItem, PriceListItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  setItems: (items: CartItem[]) => void
  addItem: (product: Product, quantity: number, unit?: PriceListItem) => CartItem
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateUnit: (productId: string, unit: PriceListItem) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setItems: (items: CartItem[]) => {
    // Ensure all items have unitPrice and totalPrice calculated
    const itemsWithPrices = items.map((item, idx) => {
      const unitPrice = item.selectedUnit 
        ? item.selectedUnit.afterDiscountPrice 
        : (item.unitPrice || item.product?.price || 0)
      const totalPrice = unitPrice * item.quantity
      
      return {
        ...item,
        unitPrice,
        totalPrice,
      }
    })
    set({ items: itemsWithPrices })
  },

  addItem: (product: Product, quantity: number, unit?: PriceListItem) => {
    const state = get()
    let updatedItem: CartItem | undefined

    // Calculate unit price based on selected unit or product price
    const unitPrice = unit ? unit.afterDiscountPrice : (product.price || 0)
    const totalPrice = unitPrice * quantity

    set((currentState) => {
      // Find existing item with SAME product AND SAME selected unit/price
      let existing = null
      if (currentState.items.length > 0) {
        existing = currentState.items.find((item) => {
          // Must have same product
          if (item.product.id !== product.id) return false
          
          // Check if selected unit matches
          const itemSelectedUnit = item.selectedUnit
          const newSelectedUnit = unit
          
          // Both null = match
          if (!itemSelectedUnit && !newSelectedUnit) return true
          
          // Both exist and same unitId = match
          if (itemSelectedUnit && newSelectedUnit && itemSelectedUnit.unitId === newSelectedUnit.unitId) return true
          
          return false
        })
      }

      if (existing) {
        const selectedUnit = unit ?? existing.selectedUnit
        const existingUnitPrice = selectedUnit 
          ? selectedUnit.afterDiscountPrice 
          : (product.price || 0)
        const newTotalQuantity = existing.quantity + quantity
        updatedItem = {
          ...existing,
          quantity: newTotalQuantity,
          selectedUnit,
          unitPrice: existingUnitPrice,
          totalPrice: existingUnitPrice * newTotalQuantity,
        }
        return {
          items: currentState.items.map((item) =>
            item.product.id === product.id && 
            ((item.selectedUnit?.unitId === unit?.unitId) || (!item.selectedUnit && !unit))
              ? updatedItem! 
              : item,
          ),
        }
      }
      updatedItem = { product, quantity, selectedUnit: unit, unitPrice, totalPrice }
      return { items: [...currentState.items, updatedItem] }
    })

    return updatedItem || { product, quantity, selectedUnit: unit, unitPrice, totalPrice }
  },

  removeItem: (productId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id === productId) {
          const unitPrice = item.selectedUnit 
            ? item.selectedUnit.afterDiscountPrice 
            : (item.product.price || 0)
          return { 
            ...item, 
            quantity,
            totalPrice: unitPrice * quantity,
          }
        }
        return item
      }),
    })),

  updateUnit: (productId: string, unit: PriceListItem) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id === productId) {
          const unitPrice = unit.afterDiscountPrice
          return { 
            ...item, 
            selectedUnit: unit,
            unitPrice,
            totalPrice: unitPrice * item.quantity,
          }
        }
        return item
      }),
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
}))
