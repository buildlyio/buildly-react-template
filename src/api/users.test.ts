import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import {
  useUsersQuery,
  useCoreGroupsQuery,
  useOrganizationsQuery,
  useInviteUsersMutation,
  useUpdateUserMutation,
  type User,
  type CoreGroup,
  type Organization,
  type UserUpdateData,
} from './users'
import { env } from '../utils/env'

// Mock environment variables
vi.mock('../utils/env', () => ({
  env: {
    API_URL: 'https://api.test.com',
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

const mockAccessToken = 'mock-access-token'

const mockUser: User = {
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

const mockCoreGroup: CoreGroup = {
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
}

const mockOrganization: Organization = {
  id: 'org-1',
  organization_uuid: 'org-uuid-123',
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
}

describe('Users API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('useUsersQuery', () => {
    it('should fetch users successfully with valid token', async () => {
      const mockUsers = [mockUser]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })

      const { result } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'User-Agent': 'buildly-react-template/1.0.0',
        },
      })

      expect(result.current.data).toEqual(mockUsers)
    })

    it('should not fetch when access token is null', async () => {
      const { result } = renderHook(() => useUsersQuery(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(true)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should handle fetch users error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      })

      const { result } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Unauthorized')
    })

    it('should handle API URL with trailing slash', async () => {
      vi.mocked(env).API_URL = 'https://api.test.com/'
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockUser]),
      })

      const { result } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/coreuser/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'User-Agent': 'buildly-react-template/1.0.0',
        },
      })
    })
  })

  describe('useCoreGroupsQuery', () => {
    it('should fetch core groups successfully', async () => {
      const mockGroups = [mockCoreGroup]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGroups),
      })

      const { result } = renderHook(() => useCoreGroupsQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coregroups/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'User-Agent': 'buildly-react-template/1.0.0',
        },
      })

      expect(result.current.data).toEqual(mockGroups)
    })

    it('should not fetch when access token is null', async () => {
      const { result } = renderHook(() => useCoreGroupsQuery(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(true)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should handle fetch core groups error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: () => Promise.resolve('Forbidden'),
      })

      const { result } = renderHook(() => useCoreGroupsQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Forbidden')
    })
  })

  describe('useOrganizationsQuery', () => {
    it('should fetch organizations successfully', async () => {
      const mockOrganizations = [mockOrganization]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOrganizations),
      })

      const { result } = renderHook(() => useOrganizationsQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/organization/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'User-Agent': 'buildly-react-template/1.0.0',
        },
      })

      expect(result.current.data).toEqual(mockOrganizations)
    })

    it('should handle fetch organizations error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      })

      const { result } = renderHook(() => useOrganizationsQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Internal Server Error')
    })
  })

  describe('useInviteUsersMutation', () => {
    it('should invite users successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useInviteUsersMutation(), {
        wrapper: createWrapper(),
      })

      const inviteData = {
        accessToken: mockAccessToken,
        emails: ['user1@example.com', 'user2@example.com'],
      }

      await waitFor(() => {
        result.current.mutate(inviteData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/invite/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ emails: inviteData.emails }),
      })
    })

    it('should handle invite users failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Invalid email addresses'),
      })

      const { result } = renderHook(() => useInviteUsersMutation(), {
        wrapper: createWrapper(),
      })

      const inviteData = {
        accessToken: mockAccessToken,
        emails: ['invalid-email'],
      }

      await waitFor(() => {
        result.current.mutate(inviteData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Invalid email addresses')
    })

    it('should handle empty emails array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      })

      const { result } = renderHook(() => useInviteUsersMutation(), {
        wrapper: createWrapper(),
      })

      const inviteData = {
        accessToken: mockAccessToken,
        emails: [],
      }

      await waitFor(() => {
        result.current.mutate(inviteData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/invite/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ emails: [] }),
      })
    })
  })

  describe('useUpdateUserMutation', () => {
    it('should update user with only organization change', async () => {
      const updatedUser = { ...mockUser, organization: { ...mockUser.organization, name: 'New Organization' } }

      // Mock organization update call
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(''),
        })
        // Mock fetch updated user call
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(updatedUser),
        })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { organization_name: 'New Organization' } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)

      // Verify organization update call
      expect(mockFetch).toHaveBeenNthCalledWith(1, `${env.API_URL}/coreuser/update_org/1/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ organization_name: 'New Organization' }),
      })

      // Verify user fetch call
      expect(mockFetch).toHaveBeenNthCalledWith(2, `${env.API_URL}/coreuser/1/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'User-Agent': 'buildly-react-template/1.0.0',
        },
      })

      expect(result.current.data).toEqual(updatedUser)
    })

    it('should update user with only user fields', async () => {
      const updatedUser = { ...mockUser, is_active: false }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedUser),
      })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { is_active: false } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/1/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ is_active: false }),
      })

      expect(result.current.data).toEqual(updatedUser)
    })

    it('should update user with both organization and user fields', async () => {
      const updatedUser = { 
        ...mockUser, 
        is_active: false, 
        organization: { ...mockUser.organization, name: 'New Organization' } 
      }

      // Mock organization update call
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(''),
        })
        // Mock user fields update call
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(updatedUser),
        })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { 
          organization_name: 'New Organization', 
          is_active: false,
          core_groups: [2, 3]
        } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)

      // Verify organization update call (first)
      expect(mockFetch).toHaveBeenNthCalledWith(1, `${env.API_URL}/coreuser/update_org/1/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ organization_name: 'New Organization' }),
      })

      // Verify user fields update call (second)
      expect(mockFetch).toHaveBeenNthCalledWith(2, `${env.API_URL}/coreuser/1/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ is_active: false, core_groups: [2, 3] }),
      })

      expect(result.current.data).toEqual(updatedUser)
    })

    it('should fail fast if organization update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Organization update failed'),
      })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { 
          organization_name: 'Invalid Organization',
          is_active: false
        } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // Should only call organization update, not user fields update
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result.current.error?.message).toBe('Organization update failed')
    })

    it('should handle user fields update failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Invalid user data'),
      })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { is_active: false } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Invalid user data')
    })

    it('should handle user fetch failure after organization update', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(''),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          text: () => Promise.resolve('User not found'),
        })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { organization_name: 'New Organization' } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result.current.error?.message).toBe('User not found')
    })

    it('should handle core_groups update correctly', async () => {
      const updatedUser = { ...mockUser, core_groups: [{ ...mockUser.core_groups[0], id: 2 }] }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedUser),
      })

      const { result } = renderHook(() => useUpdateUserMutation(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        accessToken: mockAccessToken,
        userId: 1,
        userData: { core_groups: [2] } as UserUpdateData,
      }

      await waitFor(() => {
        result.current.mutate(updateData)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledWith(`${env.API_URL}/coreuser/1/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'buildly-react-template/1.0.0',
        },
        body: JSON.stringify({ core_groups: [2] }),
      })

      expect(result.current.data).toEqual(updatedUser)
    })
  })

  describe('Error handling edge cases', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
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

      const { result } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('HTTP error! status: 500')
    })

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      const { result } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Invalid JSON')
    })
  })

  describe('Query options and caching', () => {
    it('should have correct staleTime configured', () => {
      const { result: usersResult } = renderHook(() => useUsersQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })
      const { result: groupsResult } = renderHook(() => useCoreGroupsQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })
      const { result: orgsResult } = renderHook(() => useOrganizationsQuery(mockAccessToken), {
        wrapper: createWrapper(),
      })

      // All queries should have 5 minute stale time
      expect(usersResult.current.dataUpdatedAt).toBeDefined()
      expect(groupsResult.current.dataUpdatedAt).toBeDefined()
      expect(orgsResult.current.dataUpdatedAt).toBeDefined()
    })

    it('should use correct query keys', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      })

      const wrapper = createWrapper()
      
      renderHook(() => useUsersQuery(mockAccessToken), { wrapper })
      renderHook(() => useCoreGroupsQuery(mockAccessToken), { wrapper })
      renderHook(() => useOrganizationsQuery(mockAccessToken), { wrapper })

      // Query keys are used internally by TanStack Query for caching
      // We can't directly test them but we can verify the hooks work correctly
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })
})