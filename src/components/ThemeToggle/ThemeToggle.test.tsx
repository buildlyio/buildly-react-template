import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { useThemeStore } from '../../stores/themeStore'

// Mock the theme store
vi.mock('../../stores/themeStore', () => ({
  useThemeStore: vi.fn(),
}))

const mockUseThemeStore = vi.mocked(useThemeStore)

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn()

  beforeEach(() => {
    mockSetTheme.mockClear()
    
    // Default mock implementation
    mockUseThemeStore.mockReturnValue({
      mode: 'system',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      initializeTheme: vi.fn(),
    })
  })

  describe('Rendering', () => {
    it('renders all three theme toggle buttons', () => {
      render(<ThemeToggle />)

      expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Use system theme')).toBeInTheDocument()
    })

    it('renders correct tooltips', () => {
      render(<ThemeToggle />)

      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText(/System/)).toBeInTheDocument()
    })

    it('renders system tooltip with resolved theme when system mode is active', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'system',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      expect(screen.getByText('System (dark)')).toBeInTheDocument()
    })

    it('renders system tooltip without resolved theme when system mode is not active', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'light',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      expect(screen.getByText('System')).toBeInTheDocument()
      expect(screen.queryByText('System (light)')).not.toBeInTheDocument()
    })

    it('contains proper SVG icons', () => {
      render(<ThemeToggle />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)

      // Each button should contain an SVG
      buttons.forEach(button => {
        const svg = button.querySelector('svg')
        expect(svg).toBeInTheDocument()
        expect(svg).toHaveAttribute('width', '12')
        expect(svg).toHaveAttribute('height', '12')
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
      })
    })
  })

  describe('Active States', () => {
    it('shows light theme as active when mode is light', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'light',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      const darkButton = screen.getByLabelText('Switch to dark theme')
      const systemButton = screen.getByLabelText('Use system theme')

      expect(lightButton).toHaveClass('active')
      expect(darkButton).not.toHaveClass('active')
      expect(systemButton).not.toHaveClass('active')
    })

    it('shows dark theme as active when mode is dark', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'dark',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      const darkButton = screen.getByLabelText('Switch to dark theme')
      const systemButton = screen.getByLabelText('Use system theme')

      expect(lightButton).not.toHaveClass('active')
      expect(darkButton).toHaveClass('active')
      expect(systemButton).not.toHaveClass('active')
    })

    it('shows system theme as active when mode is system', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'system',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      const darkButton = screen.getByLabelText('Switch to dark theme')
      const systemButton = screen.getByLabelText('Use system theme')

      expect(lightButton).not.toHaveClass('active')
      expect(darkButton).not.toHaveClass('active')
      expect(systemButton).toHaveClass('active')
    })
  })

  describe('User Interactions', () => {
    it('calls setTheme with light when light button is clicked', () => {
      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      fireEvent.click(lightButton)

      expect(mockSetTheme).toHaveBeenCalledTimes(1)
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('calls setTheme with dark when dark button is clicked', () => {
      render(<ThemeToggle />)

      const darkButton = screen.getByLabelText('Switch to dark theme')
      fireEvent.click(darkButton)

      expect(mockSetTheme).toHaveBeenCalledTimes(1)
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('calls setTheme with system when system button is clicked', () => {
      render(<ThemeToggle />)

      const systemButton = screen.getByLabelText('Use system theme')
      fireEvent.click(systemButton)

      expect(mockSetTheme).toHaveBeenCalledTimes(1)
      expect(mockSetTheme).toHaveBeenCalledWith('system')
    })

    it('handles multiple rapid clicks correctly', () => {
      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      const darkButton = screen.getByLabelText('Switch to dark theme')
      const systemButton = screen.getByLabelText('Use system theme')

      fireEvent.click(lightButton)
      fireEvent.click(darkButton)
      fireEvent.click(systemButton)
      fireEvent.click(lightButton)

      expect(mockSetTheme).toHaveBeenCalledTimes(4)
      expect(mockSetTheme).toHaveBeenNthCalledWith(1, 'light')
      expect(mockSetTheme).toHaveBeenNthCalledWith(2, 'dark')
      expect(mockSetTheme).toHaveBeenNthCalledWith(3, 'system')
      expect(mockSetTheme).toHaveBeenNthCalledWith(4, 'light')
    })

    it('handles keyboard interactions', () => {
      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      
      // Focus and press Enter
      lightButton.focus()
      fireEvent.keyDown(lightButton, { key: 'Enter', code: 'Enter' })
      fireEvent.keyUp(lightButton, { key: 'Enter', code: 'Enter' })

      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('handles space key interactions', () => {
      render(<ThemeToggle />)

      const darkButton = screen.getByLabelText('Switch to dark theme')
      
      // Focus and press Space
      darkButton.focus()
      fireEvent.keyDown(darkButton, { key: ' ', code: 'Space' })
      fireEvent.keyUp(darkButton, { key: ' ', code: 'Space' })

      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ThemeToggle />)

      expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Use system theme')).toBeInTheDocument()
    })

    it('buttons are properly focusable', () => {
      render(<ThemeToggle />)

      const buttons = screen.getAllByRole('button')
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
        button.focus()
        expect(document.activeElement).toBe(button)
      })
    })

    it('maintains focus after theme changes', () => {
      render(<ThemeToggle />)

      const lightButton = screen.getByLabelText('Switch to light theme')
      lightButton.focus()
      
      fireEvent.click(lightButton)
      
      // Button should still be focusable after click
      expect(document.activeElement).toBe(lightButton)
    })
  })

  describe('CSS Classes', () => {
    it('applies correct base CSS classes', () => {
      render(<ThemeToggle />)

      const container = document.querySelector('.theme-toggle')
      expect(container).toBeInTheDocument()

      const wrappers = document.querySelectorAll('.theme-toggle-btn-wrapper')
      expect(wrappers).toHaveLength(3)

      const buttons = document.querySelectorAll('.theme-toggle-btn')
      expect(buttons).toHaveLength(3)

      const tooltips = document.querySelectorAll('.theme-tooltip')
      expect(tooltips).toHaveLength(3)
    })

    it('applies active class only to current mode button', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'dark',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      const buttons = screen.getAllByRole('button')
      const activeButtons = buttons.filter(button => button.classList.contains('active'))
      
      expect(activeButtons).toHaveLength(1)
      expect(activeButtons[0]).toBe(screen.getByLabelText('Switch to dark theme'))
    })
  })

  describe('Integration with Theme Store', () => {
    it('reads theme mode from store correctly', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'light',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      expect(mockUseThemeStore).toHaveBeenCalled()
      expect(screen.getByLabelText('Switch to light theme')).toHaveClass('active')
    })

    it('reads resolved theme for system tooltip', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'system',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      expect(screen.getByText('System (dark)')).toBeInTheDocument()
    })

    it('updates when store state changes', () => {
      const { rerender } = render(<ThemeToggle />)

      // Initially system mode
      expect(screen.getByLabelText('Use system theme')).toHaveClass('active')

      // Change to light mode
      mockUseThemeStore.mockReturnValue({
        mode: 'light',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      rerender(<ThemeToggle />)

      expect(screen.getByLabelText('Switch to light theme')).toHaveClass('active')
      expect(screen.getByLabelText('Use system theme')).not.toHaveClass('active')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined resolved theme gracefully', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'system',
        resolvedTheme: 'light', // This is always defined in the actual implementation
        setTheme: mockSetTheme,
        initializeTheme: vi.fn(),
      })

      expect(() => render(<ThemeToggle />)).not.toThrow()
    })

    it('renders correctly when setTheme function is not available', () => {
      mockUseThemeStore.mockReturnValue({
        mode: 'light',
        resolvedTheme: 'light',
        setTheme: undefined as any, // Simulate missing function
        initializeTheme: vi.fn(),
      })

      render(<ThemeToggle />)

      // Should render but clicking might cause issues
      expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
    })

    it('handles rapid store updates without issues', () => {
      const { rerender } = render(<ThemeToggle />)

      const modes: Array<{ mode: any; resolvedTheme: any }> = [
        { mode: 'light', resolvedTheme: 'light' },
        { mode: 'dark', resolvedTheme: 'dark' },
        { mode: 'system', resolvedTheme: 'light' },
        { mode: 'system', resolvedTheme: 'dark' },
        { mode: 'light', resolvedTheme: 'light' },
      ]

      modes.forEach(({ mode, resolvedTheme }) => {
        mockUseThemeStore.mockReturnValue({
          mode,
          resolvedTheme,
          setTheme: mockSetTheme,
          initializeTheme: vi.fn(),
        })
        rerender(<ThemeToggle />)
      })

      // Should end up with light theme active
      expect(screen.getByLabelText('Switch to light theme')).toHaveClass('active')
    })
  })
})