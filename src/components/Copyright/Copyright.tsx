import { env } from '../../utils/env'
import './Copyright.css'

export const Copyright = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="copyright-footer">
      <div className="copyright-content">
        <p>© {currentYear} {env.APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  )
}