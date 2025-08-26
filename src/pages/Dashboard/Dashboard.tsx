import { useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { Button } from '../../components/Button/Button'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import { env } from '../../utils/env'
import lightLogo from '../../assets/light-logo.png'
import darkLogo from '../../assets/dark-logo.png'
import './Dashboard.css'

export const Dashboard = () => {
  const { user, logout } = useAuthStore()
  const { resolvedTheme } = useThemeStore()

  useEffect(() => {
    document.title = `Dashboard - ${env.APP_NAME}`
  }, [])

  const handleLogout = () => {
    logout()
    // Navigation will happen automatically via ProtectedRoute
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <img src={resolvedTheme === 'dark' ? lightLogo : darkLogo} alt={env.APP_NAME} />
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <Button
              label="Logout"
              onClick={handleLogout}
              size="small"
            />
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <section className="welcome-section">
            <h2>Welcome to your Dashboard</h2>
            <p>You are successfully authenticated and can access the protected application.</p>
          </section>
        </div>
      </main>
    </div>
  )
}