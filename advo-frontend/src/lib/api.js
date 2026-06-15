import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: 'http://localhost:8045',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

// Request interceptor to add authorization token and proactively refresh
api.interceptors.request.use(
  async (config) => {
    // Skip refresh checks for auth endpoints to prevent loops
    if (config.url?.includes('/api/auth/')) {
      const token = useAuthStore.getState().accessToken
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    }

    const { accessToken, refreshToken, isAuthenticated, setSessionExpired, setTokens } = useAuthStore.getState()

    if (isAuthenticated && accessToken) {
      const tokenData = parseJwt(accessToken)
      if (tokenData && tokenData.exp) {
        const expirationTimeMs = tokenData.exp * 1000
        const timeUntilExpirationMs = expirationTimeMs - Date.now()

        // If token expires in less than 5 minutes, proactively refresh it before sending request
        if (timeUntilExpirationMs < 5 * 60 * 1000 && timeUntilExpirationMs > 0 && refreshToken) {
          try {
            // Use axios directly to avoid interceptor loop
            const response = await axios.post('http://localhost:8045/api/auth/refresh', {
              refreshToken
            })
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
            setTokens(newAccessToken, newRefreshToken)
            config.headers.Authorization = `Bearer ${newAccessToken}`
            return config
          } catch (error) {
            console.error('Proactive refresh before request failed:', error)
            setSessionExpired(true)
            // Let it pass with the old token, the response interceptor or backend will reject it
          }
        }
      }
      
      // Default: attach current token
      config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip redirect on auth login failure (prevent loops)
    if (originalRequest.url?.includes('/api/auth/login')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post('http://localhost:8045/api/auth/refresh', {
          refreshToken,
        })

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)

        processQueue(null, newAccessToken)
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().setSessionExpired(true)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
