import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import {
  useLoginMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
} from './auth'
import { env } from '../utils/env'

// Mock environment variables
vi.mock('../utils/env', () => ({
  env: {
    API_URL: 'https://api.test.com',
    OAUTH_TOKEN_URL: 'https://oauth.test.com/token',
    OAUTH_CLIENT_ID: 'test-client-id',
  },
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Authentication API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('useLoginMutation', () => {
    it('should successfully login with valid credentials', async () => {
      const mockTokenResponse = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }

      const mockUserData = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      }

      // Mock token endpoint response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        })
        // Mock user data endpoint response
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        })

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      })

      const loginData = { username: 'testuser', password: 'password123' }
      
      await waitFor(() => {
        result.current.mutate(loginData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)
      
      // Verify token endpoint call
      expect(mockFetch).toHaveBeenNthCalledWith(1, env.OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: expect.any(FormData),
      })

      // Verify user data endpoint call
      expect(mockFetch).toHaveBeenNthCalledWith(2, `${env.API_URL}/coreuser/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockTokenResponse.access}`,
          'User-Agent': 'buildly-react-template/1.0.0',
        },
      })

      expect(result.current.data).toEqual({
        ...mockTokenResponse,
        user: mockUserData,
      })
    })

    it('should handle login failure with invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Invalid credentials'),
      })

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      })

      const loginData = { username: 'invalid', password: 'invalid' }

      await waitFor(() => {
        result.current.mutate(loginData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Invalid credentials')
    })

    it('should handle user data fetch failure after successful token', async () => {
      const mockTokenResponse = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          text: () => Promise.resolve('Access denied'),
        })

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      })

      const loginData = { username: 'testuser', password: 'password123' }

      await waitFor(() => {
        result.current.mutate(loginData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Access denied')
    })

    it('should send correct FormData in login request', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access: 'token', refresh: 'refresh' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      })

      const loginData = { username: 'testuser', password: 'password123' }

      await waitFor(() => {
        result.current.mutate(loginData)
      })

      const formDataCall = mockFetch.mock.calls[0][1].body
      expect(formDataCall).toBeInstanceOf(FormData)
    })
  })

  describe('useResetPasswordMutation', () => {
    it('should successfully send password reset request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useResetPasswordMutation(), {
        wrapper: createWrapper(),
      })

      const resetData = { email: 'test@example.com' }

      await waitFor(() => {
        result.current.mutate(resetData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify(resetData),
      })
    })

    it('should handle password reset failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Email not found'),
      })

      const { result } = renderHook(() => useResetPasswordMutation(), {
        wrapper: createWrapper(),
      })

      const resetData = { email: 'notfound@example.com' }

      await waitFor(() => {
        result.current.mutate(resetData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Email not found')
    })

    it('should handle API URL with trailing slash correctly', async () => {
      vi.mocked(env).API_URL = 'https://api.test.com/'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useResetPasswordMutation(), {
        wrapper: createWrapper(),
      })

      const resetData = { email: 'test@example.com' }

      await waitFor(() => {
        result.current.mutate(resetData)
      })

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/coreuser/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify(resetData),
      })
    })
  })

  describe('useResetPasswordConfirmMutation', () => {
    it('should successfully confirm password reset', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useResetPasswordConfirmMutation(), {
        wrapper: createWrapper(),
      })

      const confirmData = {
        new_password1: 'newpassword123',
        new_password2: 'newpassword123',
        uid: 'user-uid',
        token: 'reset-token',
      }

      await waitFor(() => {
        result.current.mutate(confirmData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/reset-password-confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify(confirmData),
      })
    })

    it('should handle password reset confirmation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Invalid token or passwords do not match'),
      })

      const { result } = renderHook(() => useResetPasswordConfirmMutation(), {
        wrapper: createWrapper(),
      })

      const confirmData = {
        new_password1: 'newpassword123',
        new_password2: 'differentpassword',
        uid: 'user-uid',
        token: 'invalid-token',
      }

      await waitFor(() => {
        result.current.mutate(confirmData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Invalid token or passwords do not match')
    })
  })

  describe('useRegisterMutation', () => {
    it('should successfully register new user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: createWrapper(),
      })

      const registerData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        organization_name: 'Test Organization',
        first_name: 'New',
        last_name: 'User',
      }

      await waitFor(() => {
        result.current.mutate(registerData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify(registerData),
      })
    })

    it('should handle registration failure with validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Username already exists'),
      })

      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: createWrapper(),
      })

      const registerData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        organization_name: 'Test Organization',
        first_name: 'Existing',
        last_name: 'User',
      }

      await waitFor(() => {
        result.current.mutate(registerData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Username already exists')
    })
  })

  describe('useVerifyEmailMutation', () => {
    it('should successfully verify email with valid token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useVerifyEmailMutation(), {
        wrapper: createWrapper(),
      })

      const verifyData = { token: 'valid-verification-token' }

      await waitFor(() => {
        result.current.mutate(verifyData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/verify_email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify(verifyData),
      })
    })

    it('should handle email verification failure with invalid token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Invalid or expired verification token'),
      })

      const { result } = renderHook(() => useVerifyEmailMutation(), {
        wrapper: createWrapper(),
      })

      const verifyData = { token: 'invalid-token' }

      await waitFor(() => {
        result.current.mutate(verifyData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Invalid or expired verification token')
    })
  })

  describe('Error handling edge cases', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      })

      const loginData = { username: 'testuser', password: 'password123' }

      await waitFor(() => {
        result.current.mutate(loginData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Network error')
    })

    it('should handle empty error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      })

      const loginData = { username: 'testuser', password: 'password123' }

      await waitFor(() => {
        result.current.mutate(loginData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('HTTP error! status: 500')
    })
  })
})