import { useMutation } from '@tanstack/react-query'
import { env } from '../utils/env'

interface LoginCredentials {
  username: string
  password: string
}

interface ResetPasswordRequest {
  email: string
}

interface ResetPasswordConfirmRequest {
  new_password1: string
  new_password2: string
  uid: string
  token: string
}

interface RegisterUserRequest {
  username: string
  email: string
  password: string
  organization_name: string
  first_name: string
  last_name: string
}

interface VerifyEmailRequest {
  token: string
}

interface TokenResponse {
  access: string
  refresh: string
  token_type?: string
  expires_in?: number
  user?: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

const loginUser = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  const formData = new FormData()
  formData.append('username', credentials.username)
  formData.append('password', credentials.password)
  formData.append('client_id', env.OAUTH_CLIENT_ID)

  const response = await fetch(env.OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data
}

const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(baseUrl + '/coreuser/reset-password/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }
}

const resetPasswordConfirm = async (request: ResetPasswordConfirmRequest): Promise<void> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(baseUrl + '/coreuser/reset-password-confirm/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }
}

const registerUser = async (request: RegisterUserRequest): Promise<void> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(baseUrl + '/coreuser/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }
}

const verifyEmail = async (request: VerifyEmailRequest): Promise<void> => {
  const baseUrl = env.API_URL.endsWith('/') ? env.API_URL.slice(0, -1) : env.API_URL
  const response = await fetch(baseUrl + '/coreuser/verify_email/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'buildly-react-template/1.0.0',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(errorData || `HTTP error! status: ${response.status}`)
  }
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error('Login error:', error)
    },
  })
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      console.error('Reset password error:', error)
    },
  })
}

export const useResetPasswordConfirmMutation = () => {
  return useMutation({
    mutationFn: resetPasswordConfirm,
    onError: (error) => {
      console.error('Reset password confirm error:', error)
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error('Registration error:', error)
    },
  })
}

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onError: (error) => {
      console.error('Email verification error:', error)
    },
  })
}