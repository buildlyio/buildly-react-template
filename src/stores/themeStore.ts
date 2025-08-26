import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (mode: ThemeMode) => void
  initializeTheme: () => void
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.className = theme === 'dark' ? 'dark-theme' : 'light-theme'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolvedTheme: 'light',

      setTheme: (mode: ThemeMode) => {
        const resolvedTheme = mode === 'system' ? getSystemTheme() : mode
        
        set({ mode, resolvedTheme })
        applyTheme(resolvedTheme)
      },

      initializeTheme: () => {
        const { mode } = get()
        const resolvedTheme = mode === 'system' ? getSystemTheme() : mode
        
        set({ resolvedTheme })
        applyTheme(resolvedTheme)

        // Listen for system theme changes
        if (mode === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleChange = (e: MediaQueryListEvent) => {
            const { mode: currentMode } = get()
            if (currentMode === 'system') {
              const newResolvedTheme = e.matches ? 'dark' : 'light'
              set({ resolvedTheme: newResolvedTheme })
              applyTheme(newResolvedTheme)
            }
          }
          
          mediaQuery.addEventListener('change', handleChange)
          
          // Cleanup function (stored in a way that can be called later)
          return () => mediaQuery.removeEventListener('change', handleChange)
        }
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        mode: state.mode
      })
    }
  )
)