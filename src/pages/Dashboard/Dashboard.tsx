import { useEffect } from 'react'
import { TopBar } from '../../components/TopBar/TopBar'
import { env } from '../../utils/env'
import './Dashboard.css'

export const Dashboard = () => {
  useEffect(() => {
    document.title = `Dashboard - ${env.APP_NAME}`
  }, [])

  return (
    <div className="dashboard-container">
      <TopBar />
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