import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_CONSTANTS } from '../utils/constants'

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
}

interface TokenData {
  access: string
  refresh: string
  token_type?: string
  expires_in?: number
  user?: User
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  tokenType: string
  expiresAt: number | null
  setTokenData: (tokenData: TokenData) => void
  logout: () => void
  checkAuth: () => boolean
  isTokenExpired: () => boolean
  cleanupExpiredAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenType: 'Bearer',
      expiresAt: null,

      setTokenData: (tokenData: TokenData) => {
        // Default to 1 hour if expires_in is not provided
        const expiresIn = tokenData.expires_in || AUTH_CONSTANTS.DEFAULT_TOKEN_EXPIRY_SECONDS
        const expiresAt = Date.now() + (expiresIn * 1000)
        
        set({
          isAuthenticated: true,
          user: tokenData.user || null,
          accessToken: tokenData.access,
          refreshToken: tokenData.refresh,
          tokenType: tokenData.token_type || 'Bearer',
          expiresAt,
        })
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenType: 'Bearer',
          expiresAt: null,
        })
      },

      isTokenExpired: (): boolean => {
        const state = get()
        if (!state.expiresAt) return true
        return Date.now() >= state.expiresAt
      },

      checkAuth: (): boolean => {
        const state = get()
        const hasToken = !!state.accessToken
        const isNotExpired = !state.isTokenExpired()
        const isValid = state.isAuthenticated && hasToken && isNotExpired
        
        return isValid
      },

      // Separate function for cleanup - call this in useEffect, not during render
      cleanupExpiredAuth: () => {
        const state = get()
        if (state.isAuthenticated && state.isTokenExpired()) {
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            tokenType: 'Bearer',
            expiresAt: null,
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
        expiresAt: state.expiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // After rehydration, check if token is still valid
          if (state.isAuthenticated && state.isTokenExpired()) {
            state.logout()
          }
        }
      }
    }
  )
)