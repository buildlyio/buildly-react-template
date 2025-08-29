import { useState, useEffect, useMemo } from 'react'
import type { User, Organization, CoreGroup } from '../../api/users'
import { useAuthStore } from '../../stores/authStore'
import { getUserRole } from '../../utils/userRoles'
import './EditUserModal.css'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  organizations: Organization[]
  coreGroups: CoreGroup[]
  onUpdate: (userData: Partial<User>) => void
  isLoading?: boolean
}

export const EditUserModal = ({ 
  isOpen, 
  onClose, 
  user, 
  organizations, 
  coreGroups, 
  onUpdate, 
  isLoading = false 
}: EditUserModalProps) => {
  const { user: currentUser } = useAuthStore()
  const currentUserRole = currentUser ? getUserRole(currentUser) : 'user'
  const isGlobalAdmin = currentUserRole === 'global-admin'

  const [formData, setFormData] = useState({
    organization: '',
    is_active: true,
    access_level: ''
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form data when user changes
  useEffect(() => {
    if (user && isOpen) {
      const initialData = {
        organization: user.organization.organization_uuid || '',
        is_active: user.is_active,
        access_level: user.core_groups[0]?.uuid || ''
      }
      setFormData(initialData)
      setHasChanges(false)
    }
  }, [user, isOpen])

  // Check for changes
  useEffect(() => {
    if (!user) return

    const originalData = {
      organization: user.organization.organization_uuid || '',
      is_active: user.is_active,
      access_level: user.core_groups[0]?.uuid || ''
    }

    const hasChanged = 
      formData.organization !== originalData.organization ||
      formData.is_active !== originalData.is_active ||
      formData.access_level !== originalData.access_level

    setHasChanges(hasChanged)
  }, [formData, user])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // If organization changes, reset access level
      if (field === 'organization') {
        newData.access_level = ''
      }
      
      return newData
    })
  }

  // Filter core groups based on selected organization or current user's organization
  const filteredCoreGroups = useMemo(() => {
    let targetOrganization = formData.organization
    
    // If user is not Global Admin, use the current user's organization
    if (!isGlobalAdmin && currentUser) {
      targetOrganization = currentUser.organization.organization_uuid
    }
    
    if (!targetOrganization) {
      return coreGroups.filter(group => group.is_global)
    }
    
    return coreGroups.filter(group => {
      // Include global groups
      if (group.is_global) return true
      
      // Include groups that match the target organization
      if (group.organization) {
        // If group.organization is an object with organization_uuid
        if (group.organization.organization_uuid) {
          return group.organization.organization_uuid === targetOrganization
        }
        // If group.organization is just an ID/UUID reference
        return group.organization === targetOrganization || 
               group.organization.toString() === targetOrganization
      }
      
      return false
    })
  }, [coreGroups, formData.organization, isGlobalAdmin, currentUser])

  const handleUpdate = () => {
    if (!hasChanges || !user) return

    // Start with complete user data
    const updateData: any = {
      ...user,
      // Override with any changes
    }
    
    if (formData.organization !== user.organization.organization_uuid) {
      // Find and include the entire organization object
      const selectedOrg = organizations.find(org => org.organization_uuid === formData.organization)
      updateData.organization = selectedOrg || user.organization
    }
    
    if (formData.is_active !== user.is_active) {
      updateData.is_active = formData.is_active
    }

    if (formData.access_level !== (user.core_groups[0]?.uuid || '')) {
      // Find the selected core group and replace core_groups array
      const selectedCoreGroup = coreGroups.find(group => group.uuid === formData.access_level)
      if (selectedCoreGroup) {
        updateData.core_groups = [selectedCoreGroup]
      }
    }

    onUpdate(updateData)
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        organization: '',
        is_active: true,
        access_level: ''
      })
      setHasChanges(false)
    }
  }, [isOpen])

  if (!isOpen || !user) return null

  return (
    <div className="edit-user-modal-overlay" onClick={onClose}>
      <div className="edit-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-user-modal-header">
          <h2>Edit User</h2>
          <button
            onClick={onClose}
            className="edit-user-modal-close"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="edit-user-modal-body">
          {/* User Info Display */}
          <div className="user-info-section">
            <div className="user-info">
              <h3>{user.first_name} {user.last_name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-username">@{user.username}</p>
            </div>
            <div className="user-status-toggle">
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="active-header"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  disabled={isLoading}
                  className="toggle-input"
                />
                <label htmlFor="active-header" className="toggle-label">
                  <span className="toggle-switch"></span>
                  <span className="toggle-text">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-section">
            {/* Organization Select - Only visible to Global Admin */}
            {isGlobalAdmin && (
              <div className="form-field">
                <label htmlFor="organization">Organization</label>
                <select
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  disabled={isLoading}
                  className="form-select"
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org.organization_uuid} value={org.organization_uuid}>
                      {org.name.charAt(0).toUpperCase() + org.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Access Level Select */}
            <div className="form-field">
              <label htmlFor="access-level">Access Level</label>
              <select
                id="access-level"
                value={formData.access_level}
                onChange={(e) => handleInputChange('access_level', e.target.value)}
                disabled={isLoading}
                className="form-select"
              >
                <option value="">Select Access Level</option>
                {filteredCoreGroups.map((group) => (
                  <option key={group.uuid} value={group.uuid}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="edit-user-modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="btn-primary"
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </div>
    </div>
  )
}