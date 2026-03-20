const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ==================== HELPER FUNCTIONS ====================

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('accessToken')
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

// ==================== AUTHENTICATION APIs (PUBLIC) ====================

export async function registerUser(
  name: string,
  email: string,
  phone: string,
  password: string,
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message || 'Registration failed')
  }
  const data = await response.json()
  if (data.data?.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.data.user))
  }
  return data.data
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message || 'Login failed')
  }
  const data = await response.json()
  if (data.data?.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.data.user))
  }
  return data.data
}

export async function logoutUser() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
  } catch (error) {
    console.error('Logout API error:', error)
  }
  clearAuth()
}

export async function refreshAuthToken() {
  const refreshToken =
    typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
  if (!refreshToken) throw new Error('No refresh token')

  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!response.ok) {
    clearAuth()
    throw new Error('Token refresh failed')
  }

  const data = await response.json()
  if (data.data?.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.data.accessToken)
  }
  return data.data
}

// ==================== PRODUCT APIs (PUBLIC - No Auth) ====================

export async function getAllProducts(
  page = 1,
  limit = 12,
  search = '',
  category = '',
  sortBy = 'name',
  order = 'asc',
  minPrice?: number,
  maxPrice?: number,
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category && { category }),
    ...(sortBy && { sortBy }),
    ...(order && { order }),
    ...(minPrice !== undefined && { minPrice: minPrice.toString() }),
    ...(maxPrice !== undefined && { maxPrice: maxPrice.toString() }),
  })

  const response = await fetch(`${API_URL}/products?${params}`)
  if (!response.ok) throw new Error('Failed to fetch products')
  const data = await response.json()
  return data.data
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`)
  if (!response.ok) throw new Error('Failed to fetch product')
  const data = await response.json()
  return data.data
}

export async function searchProducts(query: string, page = 1, limit = 12) {
  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
  )
  if (!response.ok) throw new Error('Search failed')
  const data = await response.json()
  return data.data
}

export async function filterProductsByCategory(
  categoryId: string,
  page = 1,
  limit = 12,
  sortBy = 'name',
  order = 'asc',
) {
  const response = await fetch(
    `${API_URL}/products/category/${categoryId}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
  )
  if (!response.ok) throw new Error('Failed to filter products')
  const data = await response.json()
  return data.data
}

export async function filterProductsByPrice(
  minPrice: number,
  maxPrice: number,
  page = 1,
  limit = 12,
) {
  const response = await fetch(
    `${API_URL}/products?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&limit=${limit}`,
  )
  if (!response.ok) throw new Error('Failed to filter by price')
  const data = await response.json()
  return data.data
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  const data = await response.json()
  return data.data
}

// ==================== CART APIs (PRIVATE - Requires JWT) ====================

export async function getCart() {
  const response = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to fetch cart')
  const data = await response.json()
  return data.data
}

export async function addToCart(productId: string, quantity: number) {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  })
  if (!response.ok) throw new Error('Failed to add to cart')
  const data = await response.json()
  return data.data
}

export async function updateCartItem(itemId: string, quantity: number) {
  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  })
  if (!response.ok) throw new Error('Failed to update cart item')
  const data = await response.json()
  return data.data
}

export async function removeFromCart(itemId: string) {
  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to remove from cart')
  const data = await response.json()
  return data.data
}

export async function clearCart() {
  const response = await fetch(`${API_URL}/cart/clear`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to clear cart')
  const data = await response.json()
  return data.data
}

// ==================== WISHLIST APIs (PRIVATE - Requires JWT) ====================

export async function getWishlist() {
  const response = await fetch(`${API_URL}/wishlist`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to fetch wishlist')
  const data = await response.json()
  return data.data
}

export async function addToWishlist(productId: string) {
  const response = await fetch(`${API_URL}/wishlist/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId }),
  })
  if (!response.ok) throw new Error('Failed to add to wishlist')
  const data = await response.json()
  return data.data
}

export async function removeFromWishlist(itemId: string) {
  const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to remove from wishlist')
  const data = await response.json()
  return data.data
}

// ==================== ORDER APIs (PRIVATE - Requires JWT) ====================

export async function getOrders(page = 1, limit = 10) {
  const response = await fetch(`${API_URL}/orders?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to fetch orders')
  const data = await response.json()
  return data.data
}

export async function getOrder(id: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to fetch order')
  const data = await response.json()
  return data.data
}

export async function createOrder(
  items: Record<string, unknown>[],
  deliveryAddress: string,
  totalAmount: number,
) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items, deliveryAddress, totalAmount }),
  })
  if (!response.ok) throw new Error('Failed to create order')
  const data = await response.json()
  return data.data
}

export async function updateOrderStatus(id: string, status: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error('Failed to update order')
  const data = await response.json()
  return data.data
}

// ==================== PAYMENT APIs (PRIVATE - Requires JWT) ====================

export async function createPaymentOrder(orderId: string, amount: number) {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId, amount }),
  })
  if (!response.ok) throw new Error('Failed to create payment order')
  const data = await response.json()
  return data.data
}

export async function verifyPayment(paymentData: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/payments/verify-payment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  })
  if (!response.ok) throw new Error('Failed to verify payment')
  const data = await response.json()
  return data.data
}

export async function getPaymentStatus(paymentId: string) {
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to fetch payment status')
  const data = await response.json()
  return data.data
}

// ==================== USER APIs (PRIVATE - Requires JWT) ====================

export async function getUserProfile() {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Failed to fetch profile')
  const data = await response.json()
  return data.data
}

export async function updateUserProfile(profileData: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  })
  if (!response.ok) throw new Error('Failed to update profile')
  const data = await response.json()
  return data.data
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
) {
  const response = await fetch(`${API_URL}/users/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ oldPassword, newPassword }),
  })
  if (!response.ok) throw new Error('Failed to change password')
  const data = await response.json()
  return data.data
}
