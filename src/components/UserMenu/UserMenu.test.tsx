import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { useAuthStore } from '../../stores/authStore'
import { useNotification } from '../../hooks/useNotification'
import { canAccessUserManagement } from '../../utils/userRoles'

// Mock dependencies
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('../../hooks/useNotification', () => ({
  useNotification: vi.fn(),
}))

vi.mock('../../utils/userRoles', () => ({
  canAccessUserManagement: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

const mockUseAuthStore = vi.mocked(useAuthStore)
const mockUseNotification = vi.mocked(useNotification)
const mockCanAccessUserManagement = vi.mocked(canAccessUserManagement)

const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  core_groups: [
    {
      id: 1,
      name: 'Admin',
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
  ],
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('UserMenu', () => {
  const mockLogout = vi.fn()
  const mockShowSuccess = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    mockLogout.mockClear()
    mockShowSuccess.mockClear()
    mockNavigate.mockClear()

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true,
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      tokenType: 'Bearer',
      expiresAt: Date.now() + 3600000,
      setTokenData: vi.fn(),
      checkAuth: vi.fn(),
      isTokenExpired: vi.fn(),
      cleanupExpiredAuth: vi.fn(),
    })

    mockUseNotification.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
    })

    mockCanAccessUserManagement.mockReturnValue(true)

    // Mock useNavigate
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    // Clean up any event listeners
    document.removeEventListener('mousedown', vi.fn())
    document.removeEventListener('keydown', vi.fn())
  })

  describe('Rendering', () => {
    it('renders user menu trigger button', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('renders user initials in trigger button title', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      expect(trigger).toHaveAttribute('title', 'John Doe')
    })

    it('generates correct user initials', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      // Open menu to see the initials
      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const avatar = document.querySelector('.user-avatar.large')
      expect(avatar).toHaveTextContent('JD')
    })

    it('shows default initial when user names are not available', () => {
      mockUseAuthStore.mockReturnValue({
        user: { ...mockUser, first_name: '', last_name: '' },
        logout: mockLogout,
        isAuthenticated: true,
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        tokenType: 'Bearer',
        expiresAt: Date.now() + 3600000,
        setTokenData: vi.fn(),
        checkAuth: vi.fn(),
        isTokenExpired: vi.fn(),
        cleanupExpiredAuth: vi.fn(),
      })

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const avatar = document.querySelector('.user-avatar.large')
      expect(avatar).toHaveTextContent('U')
    })

    it('renders closed dropdown initially', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const dropdown = document.querySelector('.user-menu-dropdown')
      expect(dropdown).toBeInTheDocument()
      expect(dropdown).not.toHaveClass('open')
    })
  })

  describe('Menu Opening and Closing', () => {
    it('opens menu when trigger is clicked', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const dropdown = document.querySelector('.user-menu-dropdown')
      expect(dropdown).toHaveClass('open')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger).toHaveClass('active')
    })

    it('closes menu when trigger is clicked again', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      
      // Open menu
      fireEvent.click(trigger)
      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')

      // Close menu
      fireEvent.click(trigger)
      expect(document.querySelector('.user-menu-dropdown')).not.toHaveClass('open')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).not.toHaveClass('active')
    })

    it('closes menu when clicking outside', async () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)
      
      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')

      // Click outside the menu
      fireEvent.mouseDown(document.body)

      await waitFor(() => {
        expect(document.querySelector('.user-menu-dropdown')).not.toHaveClass('open')
      })
    })

    it('closes menu when escape key is pressed', async () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)
      
      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')

      // Press escape key
      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(document.querySelector('.user-menu-dropdown')).not.toHaveClass('open')
      })
    })

    it('does not close menu when clicking inside menu', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)
      
      const dropdown = document.querySelector('.user-menu-dropdown')
      expect(dropdown).toHaveClass('open')

      // Click inside the menu
      fireEvent.mouseDown(dropdown!)

      expect(dropdown).toHaveClass('open')
    })
  })

  describe('User Information Display', () => {
    it('displays user name and email when menu is open', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    })

    it('handles user with partial name information', () => {
      mockUseAuthStore.mockReturnValue({
        user: { ...mockUser, first_name: 'John', last_name: '' },
        logout: mockLogout,
        isAuthenticated: true,
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        tokenType: 'Bearer',
        expiresAt: Date.now() + 3600000,
        setTokenData: vi.fn(),
        checkAuth: vi.fn(),
        isTokenExpired: vi.fn(),
        cleanupExpiredAuth: vi.fn(),
      })

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      expect(screen.getByText('John ')).toBeInTheDocument()
    })
  })

  describe('User Management Access', () => {
    it('shows User Management link when user has access', () => {
      mockCanAccessUserManagement.mockReturnValue(true)

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      expect(screen.getByText('User Management')).toBeInTheDocument()
      expect(screen.getByText('Manage users and roles')).toBeInTheDocument()
    })

    it('hides User Management link when user does not have access', () => {
      mockCanAccessUserManagement.mockReturnValue(false)

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      expect(screen.queryByText('User Management')).not.toBeInTheDocument()
    })

    it('closes menu when User Management link is clicked', () => {
      mockCanAccessUserManagement.mockReturnValue(true)

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const userMgmtLink = screen.getByText('User Management')
      fireEvent.click(userMgmtLink)

      expect(document.querySelector('.user-menu-dropdown')).not.toHaveClass('open')
    })
  })

  describe('Logout Functionality', () => {
    it('renders logout button', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      expect(screen.getByText('Logout')).toBeInTheDocument()
      expect(screen.getByText('Sign out of your account')).toBeInTheDocument()
    })

    it('handles logout when logout button is clicked', async () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const logoutButton = screen.getByText('Logout').closest('button')!
      fireEvent.click(logoutButton)

      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockShowSuccess).toHaveBeenCalledWith(expect.any(String))
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('closes menu after logout', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const logoutButton = screen.getByText('Logout').closest('button')!
      fireEvent.click(logoutButton)

      expect(document.querySelector('.user-menu-dropdown')).not.toHaveClass('open')
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports Enter key on trigger button', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      trigger.focus()
      
      fireEvent.keyDown(trigger, { key: 'Enter' })
      fireEvent.keyUp(trigger, { key: 'Enter' })

      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')
    })

    it('supports Space key on trigger button', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      trigger.focus()
      
      fireEvent.keyDown(trigger, { key: ' ' })
      fireEvent.keyUp(trigger, { key: ' ' })

      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')
    })

    it('ignores other keys for escape handling', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)
      
      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')

      // Press other keys
      fireEvent.keyDown(document, { key: 'Enter' })
      fireEvent.keyDown(document, { key: 'Space' })
      fireEvent.keyDown(document, { key: 'Tab' })

      expect(document.querySelector('.user-menu-dropdown')).toHaveClass('open')
    })
  })

  describe('Event Listener Cleanup', () => {
    it('removes event listeners when component unmounts', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger) // This should add event listeners

      expect(addEventListenerSpy).toHaveBeenCalled()

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalled()

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('removes event listeners when menu closes', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      
      // Open menu (adds listeners)
      fireEvent.click(trigger)
      
      // Close menu (should remove listeners)
      fireEvent.click(trigger)

      expect(removeEventListenerSpy).toHaveBeenCalled()

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      expect(trigger).toHaveAttribute('aria-label', 'User menu')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('has proper button semantics for logout', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const logoutButton = screen.getByText('Logout').closest('button')!
      expect(logoutButton).toHaveAttribute('type', 'button')
    })

    it('has proper link semantics for user management', () => {
      mockCanAccessUserManagement.mockReturnValue(true)

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const userMgmtLink = screen.getByText('User Management').closest('a')!
      expect(userMgmtLink).toHaveAttribute('href', '/app/user-management')
    })
  })

  describe('Edge Cases', () => {
    it('handles null user gracefully', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        logout: mockLogout,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        tokenType: 'Bearer',
        expiresAt: null,
        setTokenData: vi.fn(),
        checkAuth: vi.fn(),
        isTokenExpired: vi.fn(),
        cleanupExpiredAuth: vi.fn(),
      })

      expect(() =>
        render(
          <TestWrapper>
            <UserMenu />
          </TestWrapper>
        )
      ).not.toThrow()

      const trigger = screen.getByLabelText('User menu')
      expect(trigger).toHaveAttribute('title', ' ') // Empty first/last names
    })

    it('handles missing email gracefully', () => {
      mockUseAuthStore.mockReturnValue({
        user: { ...mockUser, email: '' },
        logout: mockLogout,
        isAuthenticated: true,
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        tokenType: 'Bearer',
        expiresAt: Date.now() + 3600000,
        setTokenData: vi.fn(),
        checkAuth: vi.fn(),
        isTokenExpired: vi.fn(),
        cleanupExpiredAuth: vi.fn(),
      })

      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      fireEvent.click(trigger)

      const emailElement = document.querySelector('.user-email')
      expect(emailElement).toHaveTextContent('')
    })

    it('handles rapid menu open/close correctly', () => {
      render(
        <TestWrapper>
          <UserMenu />
        </TestWrapper>
      )

      const trigger = screen.getByLabelText('User menu')
      
      // Rapid clicks
      fireEvent.click(trigger)
      fireEvent.click(trigger)
      fireEvent.click(trigger)
      fireEvent.click(trigger)

      // Should end up closed
      expect(document.querySelector('.user-menu-dropdown')).not.toHaveClass('open')
    })
  })
})