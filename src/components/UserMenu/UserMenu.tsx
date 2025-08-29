import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useNotification } from '../../hooks/useNotification'
import { NOTIFICATION_MESSAGES } from '../../utils/constants'
import { canAccessUserManagement } from '../../utils/userRoles'
import './UserMenu.css'

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    showSuccess(NOTIFICATION_MESSAGES.LOGOUT_SUCCESS)
    navigate('/login')
  }

  const closeMenu = () => setIsOpen(false)

  const getUserInitials = () => {
    if (!user?.first_name || !user?.last_name) return 'U'
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
  }

  const canShowUserManagement = canAccessUserManagement(user)

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className={`user-menu-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
        title={`${user?.first_name} ${user?.last_name}`}
      >
        <svg 
          className="profile-icon" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>

      <div className={`user-menu-dropdown ${isOpen ? 'open' : ''}`}>
        <div className="user-menu-header">
          <div className="user-avatar large">
            {getUserInitials()}
          </div>
          <div className="user-info">
            <div className="user-name">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="user-email">
              {user?.email}
            </div>
          </div>
        </div>

        <div className="user-menu-divider"></div>

        <div className="user-menu-items">
          {canShowUserManagement && (
            <Link 
              to="/app/user-management" 
              className="user-menu-item"
              onClick={closeMenu}
            >
              <div className="menu-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="menu-item-content">
                <span className="menu-item-title">User Management</span>
                <span className="menu-item-subtitle">Manage users and roles</span>
              </div>
            </Link>
          )}

          <button 
            className="user-menu-item logout"
            onClick={handleLogout}
          >
            <div className="menu-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <div className="menu-item-content">
              <span className="menu-item-title">Logout</span>
              <span className="menu-item-subtitle">Sign out of your account</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}