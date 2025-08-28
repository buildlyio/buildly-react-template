import { useEffect } from 'react'
import './Notification.css'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationProps {
  id: string
  type: NotificationType
  message: string
  onClose: (id: string) => void
  autoClose?: boolean
}

export const Notification = ({ id, type, message, onClose, autoClose = true }: NotificationProps) => {
  useEffect(() => {
    if (!autoClose) return

    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose, autoClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  return (
    <div 
      className={`notification notification-${type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">
          {message}
        </div>
        <button 
          className="notification-close"
          onClick={() => onClose(id)}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
      <div className={`notification-progress notification-progress-${type}`} />
    </div>
  )
}