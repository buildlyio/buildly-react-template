interface User {
  core_groups: Array<{
    is_global: boolean
    is_org_level: boolean
  }>
}

export type UserRole = 'global-admin' | 'admin' | 'user'

export const getUserRole = (user: User | null): UserRole => {
  if (!user?.core_groups?.length) return 'user'
  
  const firstGroup = user.core_groups[0]
  
  // 1. Global Admin: is_global is true
  if (firstGroup.is_global) return 'global-admin'
  
  // 2. Admin: is_org_level is true AND all permissions (create, read, update, delete) are true
  if (firstGroup.is_org_level) {
    const permissions = firstGroup.permissions
    const hasAllPermissions = permissions.create && permissions.read && permissions.update && permissions.delete
    
    if (hasAllPermissions) {
      return 'admin'
    }
    
    // 3. User: is_org_level is true AND only read permission is true
    if (permissions.read && !permissions.create && !permissions.update && !permissions.delete) {
      return 'user'
    }
  }
  
  return 'user'
}

export const canAccessUserManagement = (user: User | null): boolean => {
  const role = getUserRole(user)
  return role === 'global-admin' || role === 'admin'
}