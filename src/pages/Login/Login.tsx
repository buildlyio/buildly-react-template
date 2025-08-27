import { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useLoginMutation } from '../../api/auth'
import { useLoader } from '../../hooks/useLoader'
import { Button } from '../../components/Button/Button'
import { PasswordInput } from '../../components/PasswordInput/PasswordInput'
import { Copyright } from '../../components/Copyright/Copyright'
import { env } from '../../utils/env'
import { LOADER_MESSAGES } from '../../utils/constants'
import darkLogo from '../../assets/dark-logo.png'
import '../../styles/forms.css'
import '../../styles/auth-pages.css'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { setTokenData, checkAuth } = useAuthStore()
  const { showLoader, hideLoader } = useLoader()
  const loginMutation = useLoginMutation()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Login - ${env.APP_NAME}`
  }, [])

  // Redirect if already authenticated
  if (checkAuth()) {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    showLoader(LOADER_MESSAGES.SIGNING_IN)
    
    loginMutation.mutate(
      { username: username.trim(), password },
      {
        onSuccess: (tokenData) => {
          setTokenData(tokenData)
          hideLoader()
          navigate('/app', { replace: true })
        },
        onError: (error) => {
          console.error('Login failed:', error)
          hideLoader()
          setError('Invalid username or password. Please try again.')
        },
      }
    )
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src={darkLogo} alt={env.APP_NAME} />
          </div>
          <h2>Sign In</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username <span className="required">*</span></label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loginMutation.isPending}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button
              primary
              label={loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              type="submit"
              disabled={loginMutation.isPending}
              style={{ width: '100%' }}
            />
          </form>

          <div className="auth-links">
            <p>
              <Link to="/forgot-password" className="link">Forgot your password?</Link>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
      <Copyright />
    </>
  )
}