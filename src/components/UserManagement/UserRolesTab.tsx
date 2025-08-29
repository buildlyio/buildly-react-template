import { useMemo } from 'react'
import { type CoreGroup, type Organization } from '../../api/users'
import './UserRolesTab.css'

interface UserRolesTabProps {
  coreGroups: CoreGroup[]
  organizations: Organization[]
  isLoading: boolean
  error: string | null
}

export const UserRolesTab = ({ coreGroups, organizations, isLoading, error }: UserRolesTabProps) => {
  // Process core groups data with organization lookup
  const processedGroups = useMemo(() => {
    return coreGroups.map(group => {
      // Find organization name from organizations API if group has organization reference
      let displayName = group.name
      
      if (group.is_global) {
        displayName = group.name // Keep as is for global roles like "Global Admin"
      } else if (group.organization) {
        const org = organizations.find(org => 
          org.id === group.organization || 
          org.organization_uuid === group.organization ||
          org.organization_uuid === group.organization.toString()
        )
        if (org) {
          displayName = `${group.name} - ${org.name}`
        }
      }
      
      return {
        id: group.id,
        uuid: group.uuid,
        displayName,
        permissions: group.permissions
      }
    }).sort((a, b) => a.displayName.localeCompare(b.displayName))
  }, [coreGroups, organizations])


  const PermissionIcon = ({ enabled }: { enabled: boolean }) => (
    <span className={`permission-icon ${enabled ? 'enabled' : 'disabled'}`} title={enabled ? 'Allowed' : 'Not Allowed'}>
      {enabled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      )}
    </span>
  )

  if (isLoading) {
    return (
      <div className="user-roles-tab-loading">
        <div className="loading-spinner">Loading user roles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-roles-tab-error">
        <p>Error loading user roles: {error}</p>
      </div>
    )
  }

  return (
    <div className="user-roles-tab">

      {/* User Roles Table */}
      <div className="user-roles-table-container">
        <table className="user-roles-table">
          <thead>
            <tr>
              <th>User Group</th>
              <th>Create</th>
              <th>Read</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {processedGroups.map((group) => (
              <tr key={group.uuid}>
                <td className="role-name" style={{textTransform: 'capitalize'}}>{group.displayName}</td>
                <td className="permission-cell">
                  <PermissionIcon enabled={group.permissions.create} />
                </td>
                <td className="permission-cell">
                  <PermissionIcon enabled={group.permissions.read} />
                </td>
                <td className="permission-cell">
                  <PermissionIcon enabled={group.permissions.update} />
                </td>
                <td className="permission-cell">
                  <PermissionIcon enabled={group.permissions.delete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {processedGroups.length === 0 && (
        <div className="no-roles-message">
          <p>No user roles found.</p>
        </div>
      )}
    </div>
  )
}