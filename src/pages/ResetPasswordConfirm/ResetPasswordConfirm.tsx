import { useState, useEffect } from 'react'
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useResetPasswordConfirmMutation } from '../../api/auth'
import { useLoader } from '../../hooks/useLoader'
import { useNotification } from '../../hooks/useNotification'
import { Button } from '../../components/Button/Button'
import { Copyright } from '../../components/Copyright/Copyright'
import { env } from '../../utils/env'
import { LOADER_MESSAGES, NOTIFICATION_MESSAGES } from '../../utils/constants'
import darkLogo from '../../assets/dark-logo.png'
import '../../styles/forms.css'
import '../../styles/auth-pages.css'

export const ResetPasswordConfirm = () => {
  const [newPassword1, setNewPassword1] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { uid, token } = useParams<{ uid: string; token: string }>()
  const navigate = useNavigate()
  const { checkAuth } = useAuthStore()
  const { showLoader, hideLoader } = useLoader()
  const { showSuccess, showError } = useNotification()
  const resetPasswordConfirmMutation = useResetPasswordConfirmMutation()

  useEffect(() => {
    document.title = `Reset Password - ${env.APP_NAME}`
  }, [])

  // Redirect if already authenticated
  if (checkAuth()) {
    return <Navigate to="/app" replace />
  }

  // Redirect if uid or token is missing
  if (!uid || !token) {
    return <Navigate to="/forgot-password" replace />
  }

  const validatePasswords = () => {
    if (!newPassword1.trim() || !newPassword2.trim()) {
      setError('Please fill in both password fields')
      return false
    }

    if (newPassword1.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }

    if (newPassword1 !== newPassword2) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validatePasswords()) {
      return
    }

    showLoader(LOADER_MESSAGES.RESETTING_PASSWORD)
    
    resetPasswordConfirmMutation.mutate(
      {
        new_password1: newPassword1,
        new_password2: newPassword2,
        uid: uid!,
        token: token!,
      },
      {
        onSuccess: () => {
          hideLoader()
          showSuccess(NOTIFICATION_MESSAGES.PASSWORD_RESET_SUCCESS)
          navigate('/login')
        },
        onError: (error) => {
          console.error('Reset password confirm failed:', error)
          hideLoader()
          setError('Failed to reset password. The link may be invalid or expired.')
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
          <h2>Set New Password</h2>
          <p className="auth-description">
            Enter your new password below to complete the reset process.
          </p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword1">New Password <span className="required">*</span></label>
              <input
                id="newPassword1"
                type="password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                required
                placeholder="Enter new password"
                disabled={resetPasswordConfirmMutation.isPending}
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword2">Confirm New Password <span className="required">*</span></label>
              <input
                id="newPassword2"
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                placeholder="Confirm new password"
                disabled={resetPasswordConfirmMutation.isPending}
                minLength={8}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <Button
              primary
              label={resetPasswordConfirmMutation.isPending ? 'Resetting...' : 'Reset Password'}
              type="submit"
              disabled={resetPasswordConfirmMutation.isPending}
              style={{ width: '100%' }}
            />
          </form>

          <div className="auth-links">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Copyright />
    </>
  )
}