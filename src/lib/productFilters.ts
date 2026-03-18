import { Product, SortOptionValue } from '@/types'

export function filterByPrice(
  products: Product[],
  min: number | null,
  max: number | null,
): Product[] {
  if (min === null && max === null) return products
  return products.filter((p) => {
    if (min !== null && p.price < min) return false
    if (max !== null && p.price > max) return false
    return true
  })
}

export function filterByCategory(
  products: Product[],
  categories: string[],
): Product[] {
  if (categories.length === 0) return products
  return products.filter((p) => categories.includes(p.category))
}

export function sortProducts(
  products: Product[],
  sortOption: SortOptionValue,
): Product[] {
  const sorted = [...products]
  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'newest':
    case 'popular':
    default:
      return sorted
  }
}

export function paginateProducts<T>(
  products: T[],
  page: number,
  itemsPerPage: number,
): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = products.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const items = products.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  )
  return { items, totalPages, totalItems }
}
