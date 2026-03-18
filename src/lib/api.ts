import axios from 'axios'

const API_BASE_URL =
  process.env.API_BASE_URL || 'http://localhost:5000/api/v1'

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
