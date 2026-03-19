import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL =
  process.env.API_BASE_URL || 'http://localhost:5000/api/v1'

function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem('accessToken')
}

function getRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

function setAccessToken(token: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('accessToken', token)
  }
}

function clearTokens(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor – attach bearer token and log request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (process.env.NODE_ENV === 'development') {
      console.info(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error: unknown) => {
    console.error('[API] Request error', error)
    return Promise.reject(error)
  }
)

// Flag to prevent concurrent refresh loops
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

function onTokenRefreshed(token: string) {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

// Response interceptor – auto-refresh on 401, log responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[API] ${response.status} ${response.config.url}`)
    }
    return response
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response || !error.config) {
      console.error('[API] Network error', error)
      return Promise.reject(error)
    }

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      const refreshTkn = getRefreshToken()
      if (!refreshTkn) {
        clearTokens()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve) => {
          pendingRequests.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken: refreshTkn,
        })
        const newToken: string = res.data.accessToken
        setAccessToken(newToken)
        onTokenRefreshed(newToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        clearTokens()
        console.error('[API] Token refresh failed', refreshError)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    console.error(`[API] ${error.response.status} ${error.config.url}`, error)
    return Promise.reject(error)
  }
)

export default apiClient
