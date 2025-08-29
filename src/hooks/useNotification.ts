import { create } from 'zustand'
import type { NotificationType } from '../components/Notification/Notification'

interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
  persistent?: boolean
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      persistent: false,
      ...notification,
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))
    
    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },
  
  clearAll: () => {
    set({ notifications: [] })
  },
}))

// Custom hook for easy notification management
export const useNotification = () => {
  const { notifications, addNotification, removeNotification, clearAll } = useNotificationStore()
  
  return {
    notifications,
    removeNotification,
    clearAll,
    showSuccess: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ type: 'success', message, ...options }),
    showError: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ type: 'error', message, ...options }),
    showWarning: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ type: 'warning', message, ...options }),
    showInfo: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ type: 'info', message, ...options }),
  }
}