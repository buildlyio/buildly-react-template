import { useState, useMemo } from 'react'
import { type User } from '../../api/users'
import { getUserRole } from '../../utils/userRoles'
import './UsersTab.css'

interface UsersTabProps {
  users: User[]
  isLoading: boolean
  error: string | null
  onEditUser: (user: User) => void
}

export const UsersTab = ({ users, isLoading, error, onEditUser }: UsersTabProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [accessLevelFilter, setAccessLevelFilter] = useState<'all' | 'global-admin' | 'admin' | 'user'>('all')
  const itemsPerPage = 10

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    let filtered = users
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
        const email = user.email.toLowerCase()
        const orgName = user.organization.name.toLowerCase()
        const search = searchTerm.toLowerCase()
        
        return fullName.includes(search) || 
               email.includes(search) || 
               orgName.includes(search)
      })
    }
    
    // Apply active status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (activeFilter === 'active') return user.is_active
        if (activeFilter === 'inactive') return !user.is_active
        return true
      })
    }
    
    // Apply access level filter
    if (accessLevelFilter !== 'all') {
      filtered = filtered.filter(user => {
        const userRole = getUserRole(user)
        return userRole === accessLevelFilter
      })
    }
    
    return filtered
  }, [users, searchTerm, activeFilter, accessLevelFilter])

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const getAccessLevel = (user: User) => {
    const role = getUserRole(user)
    const orgName = user.organization.name
    
    switch (role) {
      case 'global-admin':
        return 'Global Admin'
      case 'admin':
        return `Admin - ${orgName}`
      case 'user':
        return `User - ${orgName}`
      default:
        return `User - ${orgName}`
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleActiveFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleAccessLevelFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccessLevelFilter(e.target.value as 'all' | 'global-admin' | 'admin' | 'user')
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleEditUser = (user: User) => {
    onEditUser(user)
  }

  if (isLoading) {
    return (
      <div className="users-tab-loading">
        <div className="loading-spinner">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="users-tab-error">
        <p>Error loading users: {error}</p>
      </div>
    )
  }

  return (
    <div className="users-tab">
      {/* Search and Filters */}
      <div className="users-filters">
        <div className="users-search">
          <input
            type="text"
            placeholder="Search users by name, email, or organization..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="active-filter">Status:</label>
            <select
              id="active-filter"
              value={activeFilter}
              onChange={handleActiveFilterChange}
              className="filter-select"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="access-filter">Access Level:</label>
            <select
              id="access-filter"
              value={accessLevelFilter}
              onChange={handleAccessLevelFilterChange}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              <option value="global-admin">Global Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Active</th>
              <th>Access Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="user-name">
                  {user.first_name} {user.last_name}
                </td>
                <td className="user-email">{user.email}</td>
                <td className="user-organization" style={{textTransform: 'capitalize'}}>{user.organization.name}</td>
                <td className="user-active">
                  {user.is_active ? (
                    <span className="status-active" title="Active">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </span>
                  ) : (
                    <span className="status-inactive" title="Inactive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  )}
                </td>
                <td className="user-access-level">
                  <span className={`access-badge ${getUserRole(user)}`}>
                    {getAccessLevel(user)}
                  </span>
                </td>
                <td className="user-actions">
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="action-button edit"
                      title="Edit User"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}