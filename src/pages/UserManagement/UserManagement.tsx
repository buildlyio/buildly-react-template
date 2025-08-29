// React and store imports
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

// Component imports
import { TopBar } from '../../components/TopBar/TopBar'
import { UsersTab } from '../../components/UserManagement/UsersTab'
import { UserRolesTab } from '../../components/UserManagement/UserRolesTab'
import { InviteUsersModal } from '../../components/InviteUsersModal/InviteUsersModal'
import { EditUserModal } from '../../components/EditUserModal/EditUserModal'

// API imports
import { useUsersQuery, useCoreGroupsQuery, useOrganizationsQuery, useInviteUsersMutation, useUpdateUserMutation, type User } from '../../api/users'

// Hooks
import { useLoader } from '../../hooks/useLoader'
import { useNotification } from '../../hooks/useNotification'

// Utilities
import { env } from '../../utils/env'
import { LOADER_MESSAGES, NOTIFICATION_MESSAGES } from '../../utils/constants'
import './UserManagement.css'

/**
 * UserManagement page component for managing users, roles, and permissions
 * Features:
 * - Protected route (requires authentication)
 * - TopBar navigation with theme toggle and user menu
 * - Dynamic document title setting
 * - Clean layout ready for future user management functionality
 * - Responsive design with proper spacing and typography
 * 
 * Note: All user management cards and sections have been removed.
 * This is a clean slate ready for new user management features.
 */
export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { accessToken } = useAuthStore()
  const { showLoader, hideLoader } = useLoader()
  const { showSuccess, showError } = useNotification()
  
  // Fetch all data
  const { data: users = [], isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsersQuery(accessToken)
  const { data: coreGroups = [], isLoading: coreGroupsLoading, error: coreGroupsError } = useCoreGroupsQuery(accessToken)
  const { data: organizations = [], isLoading: organizationsLoading, error: organizationsError } = useOrganizationsQuery(accessToken)
  
  // Combined loading state
  const isLoading = usersLoading || coreGroupsLoading || organizationsLoading
  const error = usersError || coreGroupsError || organizationsError
  
  // Invite users mutation
  const inviteUsersMutation = useInviteUsersMutation()
  
  // Update user mutation
  const updateUserMutation = useUpdateUserMutation()

  // Set page title dynamically on component mount
  useEffect(() => {
    document.title = `User Management - ${env.APP_NAME}`
  }, [])

  // Handle global loader based on loading state
  useEffect(() => {
    if (isLoading) {
      showLoader(LOADER_MESSAGES.LOADING_DATA || 'Loading user management data...')
    } else {
      hideLoader()
    }
  }, [isLoading, showLoader, hideLoader])

  // Handle invite users
  const handleInviteUsers = async (emails: string[]) => {
    if (!accessToken) return

    showLoader('Sending invitations...')
    
    try {
      await inviteUsersMutation.mutateAsync({ 
        accessToken, 
        emails 
      })
      
      hideLoader()
      setIsInviteModalOpen(false)
      showSuccess(`Successfully sent ${emails.length} invitation${emails.length > 1 ? 's' : ''}!`)
      
      // Refetch users to get updated list
      refetchUsers()
    } catch (error) {
      hideLoader()
      showError('Failed to send invitations. Please try again.')
    }
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  // Handle update user
  const handleUpdateUser = async (userData: any) => {
    if (!accessToken || !selectedUser) return

    // Transform data to API format - always send all 3 fields
    const apiData: any = {
      // Always include is_active
      is_active: userData.is_active,
      
      // Always include organization_name
      organization_name: userData.organization ? userData.organization.name : selectedUser.organization.name,
      
      // Always include core_groups
      core_groups: userData.core_groups ? [userData.core_groups[0].id] : [selectedUser.core_groups[0].id]
    }

    
    showLoader('Updating user...')
    
    try {
      await updateUserMutation.mutateAsync({
        accessToken,
        userId: selectedUser.id,
        userData: apiData
      })
      
      hideLoader()
      setIsEditModalOpen(false)
      setSelectedUser(null)
      showSuccess('User updated successfully!')
      
      // Auto-refresh users list
      refetchUsers()
    } catch (error) {
      hideLoader()
      showError('Failed to update user. Please try again.')
    }
  }

  return (
    <div className="user-management-page">
      {/* Top navigation bar */}
      <TopBar />
      
      <div className="user-management-container">
        {/* Page header with title and invite button */}
        <div className="user-management-header">
          <h1>User Management</h1>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="invite-users-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Invite Users
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Users ({users.length})
          </button>
          <button 
            className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <path d="M21 15l-3.086-3.086a2.5 2.5 0 0 0-3.536 0L6 21"></path>
            </svg>
            User Roles ({coreGroups.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'users' ? (
            <UsersTab 
              users={users} 
              isLoading={isLoading} 
              error={error?.message || null}
              onEditUser={handleEditUser}
            />
          ) : (
            <UserRolesTab 
              coreGroups={coreGroups} 
              organizations={organizations}
              isLoading={isLoading} 
              error={error?.message || null} 
            />
          )}
        </div>
      </div>

      {/* Invite Users Modal */}
      <InviteUsersModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUsers}
        isLoading={inviteUsersMutation.isPending}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        organizations={organizations}
        coreGroups={coreGroups}
        onUpdate={handleUpdateUser}
        isLoading={updateUserMutation.isPending}
      />
    </div>
  )
}