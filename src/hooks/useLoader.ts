import { create } from 'zustand'

interface LoaderState {
  isLoading: boolean
  message: string
  show: (message?: string) => void
  hide: () => void
}

export const useLoaderStore = create<LoaderState>()((set) => ({
  isLoading: false,
  message: 'Loading...',
  
  show: (message = 'Loading...') => {
    set({ isLoading: true, message })
  },
  
  hide: () => {
    set({ isLoading: false })
  },
}))

// Custom hook for easy loader management
export const useLoader = () => {
  const { isLoading, message, show, hide } = useLoaderStore()
  
  return {
    isLoading,
    message,
    showLoader: show,
    hideLoader: hide,
  }
}