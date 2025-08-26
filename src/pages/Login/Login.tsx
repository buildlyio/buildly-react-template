import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useLoginMutation } from '../../api/auth'
import { Button } from '../../components/Button/Button'
import { Copyright } from '../../components/Copyright/Copyright'
import { env } from '../../utils/env'
import darkLogo from '../../assets/dark-logo.png'
import './Login.css'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const { setTokenData, isAuthenticated } = useAuthStore()
  const loginMutation = useLoginMutation()

  useEffect(() => {
    document.title = `Login - ${env.APP_NAME}`
  }, [])

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    loginMutation.mutate(
      { username: username.trim(), password },
      {
        onSuccess: (tokenData) => {
          setTokenData(tokenData)
          // Navigation will happen automatically via the redirect above
        },
        onError: (error) => {
          console.error('Login failed:', error)
          setError('Invalid username or password. Please try again.')
        },
      }
    )
  }

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <img src={darkLogo} alt={env.APP_NAME} />
          </div>
          <h2>Sign In</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
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
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button
              primary
              label={loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              onClick={() => {}}
              type="submit"
              disabled={loginMutation.isPending}
              style={{ width: '100%' }}
            />
          </form>
        </div>
      </div>
      <Copyright />
    </>
  )
}