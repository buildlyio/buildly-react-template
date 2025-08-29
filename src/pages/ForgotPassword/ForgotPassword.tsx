import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useResetPasswordMutation } from '../../api/auth'
import { useNotification } from '../../hooks/useNotification'
import { Button } from '../../components/Button/Button'
import { Copyright } from '../../components/Copyright/Copyright'
import { env } from '../../utils/env'
import { NOTIFICATION_MESSAGES } from '../../utils/constants'
import darkLogo from '../../assets/dark-logo.png'
import '../../styles/forms.css'
import '../../styles/auth-pages.css'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { checkAuth } = useAuthStore()
  const { showSuccess, showError } = useNotification()
  const resetPasswordMutation = useResetPasswordMutation()

  useEffect(() => {
    document.title = `Forgot Password - ${env.APP_NAME}`
  }, [])

  // Redirect if already authenticated
  if (checkAuth()) {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({ email: email.trim() })
      setSuccess('If an account with that email exists, we have sent you a password reset link.')
      showSuccess(NOTIFICATION_MESSAGES.EMAIL_SENT)
    } catch {
      setError('An error occurred while sending the reset link. Please try again.')
      showError('Failed to send reset email. Please try again.')
    }
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src={darkLogo} alt={env.APP_NAME} />
          </div>
          <h2>Reset Password</h2>
          <p className="auth-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address <span className="required">*</span></label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                disabled={resetPasswordMutation.isPending}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <Button
              primary
              label={resetPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
              type="submit"
              disabled={resetPasswordMutation.isPending}
              style={{ width: '100%' }}
            />
          </form>

          <div className="auth-links">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="link">Sign in</Link>
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