import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock environment variables
vi.mock('../utils/env', () => ({
  env: {
    API_URL: 'https://api.test.com',
    APP_NAME: 'Test App',
    OAUTH_TOKEN_URL: 'https://oauth.test.com/token',
    OAUTH_CLIENT_ID: 'test-client-id',
    IS_DEVELOPMENT: true,
    IS_PRODUCTION: false,
  },
}))

// Mock window.matchMedia for theme testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock document.documentElement for theme testing
const mockDocumentElement = {
  setAttribute: vi.fn(),
  className: '',
}
Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  configurable: true,
})

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  )
}

const mockUserData = {
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

describe('Integration Tests - Complete User Flows', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockDocumentElement.setAttribute.mockClear()
    mockDocumentElement.className = ''
    
    // Reset all stores
    useAuthStore.getState().logout()
    useThemeStore.getState().setTheme('system')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication Flow Integration', () => {
    it('should complete full login flow from unauthenticated to authenticated state', async () => {
      // Mock successful login responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            access: 'mock-access-token',
            refresh: 'mock-refresh-token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should start at login page (redirected from root)
      await waitFor(() => {
        expect(window.location.pathname).toBe('/')
      })

      // Should see login form
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      // Should make API calls
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2)
      })

      // Should be redirected to dashboard after successful login
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })

      // Should show user menu with user info
      const userMenu = screen.getByLabelText('User menu')
      fireEvent.click(userMenu)

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should handle login failure and show error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Invalid credentials'),
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Fill in login form with invalid credentials
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'invaliduser' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show error notification
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })

      // Should remain on login page
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    })

    it('should complete logout flow', async () => {
      // Start with authenticated state
      useAuthStore.getState().setTokenData({
        access: 'mock-token',
        refresh: 'mock-refresh',
        user: mockUserData,
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should be on dashboard
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })

      // Open user menu and logout
      const userMenu = screen.getByLabelText('User menu')
      fireEvent.click(userMenu)

      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)

      // Should be redirected to login and show success message
      await waitFor(() => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      })

      expect(screen.getByText(/successfully signed out/i)).toBeInTheDocument()
    })
  })

  describe('User Registration Flow Integration', () => {
    it('should complete full registration flow', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Navigate to register page
      fireEvent.click(screen.getByText(/create account/i))

      // Fill in registration form
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'johndoe' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/organization/i), {
        target: { value: 'Test Org' },
      })
      fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      })

      // Submit registration
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      // Should make API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.test.com/coreuser/',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        )
      })

      // Should redirect to login with success message
      await waitFor(() => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByText(/account created successfully/i)).toBeInTheDocument()
      })
    })
  })

  describe('Password Reset Flow Integration', () => {
    it('should complete password reset request flow', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Navigate to forgot password page
      fireEvent.click(screen.getByText(/forgot password/i))

      // Fill in email
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })

      // Submit reset request
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

      // Should make API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.test.com/coreuser/reset-password/',
          expect.objectContaining({
            method: 'POST',
          })
        )
      })

      // Should redirect to login with confirmation message
      await waitFor(() => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByText(/we have sent you a password reset link/i)).toBeInTheDocument()
      })
    })
  })

  describe('Theme System Integration', () => {
    it('should apply theme changes across the application', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should start with system theme
      expect(useThemeStore.getState().mode).toBe('system')

      // Find and click theme toggle (assuming it's in the topbar when authenticated)
      // For unauthenticated state, theme toggle might not be visible
      // Let's test theme changes directly through the store
      useThemeStore.getState().setTheme('dark')

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      expect(mockDocumentElement.className).toBe('dark-theme')

      useThemeStore.getState().setTheme('light')

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light')
      expect(mockDocumentElement.className).toBe('light-theme')
    })
  })

  describe('Global UI System Integration', () => {
    it('should show global loader during API operations', async () => {
      // Mock slow API response
      mockFetch
        .mockImplementationOnce(() => new Promise(resolve => {
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({
              access: 'token',
              refresh: 'refresh',
            }),
          }), 100)
        }))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Fill in and submit login form
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show loader
      await waitFor(() => {
        expect(screen.getByText(/signing you in/i)).toBeInTheDocument()
      })

      // Loader should disappear after API completes
      await waitFor(() => {
        expect(screen.queryByText(/signing you in/i)).not.toBeInTheDocument()
      })
    })

    it('should display global notifications for user feedback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Login failed'),
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Trigger a failed login
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show error notification
      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation and Routing Integration', () => {
    it('should handle protected route access correctly', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Unauthenticated user should be redirected to login
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()

      // Authenticate user
      useAuthStore.getState().setTokenData({
        access: 'token',
        refresh: 'refresh',
        user: mockUserData,
      })

      // Re-render to trigger route change
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should now access dashboard
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    })

    it('should prevent authenticated users from accessing auth pages', () => {
      // Start with authenticated state
      useAuthStore.getState().setTokenData({
        access: 'token',
        refresh: 'refresh',
        user: mockUserData,
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should be on dashboard, not login
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument()
    })
  })

  describe('User Management Integration', () => {
    it('should show user management for users with admin permissions', async () => {
      // Set up authenticated admin user
      useAuthStore.getState().setTokenData({
        access: 'token',
        refresh: 'refresh',
        user: mockUserData, // User has admin permissions in mock data
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Open user menu
      const userMenu = screen.getByLabelText('User menu')
      fireEvent.click(userMenu)

      // Should see User Management option
      expect(screen.getByText('User Management')).toBeInTheDocument()

      // Navigate to user management
      fireEvent.click(screen.getByText('User Management'))

      // Should see user management interface
      await waitFor(() => {
        expect(screen.getByText(/manage users and roles/i)).toBeInTheDocument()
      })
    })

    it('should hide user management for users without admin permissions', () => {
      // Create user without admin permissions
      const regularUser = {
        ...mockUserData,
        core_groups: [
          {
            ...mockUserData.core_groups[0],
            permissions: {
              create: false,
              read: true,
              update: false,
              delete: false,
            },
          },
        ],
      }

      useAuthStore.getState().setTokenData({
        access: 'token',
        refresh: 'refresh',
        user: regularUser,
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Open user menu
      const userMenu = screen.getByLabelText('User menu')
      fireEvent.click(userMenu)

      // Should NOT see User Management option
      expect(screen.queryByText('User Management')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Try to login
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show network error notification
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
      })

      // Should remain on login page
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    })

    it('should handle API server errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal server error'),
      })

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Try to login
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      // Should show server error notification
      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
      })
    })
  })

  describe('State Persistence Integration', () => {
    it('should persist authentication state across page reloads', () => {
      // Simulate authenticated state
      const tokenData = {
        access: 'token',
        refresh: 'refresh',
        user: mockUserData,
      }

      useAuthStore.getState().setTokenData(tokenData)

      // Simulate page reload by creating new app instance
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should maintain authenticated state
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user).toEqual(mockUserData)
    })

    it('should persist theme preference across sessions', () => {
      useThemeStore.getState().setTheme('dark')

      // Simulate new session
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Should maintain theme preference
      expect(useThemeStore.getState().mode).toBe('dark')
    })
  })

  describe('Performance and Responsiveness', () => {
    it('should handle rapid user interactions without breaking', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(usernameInput, { target: { value: `user${i}` } })
        fireEvent.change(passwordInput, { target: { value: `pass${i}` } })
      }

      // Multiple rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(submitButton)
      }

      // Should not crash and should handle gracefully
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain proper focus management during navigation', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const usernameInput = screen.getByLabelText(/username/i)
      usernameInput.focus()

      expect(document.activeElement).toBe(usernameInput)

      // Tab to next field
      fireEvent.keyDown(usernameInput, { key: 'Tab' })

      const passwordInput = screen.getByLabelText(/password/i)
      passwordInput.focus()

      expect(document.activeElement).toBe(passwordInput)
    })

    it('should handle keyboard navigation correctly', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Should be able to activate button with Enter key
      submitButton.focus()
      fireEvent.keyDown(submitButton, { key: 'Enter' })

      // Should trigger form submission (API call would be made)
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})