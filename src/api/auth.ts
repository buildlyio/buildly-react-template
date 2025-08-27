import { useMutation } from '@tanstack/react-query'
import { env } from '../utils/env'

interface LoginCredentials {
  username: string
  password: string
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

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error('Login error:', error)
    },
  })
}