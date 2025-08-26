import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
}

interface TokenData {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
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
        const expiresAt = Date.now() + (tokenData.expires_in * 1000)
        
        set({
          isAuthenticated: true,
          user: tokenData.user || null,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
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
        return state.isAuthenticated && !!state.accessToken && !state.isTokenExpired()
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
      })
    }
  )
)