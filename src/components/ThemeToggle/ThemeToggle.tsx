// Theme store import
import { useThemeStore } from '../../stores/themeStore'
import type { ThemeMode } from '../../stores/themeStore'
import './ThemeToggle.css'

/**
 * ThemeToggle component providing a pill-shaped toggle for theme selection
 * Features:
 * - Three theme options: Light, Dark, and System (follows OS preference)
 * - Icon-only design with hover tooltips for clarity
 * - Visual feedback with active state highlighting
 * - Accessible with proper ARIA labels
 * - Smooth animations and transitions
 * - Integration with global theme store
 */
export const ThemeToggle = () => {
  const { mode, resolvedTheme, setTheme } = useThemeStore()

  // Handle theme mode changes
  const handleThemeChange = (newMode: ThemeMode) => {
    setTheme(newMode)
  }

  // Helper function to get readable theme label (currently unused but useful for debugging)
  const getThemeLabel = () => {
    if (mode === 'system') {
      return `System (${resolvedTheme})`
    }
    return mode.charAt(0).toUpperCase() + mode.slice(1)
  }

  return (
    <div className="theme-toggle">
      <div className="theme-toggle-btn-wrapper">
        <button
          className={`theme-toggle-btn ${mode === 'light' ? 'active' : ''}`}
          onClick={() => handleThemeChange('light')}
          aria-label="Switch to light theme"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="m12 2v2m0 16v2m8.66-10h-2m-14.66 0h-2m12.66-6.36-1.42 1.42m-9.9 9.9-1.42 1.42m0-11.32 1.42 1.42m9.9 9.9 1.42 1.42"></path>
          </svg>
        </button>
        <div className="theme-tooltip">Light</div>
      </div>
      
      <div className="theme-toggle-btn-wrapper">
        <button
          className={`theme-toggle-btn ${mode === 'dark' ? 'active' : ''}`}
          onClick={() => handleThemeChange('dark')}
          aria-label="Switch to dark theme"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        <div className="theme-tooltip">Dark</div>
      </div>
      
      <div className="theme-toggle-btn-wrapper">
        <button
          className={`theme-toggle-btn ${mode === 'system' ? 'active' : ''}`}
          onClick={() => handleThemeChange('system')}
          aria-label="Use system theme"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>
        <div className="theme-tooltip">
          System {mode === 'system' && `(${resolvedTheme})`}
        </div>
      </div>
    </div>
  )
}