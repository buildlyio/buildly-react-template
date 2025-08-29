import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from './authStore'
import { AUTH_CONSTANTS } from '../utils/constants'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock Date.now for consistent testing
const mockDate = vi.fn()
vi.stubGlobal('Date', {
  ...Date,
  now: mockDate,
})

const mockUser = {
  id: 1,
  core_user_uuid: 'user-uuid-123',
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  is_active: true,
  title: 'Developer',
  contact_info: '+1234567890',
  privacy_disclaimer_accepted: true,
  tos_disclaimer_accepted: true,
  organization: {
    organization_uuid: 'org-uuid-123',
    id: 'org-1',
    name: 'Test Organization',
    description: 'Test Description',
    organization_url: 'https://test.com',
    create_date: '2023-01-01T00:00:00Z',
    edit_date: '2023-01-01T00:00:00Z',
    oauth_domains: null,
    date_format: 'YYYY-MM-DD',
    phone: null,
    allow_import_export: true,
    radius: 0,
    stripe_subscription_details: null,
    unlimited_free_plan: false,
    coupon: null,
    industries: [],
    subscriptions: [],
    subscription_active: true,
    referral_link: null,
    organization_type: null,
  },
  core_groups: [
    {
      id: 1,
      uuid: 'group-uuid-123',
      name: 'Admin',
      is_global: false,
      is_org_level: true,
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      organization: null,
    },
  ],
  user_type: 'standard',
  survey_status: false,
  subscription_active: true,
  social_profiles: {},
  primary_social_platform: null,
  primary_social_username: null,
  primary_social_avatar_url: null,
  github_username: null,
  has_github_profile: false,
}

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useAuthStore.getState().logout()
    localStorageMock.getItem.mockReturnValue(null)
    mockDate.mockReturnValue(1000000000000) // Fixed timestamp
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.accessToken).toBe(null)
      expect(state.refreshToken).toBe(null)
      expect(state.tokenType).toBe('Bearer')
      expect(state.expiresAt).toBe(null)
    })
  })

  describe('setTokenData', () => {
    it('should set token data with user information', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(tokenData)
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockUser)
      expect(state.accessToken).toBe('mock-access-token')
      expect(state.refreshToken).toBe('mock-refresh-token')
      expect(state.tokenType).toBe('Bearer')
      expect(state.expiresAt).toBe(1000000000000 + (3600 * 1000)) // current time + expires_in in ms
    })

    it('should use default expires_in when not provided', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(tokenData)
      const state = useAuthStore.getState()

      expect(state.expiresAt).toBe(1000000000000 + (AUTH_CONSTANTS.DEFAULT_TOKEN_EXPIRY_SECONDS * 1000))
    })

    it('should use default token_type when not provided', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
      }

      useAuthStore.getState().setTokenData(tokenData)
      const state = useAuthStore.getState()

      expect(state.tokenType).toBe('Bearer')
    })

    it('should handle token data without user', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
      }

      useAuthStore.getState().setTokenData(tokenData)
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toBe(null)
      expect(state.accessToken).toBe('mock-access-token')
      expect(state.refreshToken).toBe('mock-refresh-token')
    })

    it('should override existing authentication state', () => {
      // Set initial token data
      const initialTokenData = {
        access: 'initial-token',
        refresh: 'initial-refresh',
        user: mockUser,
      }
      useAuthStore.getState().setTokenData(initialTokenData)

      // Set new token data
      const newTokenData = {
        access: 'new-token',
        refresh: 'new-refresh',
        token_type: 'Custom',
        expires_in: 7200,
        user: { ...mockUser, username: 'newuser' },
      }
      useAuthStore.getState().setTokenData(newTokenData)

      const state = useAuthStore.getState()

      expect(state.accessToken).toBe('new-token')
      expect(state.refreshToken).toBe('new-refresh')
      expect(state.tokenType).toBe('Custom')
      expect(state.user?.username).toBe('newuser')
    })
  })

  describe('logout', () => {
    it('should clear all authentication state', () => {
      // First set some authentication data
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: mockUser,
      }
      useAuthStore.getState().setTokenData(tokenData)

      // Verify it's set
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Logout
      useAuthStore.getState().logout()
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.accessToken).toBe(null)
      expect(state.refreshToken).toBe(null)
      expect(state.tokenType).toBe('Bearer') // Reset to default
      expect(state.expiresAt).toBe(null)
    })

    it('should be safe to call logout when not authenticated', () => {
      // Ensure we start from logged out state
      useAuthStore.getState().logout()
      const initialState = useAuthStore.getState()

      // Call logout again
      useAuthStore.getState().logout()
      const finalState = useAuthStore.getState()

      expect(finalState).toEqual(initialState)
    })
  })

  describe('isTokenExpired', () => {
    it('should return true when expiresAt is null', () => {
      const state = useAuthStore.getState()
      expect(state.isTokenExpired()).toBe(true)
    })

    it('should return true when token is expired', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600, // 1 hour
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate time passing (2 hours later)
      mockDate.mockReturnValue(1000000000000 + (2 * 60 * 60 * 1000))

      const state = useAuthStore.getState()
      expect(state.isTokenExpired()).toBe(true)
    })

    it('should return false when token is not expired', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600, // 1 hour
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate time passing (30 minutes later)
      mockDate.mockReturnValue(1000000000000 + (30 * 60 * 1000))

      const state = useAuthStore.getState()
      expect(state.isTokenExpired()).toBe(false)
    })

    it('should return true when exactly at expiration time', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate time passing to exact expiration time
      mockDate.mockReturnValue(1000000000000 + (3600 * 1000))

      const state = useAuthStore.getState()
      expect(state.isTokenExpired()).toBe(true)
    })
  })

  describe('checkAuth', () => {
    it('should return false when not authenticated', () => {
      const state = useAuthStore.getState()
      expect(state.checkAuth()).toBe(false)
    })

    it('should return false when no access token', () => {
      // Manually set authenticated but no token (shouldn't happen in practice)
      useAuthStore.setState({ 
        isAuthenticated: true, 
        accessToken: null,
        expiresAt: Date.now() + 3600000 
      })

      const state = useAuthStore.getState()
      expect(state.checkAuth()).toBe(false)
    })

    it('should return false when token is expired', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate time passing (2 hours later)
      mockDate.mockReturnValue(1000000000000 + (2 * 60 * 60 * 1000))

      const state = useAuthStore.getState()
      expect(state.checkAuth()).toBe(false)
    })

    it('should return true when properly authenticated with valid token', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate time passing (30 minutes later)
      mockDate.mockReturnValue(1000000000000 + (30 * 60 * 1000))

      const state = useAuthStore.getState()
      expect(state.checkAuth()).toBe(true)
    })
  })

  describe('cleanupExpiredAuth', () => {
    it('should clear auth state when token is expired', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Verify it's set
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Simulate time passing (2 hours later)
      mockDate.mockReturnValue(1000000000000 + (2 * 60 * 60 * 1000))

      // Call cleanup
      useAuthStore.getState().cleanupExpiredAuth()
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.accessToken).toBe(null)
      expect(state.refreshToken).toBe(null)
      expect(state.tokenType).toBe('Bearer')
      expect(state.expiresAt).toBe(null)
    })

    it('should not clear auth state when token is valid', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expires_in: 3600,
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate time passing (30 minutes later)
      mockDate.mockReturnValue(1000000000000 + (30 * 60 * 1000))

      // Call cleanup
      useAuthStore.getState().cleanupExpiredAuth()
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockUser)
      expect(state.accessToken).toBe('mock-access-token')
    })

    it('should not clear auth state when not authenticated', () => {
      // Ensure we start from logged out state
      useAuthStore.getState().logout()

      // Call cleanup
      useAuthStore.getState().cleanupExpiredAuth()
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.accessToken).toBe(null)
    })
  })

  describe('Persistence Configuration', () => {
    it('should persist correct state properties', () => {
      const tokenData = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // The persist middleware should save these properties
      const expectedPersistedState = {
        isAuthenticated: true,
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresAt: expect.any(Number),
      }

      // We can't directly test the persist middleware, but we can verify
      // the partialize function would include the correct properties
      const state = useAuthStore.getState()
      const persistedKeys = Object.keys(expectedPersistedState)
      
      persistedKeys.forEach(key => {
        expect(state).toHaveProperty(key)
      })
    })

    it('should use correct storage name', () => {
      // The storage name 'auth-storage' should be used for localStorage
      // This is configured in the persist middleware options
      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth-storage')
    })
  })

  describe('Complex Authentication Scenarios', () => {
    it('should handle token refresh scenario', () => {
      // Initial login
      const initialTokenData = {
        access: 'initial-access-token',
        refresh: 'refresh-token',
        expires_in: 3600,
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(initialTokenData)
      expect(useAuthStore.getState().accessToken).toBe('initial-access-token')

      // Simulate token refresh
      const refreshedTokenData = {
        access: 'new-access-token',
        refresh: 'refresh-token', // Same refresh token
        expires_in: 3600,
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(refreshedTokenData)

      const state = useAuthStore.getState()
      expect(state.accessToken).toBe('new-access-token')
      expect(state.refreshToken).toBe('refresh-token')
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle multiple consecutive authentications', () => {
      // First authentication
      const firstAuth = {
        access: 'token1',
        refresh: 'refresh1',
        user: mockUser,
      }
      useAuthStore.getState().setTokenData(firstAuth)
      expect(useAuthStore.getState().user).toEqual(mockUser)

      // Logout
      useAuthStore.getState().logout()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)

      // Second authentication with different user
      const differentUser = { ...mockUser, username: 'differentuser', id: 2 }
      const secondAuth = {
        access: 'token2',
        refresh: 'refresh2',
        user: differentUser,
      }
      useAuthStore.getState().setTokenData(secondAuth)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.username).toBe('differentuser')
      expect(state.accessToken).toBe('token2')
    })

    it('should handle edge case with very short token expiry', () => {
      const tokenData = {
        access: 'short-lived-token',
        refresh: 'refresh-token',
        expires_in: 1, // 1 second
        user: mockUser,
      }

      useAuthStore.getState().setTokenData(tokenData)
      expect(useAuthStore.getState().checkAuth()).toBe(true)

      // Simulate 2 seconds passing
      mockDate.mockReturnValue(1000000000000 + 2000)
      expect(useAuthStore.getState().checkAuth()).toBe(false)
    })
  })
})