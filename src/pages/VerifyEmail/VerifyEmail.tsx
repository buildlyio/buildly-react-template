import { useEffect, useRef } from 'react'
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useVerifyEmailMutation } from '../../api/auth'
import { useLoader } from '../../hooks/useLoader'
import { useNotification } from '../../hooks/useNotification'
import { Copyright } from '../../components/Copyright/Copyright'
import { env } from '../../utils/env'
import { LOADER_MESSAGES, NOTIFICATION_MESSAGES } from '../../utils/constants'
import darkLogo from '../../assets/dark-logo.png'
import '../../styles/auth-pages.css'

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const verificationStarted = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const navigate = useNavigate()
  const { checkAuth } = useAuthStore()
  const { showLoader, hideLoader } = useLoader()
  const { showSuccess, showError } = useNotification()
  const verifyEmailMutation = useVerifyEmailMutation()

  useEffect(() => {
    document.title = `Verify Email - ${env.APP_NAME}`
  }, [])

  useEffect(() => {
    // Skip verification if already authenticated or already started
    if (checkAuth() || verificationStarted.current) {
      return
    }

    const token = searchParams.get('token')
    
    if (!token) {
      showError('Invalid verification link. No token provided.')
      navigate('/login', { replace: true })
      return
    }

    // Mark that we've started verification to prevent multiple calls
    verificationStarted.current = true

    // Start verification process
    showLoader(LOADER_MESSAGES.VERIFYING_EMAIL)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Add a timeout fallback in case API hangs
    timeoutRef.current = setTimeout(() => {
      hideLoader()
      showError('Email verification service is currently unavailable. Please try logging in - your account may already be verified.')
      navigate('/login', { replace: true })
    }, 10000) // 10 second timeout
    
    // Use mutateAsync for better promise handling
    verifyEmailMutation.mutateAsync({ token })
      .then(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        hideLoader()
        showSuccess(NOTIFICATION_MESSAGES.EMAIL_VERIFIED)
        navigate('/login', { replace: true })
      })
      .catch((error) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        hideLoader()
        showError(NOTIFICATION_MESSAGES.EMAIL_VERIFICATION_FAILED)
        navigate('/login', { replace: true })
      })
  }, [searchParams, navigate, checkAuth])

  // Redirect if already authenticated
  if (checkAuth()) {
    return <Navigate to="/app" replace />
  }


  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src={darkLogo} alt={env.APP_NAME} />
          </div>
          <h2>Email Verification</h2>
          <p className="auth-description">
            Verifying your email address...
          </p>
        </div>
      </div>
      <Copyright />
    </>
  )
}