import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import api from '../lib/api'

// Parse JWT safely to extract exp
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export const useTokenWatcher = () => {
  const { 
    accessToken, 
    refreshToken, 
    isAuthenticated, 
    lastActivity, 
    updateLastActivity,
    setSessionExpired,
    logout
  } = useAuthStore()

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      updateLastActivity()
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [updateLastActivity])

  // Watch token expiration
  const checkToken = useCallback(async () => {
    if (!isAuthenticated || !accessToken || !refreshToken) return

    const tokenData = parseJwt(accessToken)
    if (!tokenData || !tokenData.exp) return

    const expirationTimeMs = tokenData.exp * 1000
    const timeUntilExpirationMs = expirationTimeMs - Date.now()
    const inactiveTimeMs = Date.now() - lastActivity

    // If user has been inactive for more than 15 minutes and token is expired or expiring very soon
    if (inactiveTimeMs > 15 * 60 * 1000 && timeUntilExpirationMs < 0) {
      setSessionExpired(true)
      return
    }

    // If token expires in less than 5 minutes and user is active, refresh proactively
    if (timeUntilExpirationMs < 5 * 60 * 1000 && timeUntilExpirationMs > 0) {
      try {
        const response = await api.post('/api/auth/refresh', { refreshToken })
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)
      } catch (error) {
        console.error('Proactive refresh failed:', error)
        setSessionExpired(true)
      }
    } else if (timeUntilExpirationMs < 0) {
        // Already expired but user was somewhat active, let interceptors handle or just expire
        // Interceptors might catch it, but if no requests are made, we expire here
        setSessionExpired(true)
    }

  }, [accessToken, refreshToken, isAuthenticated, lastActivity, setSessionExpired])

  useEffect(() => {
    // Check every 60 seconds
    const interval = setInterval(() => {
      checkToken()
    }, 60 * 1000)

    // Run initial check
    checkToken()

    return () => clearInterval(interval)
  }, [checkToken])
}
