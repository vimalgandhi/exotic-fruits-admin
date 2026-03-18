import axios from 'axios';
import { getToken } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'API request failed');
  }
  return response.json() as Promise<T>;
}

const API_URL = BASE_URL;

// Admin Dashboard APIs
export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function getAnalyticsData(startDate: string, endDate: string) {
  const response = await fetch(
    `${API_URL}/admin/analytics?startDate=${startDate}&endDate=${endDate}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse(response);
}

// Admin Products APIs
export async function getAdminProducts(page = 1, search = '', category = '') {
  const params = new URLSearchParams({
    page: String(page),
    ...(search && { search }),
    ...(category && { category }),
  });
  const response = await fetch(`${API_URL}/admin/products?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function getAdminProductById(id: string) {
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function createAdminProduct(formData: FormData) {
  const { 'Content-Type': _ct, ...headersWithoutContentType } = getAuthHeaders();
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: headersWithoutContentType,
    body: formData,
  });
  return handleResponse(response);
}

export async function updateAdminProduct(id: string, formData: FormData) {
  const { 'Content-Type': _ct, ...headersWithoutContentType } = getAuthHeaders();
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: headersWithoutContentType,
    body: formData,
  });
  return handleResponse(response);
}

export async function deleteAdminProduct(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

// Admin Orders APIs
export async function getAdminOrders(page = 1, status = '', search = '') {
  const params = new URLSearchParams({
    page: String(page),
    ...(status && { status }),
    ...(search && { search }),
  });
  const response = await fetch(`${API_URL}/admin/orders?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function getAdminOrderById(id: string) {
  const response = await fetch(`${API_URL}/admin/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function updateOrderStatus(id: string, status: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

// Admin Users APIs
export async function getAdminUsers(page = 1, role = '', search = '') {
  const params = new URLSearchParams({
    page: String(page),
    ...(role && { role }),
    ...(search && { search }),
  });
  const response = await fetch(`${API_URL}/admin/users?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function getAdminUserById(id: string) {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function deleteAdminUser(id: string) {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

// Admin Categories APIs
export async function getAdminCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function createAdminCategory(data: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateAdminCategory(id: string, data: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteAdminCategory(id: string) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}
