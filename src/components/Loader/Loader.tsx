import { useEffect } from 'react'
import './Loader.css'

interface LoaderProps {
  isVisible: boolean
  message?: string
  size?: 'small' | 'medium' | 'large'
  overlay?: boolean
}

export const Loader = ({ 
  isVisible, 
  message = 'Loading...', 
  size = 'medium',
  overlay = true 
}: LoaderProps) => {
  // Prevent scrolling when loader is visible and overlay is enabled
  useEffect(() => {
    if (isVisible && overlay) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isVisible, overlay])

  if (!isVisible) return null

  return (
    <div 
      className={`loader-container ${overlay ? 'loader-overlay' : ''}`}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className={`loader-content loader-${size}`}>
        {/* Animated spinning circles */}
        <div className="loader-spinner">
          <div className="spinner-ring spinner-ring-1"></div>
          <div className="spinner-ring spinner-ring-2"></div>
          <div className="spinner-ring spinner-ring-3"></div>
          <div className="spinner-pulse"></div>
        </div>
        
        {message && (
          <p className="loader-message" aria-label={message}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// Inline loader for smaller components (no overlay)
export const InlineLoader = ({ 
  message = 'Loading...', 
  size = 'small' 
}: Omit<LoaderProps, 'isVisible' | 'overlay'>) => {
  return (
    <Loader 
      isVisible={true} 
      message={message} 
      size={size} 
      overlay={false} 
    />
  )
}