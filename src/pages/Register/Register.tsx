import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../../components/Button/Button'
import { PasswordInput } from '../../components/PasswordInput/PasswordInput'
import { Copyright } from '../../components/Copyright/Copyright'
import { env } from '../../utils/env'
import { AUTH_CONSTANTS } from '../../utils/constants'
import darkLogo from '../../assets/dark-logo.png'
import '../../styles/forms.css'
import '../../styles/auth-pages.css'

export const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organization, setOrganization] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    document.title = `Register - ${env.APP_NAME}`
  }, [])

  // Redirect if already authenticated
  if (checkAuth()) {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !organization.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters long`)
      return
    }

    setIsLoading(true)
    // TODO: Implement registration API call
    setTimeout(() => {
      setError('Registration functionality not yet implemented')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-logo">
            <img src={darkLogo} alt={env.APP_NAME} />
          </div>
          <h2>Create Account</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required">*</span></label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter your first name"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Enter your last name"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username <span className="required">*</span></label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="organization">Organization <span className="required">*</span></label>
              <input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                placeholder="Enter your organization"
                disabled={isLoading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button
              primary
              label={isLoading ? 'Creating Account...' : 'Create Account'}
              type="submit"
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Copyright />
    </>
  )
}