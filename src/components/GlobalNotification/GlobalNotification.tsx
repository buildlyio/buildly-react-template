import { useNotification } from '../../hooks/useNotification'
import { Notification } from '../Notification/Notification'
import './GlobalNotification.css'

export const GlobalNotification = () => {
  const { notifications, removeNotification } = useNotification()
  
  if (notifications.length === 0) return null

  return (
    <div 
      className="global-notification-container"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={removeNotification}
          autoClose={!notification.persistent}
        />
      ))}
    </div>
  )
}