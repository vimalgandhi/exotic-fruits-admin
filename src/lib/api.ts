import axios from 'axios'

const API_BASE_URL =
  process.env.API_BASE_URL || 'http://localhost:5000/api/v1'

export const API_URL = API_BASE_URL

// ---------------------------------------------------------------------------
// Axios-based api object (existing admin integration)
// ---------------------------------------------------------------------------

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  products: {
    getAll: () => apiClient.get('/products'),
    getBySlug: (slug: string) => apiClient.get(`/products/${slug}`),
  },
  categories: {
    getAll: () => apiClient.get('/categories'),
  },
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/auth/login', { email, password }),
    register: (data: Record<string, unknown>) =>
      apiClient.post('/auth/register', data),
  },
  orders: {
    create: (data: Record<string, unknown>) => apiClient.post('/orders', data),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    getAll: () => apiClient.get('/orders'),
  },
}

export default apiClient

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getAuthHeaders(): Record<string, string> {
  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'API request failed'
    try {
      const error = await response.json()
      message = error.message || message
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Authentication APIs
// ---------------------------------------------------------------------------

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

export async function register(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  })
  return handleResponse(response)
}

export async function logout() {
  return fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
}

export async function refreshToken(token: string) {
  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: token }),
  })
  return handleResponse(response)
}

// ---------------------------------------------------------------------------
// Product APIs
// ---------------------------------------------------------------------------

export async function getAllProducts(
  page = 1,
  limit = 10,
  search = '',
  category = '',
  sortBy = 'name',
  order = 'asc'
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category && { category }),
    ...(sortBy && { sortBy }),
    ...(order && { order }),
  })
  const response = await fetch(`${API_URL}/products?${params}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function searchProducts(query: string) {
  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders() }
  )
  return handleResponse(response)
}

export async function filterByCategory(
  categoryId: string,
  page = 1,
  limit = 10
) {
  const response = await fetch(
    `${API_URL}/products/category/${categoryId}?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  )
  return handleResponse(response)
}

export async function filterByPrice(
  minPrice: number,
  maxPrice: number,
  page = 1,
  limit = 10
) {
  const response = await fetch(
    `${API_URL}/products?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  )
  return handleResponse(response)
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function sortProducts(
  sortBy: string,
  order: 'asc' | 'desc',
  page = 1,
  limit = 10
) {
  const response = await fetch(
    `${API_URL}/products?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  )
  return handleResponse(response)
}

// ---------------------------------------------------------------------------
// Cart APIs
// ---------------------------------------------------------------------------

export async function getCart() {
  const response = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function addToCart(productId: string, quantity: number) {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  })
  return handleResponse(response)
}

export async function updateCartItem(itemId: string, quantity: number) {
  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  })
  return handleResponse(response)
}

export async function removeFromCart(itemId: string) {
  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function clearCart() {
  const response = await fetch(`${API_URL}/cart/clear`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

// ---------------------------------------------------------------------------
// Wishlist APIs
// ---------------------------------------------------------------------------

export async function getWishlist() {
  const response = await fetch(`${API_URL}/wishlist`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function addToWishlist(productId: string) {
  const response = await fetch(`${API_URL}/wishlist/add`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  })
  return handleResponse(response)
}

export async function removeFromWishlist(itemId: string) {
  const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

// ---------------------------------------------------------------------------
// Order APIs
// ---------------------------------------------------------------------------

export async function getOrders(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/orders?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  )
  return handleResponse(response)
}

export async function getOrder(id: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function createOrder(
  cartItems: unknown[],
  deliveryAddress: string,
  totalAmount: number
) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: cartItems, deliveryAddress, totalAmount }),
  })
  return handleResponse(response)
}

export async function cancelOrder(id: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'cancelled' }),
  })
  return handleResponse(response)
}

// ---------------------------------------------------------------------------
// Payment APIs
// ---------------------------------------------------------------------------

export async function createPaymentOrder(orderId: string, amount: number) {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId, amount }),
  })
  return handleResponse(response)
}

export async function verifyPayment(paymentData: unknown) {
  const response = await fetch(`${API_URL}/payments/verify-payment`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  })
  return handleResponse(response)
}

export async function getPaymentStatus(paymentId: string) {
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

// ---------------------------------------------------------------------------
// User / Profile APIs
// ---------------------------------------------------------------------------

export async function getProfile() {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function updateProfile(data: unknown) {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
) {
  const response = await fetch(`${API_URL}/users/password`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  })
  return handleResponse(response)
}
