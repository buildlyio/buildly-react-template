// Store and component imports
import { useThemeStore } from '../../stores/themeStore'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { UserMenu } from '../UserMenu/UserMenu'
import { useNavigate } from 'react-router-dom'

// Utilities and assets
import { env } from '../../utils/env'
import lightLogo from '../../assets/light-logo.png'
import darkLogo from '../../assets/dark-logo.png'
import './TopBar.css'

/**
 * TopBar component that appears on all authenticated pages
 * Features:
 * - Gradient background matching login page design
 * - Logo that adapts to current theme (light logo for dark theme, dark logo for light theme)
 * - Theme toggle for switching between light/dark/system modes
 * - User menu with dropdown for user management and logout
 * - Responsive design with proper mobile breakpoints
 * - Sticky positioning for persistent navigation
 */
export const TopBar = () => {
  const { resolvedTheme } = useThemeStore()
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* Logo section - shows appropriate logo based on current theme */}
        <div className="topbar-logo" onClick={() => navigate('/app')} style={{ cursor: 'pointer' }}>
          <img 
            src={resolvedTheme === 'dark' ? lightLogo : darkLogo} 
            alt={env.APP_NAME} 
          />
        </div>
        
        {/* Action items on the right side */}
        <div className="topbar-actions">
          {/* Theme switcher with light/dark/system options */}
          <ThemeToggle />
          
          {/* User menu with dropdown */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}