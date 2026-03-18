export interface PriceListItem {
  unitId: string
  unitName: string
  unitValue: number
  unitPrice: number
  discountType: 'Percentage' | 'Fixed'
  discount: number
  afterDiscountPrice: number
  isactive: boolean
  createdon: string
  updatedon: string
}

export interface SeoData {
  metTitle: string
  metDescription: string
  seo_alt: string
  follow: 'yes' | 'no'
  index: 'yes' | 'no'
  canonical: string
  pageSchema: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
  stock: 'In Stock' | 'Out of Stock'
  description: string
  origin: string
  // Phase 2 extended fields
  productid?: string
  productName?: string
  productDescription?: string
  categoryName?: string
  categoryId?: string
  isactive?: boolean
  originCountry?: string
  pricelist?: PriceListItem[]
  subImages?: string[]
  stkStatus?: 'In Stock' | 'Out Stock'
  foodType?: string
  seoData?: SeoData
}

export interface CartItem {
  product: Product
  quantity: number
  selectedUnit?: PriceListItem
}

export interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'PENDING' | 'PAID' | 'FAILED'
  createdAt: string
}

export interface RouteRedirect {
  from: string
  to: string
  condition: string
  description: string
}
