import { useQuery, useMutation } from '@tanstack/react-query'
import { env } from '../utils/env'

export interface CoreGroup {
  id: number
  uuid: string
  name: string
  is_global: boolean
  is_org_level: boolean
  permissions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
  organization: any | null
}

export interface Organization {
  id: string
  organization_uuid: string
  name: string
  description: string | null
  organization_url: string | null
  create_date: string
  edit_date: string
  oauth_domains: any | null
  date_format: string
  phone: string | null
  allow_import_export: boolean
  radius: number
  stripe_subscription_details: any | null
  unlimited_free_plan: boolean
  coupon: any | null
  industries: any[]
  subscriptions: any[]
  subscription_active: boolean
  referral_link: string | null
  organization_type: string | null
}

export interface User {
  id: number
  core_user_uuid: string
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  title: string | null
  contact_info: string | null
  privacy_disclaimer_accepted: boolean
  tos_disclaimer_accepted: boolean
  organization: {
    organization_uuid: string
    id: string
    name: string
    description: string | null
    organization_url: string | null
    create_date: string
    edit_date: string
    oauth_domains: any | null
    date_format: string
    phone: string | null
    allow_import_export: boolean
    radius: number
    stripe_subscription_details: any | null
    unlimited_free_plan: boolean
    coupon: any | null
    industries: any[]
    subscriptions: any[]
    subscription_active: boolean
    referral_link: string | null
    organization_type: string | null
  }
  core_groups: Array<{
    id: number
    uuid: string
    name: string
    is_global: boolean
    is_org_level: boolean
    permissions: {
      create: boolean
      read: boolean
      update: boolean
      delete: boolean
    }
    organization: any | null
  }>
  user_type: string
  survey_status: boolean
  subscription_active: boolean
  social_profiles: Record<string, any>
  primary_social_platform: string | null
  primary_social_username: string | null
  primary_social_avatar_url: string | null
  github_username: string | null
  has_github_profile: boolean
}

const fetchUsers = async (accessToken: string): Promise<User[]> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/coreuser/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'buildly-react-template/1.0.0',
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const fetchCoreGroups = async (accessToken: string): Promise<CoreGroup[]> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/coregroups/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'buildly-react-template/1.0.0',
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const fetchOrganizations = async (accessToken: string): Promise<Organization[]> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/organization/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'buildly-react-template/1.0.0',
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const useUsersQuery = (accessToken: string | null) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCoreGroupsQuery = (accessToken: string | null) => {
  return useQuery({
    queryKey: ['coregroups'],
    queryFn: () => fetchCoreGroups(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

const inviteUsers = async (accessToken: string, emails: string[]): Promise<void> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/coreuser/invite/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify({ emails }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }
}

export const useOrganizationsQuery = (accessToken: string | null) => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => fetchOrganizations(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useInviteUsersMutation = () => {
  return useMutation({
    mutationFn: ({ accessToken, emails }: { accessToken: string, emails: string[] }) => 
      inviteUsers(accessToken, emails),
  })
}

export interface UserUpdateData {
  is_active?: boolean
  organization_name?: string
  core_groups?: number[]
}

const updateUserOrganization = async (accessToken: string, userId: number, orgData: { organization_name: string }): Promise<void> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/coreuser/update_org/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify(orgData),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }
}

const updateUserFields = async (accessToken: string, userId: number, userData: { is_active?: boolean, core_groups?: number[] }): Promise<User> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/coreuser/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const updateUser = async (accessToken: string, userId: number, userData: UserUpdateData): Promise<User> => {
  // Step 1: Update organization if needed (must happen first)
  if ('organization_name' in userData && userData.organization_name !== undefined) {
    await updateUserOrganization(accessToken, userId, { 
      organization_name: userData.organization_name 
    })
  }

  // Step 2: Update user fields if needed
  const userFields = {
    ...(userData.is_active !== undefined && { is_active: userData.is_active }),
    ...(userData.core_groups !== undefined && { core_groups: userData.core_groups })
  }

  if (Object.keys(userFields).length > 0) {
    return await updateUserFields(accessToken, userId, userFields)
  }

  // If only organization was updated, fetch the updated user
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(`${baseUrl}/coreuser/${userId}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'buildly-react-template/1.0.0',
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ accessToken, userId, userData }: { 
      accessToken: string, 
      userId: number, 
      userData: UserUpdateData 
    }) => updateUser(accessToken, userId, userData),
  })
}