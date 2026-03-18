import { create } from 'zustand'
import { Product, ProductFilters, SortOptionValue } from '@/types'

interface ProductState {
  products: Product[]
  selectedCategory: string | null
  loading: boolean
  searchQuery: string
  filters: ProductFilters
  sortOption: SortOptionValue
  currentPage: number
  setProducts: (products: Product[]) => void
  setCategory: (category: string | null) => void
  setLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: ProductFilters) => void
  setSortOption: (sort: SortOptionValue) => void
  setCurrentPage: (page: number) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedCategory: null,
  loading: false,
  searchQuery: '',
  filters: { priceMin: null, priceMax: null, categories: [] },
  sortOption: 'newest',
  currentPage: 1,
  setProducts: (products: Product[]) => set({ products }),
  setCategory: (category: string | null) =>
    set({ selectedCategory: category }),
  setLoading: (loading: boolean) => set({ loading }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilters: (filters: ProductFilters) => set({ filters }),
  setSortOption: (sortOption: SortOptionValue) => set({ sortOption }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
}))
