import { create } from 'zustand'

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  sessionExpired: false,
  lastActivity: Date.now(),

  setSessionExpired: (expired) => set({ sessionExpired: expired }),
  updateLastActivity: () => set({ lastActivity: Date.now() }),

  login: (authData) => {
    const tokenData = parseJwt(authData.accessToken) || {}
    const rawRole = authData.role || tokenData.role
    const rawEmail = authData.email || tokenData.sub
    const rawId = authData.usuarioId || tokenData.id

    const normalizedRole = rawRole?.startsWith('ROLE_')
      ? rawRole.substring(5)
      : rawRole

    localStorage.setItem('accessToken', authData.accessToken)
    localStorage.setItem('refreshToken', authData.refreshToken)
    if (normalizedRole) localStorage.setItem('role', normalizedRole)
    if (rawId) localStorage.setItem('usuarioId', String(rawId))
    if (rawEmail) localStorage.setItem('email', rawEmail)

    set({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      role: normalizedRole,
      isAuthenticated: true,
      user: {
        usuarioId: rawId,
        email: rawEmail,
      }
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('role')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('email')

    set({
      accessToken: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      user: null,
      sessionExpired: false,
      lastActivity: Date.now()
    })
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ accessToken, refreshToken })
  },

  initialize: () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    let role = localStorage.getItem('role')
    let usuarioId = localStorage.getItem('usuarioId')
    let email = localStorage.getItem('email')

    if (accessToken && refreshToken) {
      if (!role || role === 'undefined' || role === 'null') {
        const tokenData = parseJwt(accessToken) || {}
        role = tokenData.role
        usuarioId = tokenData.id
        email = tokenData.sub
      }

      const normalizedRole = role?.startsWith('ROLE_')
        ? role.substring(5)
        : role

      if (normalizedRole) localStorage.setItem('role', normalizedRole)

      set({
        accessToken,
        refreshToken,
        role: normalizedRole,
        isAuthenticated: true,
        user: {
          usuarioId: Number(usuarioId),
          email,
        }
      })
    }
  }
}))
