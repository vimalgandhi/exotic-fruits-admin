import { create } from 'zustand'
import { Product } from '@/types'

interface ProductState {
  products: Product[]
  selectedCategory: string | null
  loading: boolean
  searchQuery: string
  setProducts: (products: Product[]) => void
  setCategory: (category: string | null) => void
  setLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedCategory: null,
  loading: false,
  searchQuery: '',
  setProducts: (products: Product[]) => set({ products }),
  setCategory: (category: string | null) =>
    set({ selectedCategory: category }),
  setLoading: (loading: boolean) => set({ loading }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}))
