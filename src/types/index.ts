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
}

export interface CartItem {
  product: Product
  quantity: number
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
