import { describe, it, expect } from 'vitest'
import { getUserRole, canAccessUserManagement, type UserRole } from './userRoles'

// Mock user interfaces for testing
interface TestUser {
  core_groups: Array<{
    is_global: boolean
    is_org_level: boolean
    permissions: {
      create: boolean
      read: boolean
      update: boolean
      delete: boolean
    }
  }>
}

describe('User Roles Utilities', () => {
  describe('getUserRole', () => {
    it('should return "user" for null user', () => {
      const result = getUserRole(null)
      expect(result).toBe('user')
    })

    it('should return "user" for user with no core_groups', () => {
      const user = { core_groups: [] }
      const result = getUserRole(user)
      expect(result).toBe('user')
    })

    it('should return "user" for user with undefined core_groups', () => {
      const user = { core_groups: undefined as any }
      const result = getUserRole(user)
      expect(result).toBe('user')
    })

    describe('Global Admin Detection', () => {
      it('should return "global-admin" for user with is_global true', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: true,
              is_org_level: false,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('global-admin')
      })

      it('should return "global-admin" regardless of other permissions when is_global is true', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: true,
              is_org_level: true,
              permissions: {
                create: false,
                read: true,
                update: false,
                delete: false,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('global-admin')
      })

      it('should return "global-admin" when is_global is true and is_org_level is false', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: true,
              is_org_level: false,
              permissions: {
                create: false,
                read: false,
                update: false,
                delete: false,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('global-admin')
      })
    })

    describe('Organization Admin Detection', () => {
      it('should return "admin" for user with is_org_level true and all permissions', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('admin')
      })

      it('should return "user" for user with is_org_level true but missing create permission', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: false, // Missing create permission
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })

      it('should return "user" for user with is_org_level true but missing update permission', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: true,
                read: true,
                update: false, // Missing update permission
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })

      it('should return "user" for user with is_org_level true but missing delete permission', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: false, // Missing delete permission
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })

      it('should return "user" for user with is_org_level true but missing read permission', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: true,
                read: false, // Missing read permission
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })
    })

    describe('Organization User Detection', () => {
      it('should return "user" for user with is_org_level true and only read permission', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: false,
                read: true, // Only read permission
                update: false,
                delete: false,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })

      it('should return "user" for user with is_org_level true and read + create permissions', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: true, // Has create permission (not just read)
                read: true,
                update: false,
                delete: false,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })

      it('should return "user" for user with is_org_level false', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: false,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })
    })

    describe('Edge Cases', () => {
      it('should handle user with missing permissions object', () => {
        const user = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              // Missing permissions object
            } as any,
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })

      it('should only check first core_group', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: false,
                read: true,
                update: false,
                delete: false,
              },
            },
            {
              // Second group with global admin - should be ignored
              is_global: true,
              is_org_level: false,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user') // Based on first group only
      })

      it('should handle user with multiple groups where first is global admin', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: true, // First group is global admin
              is_org_level: false,
              permissions: {
                create: false,
                read: false,
                update: false,
                delete: false,
              },
            },
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('global-admin')
      })

      it('should handle permissions with undefined values', () => {
        const user = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: undefined,
                read: true,
                update: undefined,
                delete: undefined,
              },
            } as any,
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user') // undefined values are falsy
      })

      it('should handle boolean false values correctly', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: false,
              is_org_level: true,
              permissions: {
                create: false,
                read: false,
                update: false,
                delete: false,
              },
            },
          ],
        }
        const result = getUserRole(user)
        expect(result).toBe('user')
      })
    })

    describe('Type Validation', () => {
      it('should return correct UserRole type', () => {
        const user: TestUser = {
          core_groups: [
            {
              is_global: true,
              is_org_level: false,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
          ],
        }
        const result = getUserRole(user)
        const validRoles: UserRole[] = ['global-admin', 'admin', 'user']
        expect(validRoles).toContain(result)
      })
    })
  })

  describe('canAccessUserManagement', () => {
    it('should return true for global admin', () => {
      const user: TestUser = {
        core_groups: [
          {
            is_global: true,
            is_org_level: false,
            permissions: {
              create: false,
              read: false,
              update: false,
              delete: false,
            },
          },
        ],
      }
      const result = canAccessUserManagement(user)
      expect(result).toBe(true)
    })

    it('should return true for admin', () => {
      const user: TestUser = {
        core_groups: [
          {
            is_global: false,
            is_org_level: true,
            permissions: {
              create: true,
              read: true,
              update: true,
              delete: true,
            },
          },
        ],
      }
      const result = canAccessUserManagement(user)
      expect(result).toBe(true)
    })

    it('should return false for user', () => {
      const user: TestUser = {
        core_groups: [
          {
            is_global: false,
            is_org_level: true,
            permissions: {
              create: false,
              read: true,
              update: false,
              delete: false,
            },
          },
        ],
      }
      const result = canAccessUserManagement(user)
      expect(result).toBe(false)
    })

    it('should return false for null user', () => {
      const result = canAccessUserManagement(null)
      expect(result).toBe(false)
    })

    it('should return false for user with no core_groups', () => {
      const user = { core_groups: [] }
      const result = canAccessUserManagement(user)
      expect(result).toBe(false)
    })

    it('should return false for user with insufficient permissions', () => {
      const user: TestUser = {
        core_groups: [
          {
            is_global: false,
            is_org_level: true,
            permissions: {
              create: true,
              read: true,
              update: true,
              delete: false, // Missing delete permission
            },
          },
        ],
      }
      const result = canAccessUserManagement(user)
      expect(result).toBe(false)
    })

    it('should return true for user with global admin even without org-level permissions', () => {
      const user: TestUser = {
        core_groups: [
          {
            is_global: true,
            is_org_level: false,
            permissions: {
              create: false,
              read: false,
              update: false,
              delete: false,
            },
          },
        ],
      }
      const result = canAccessUserManagement(user)
      expect(result).toBe(true)
    })
  })

  describe('Integration Tests', () => {
    it('should consistently return same role for same user data', () => {
      const user: TestUser = {
        core_groups: [
          {
            is_global: false,
            is_org_level: true,
            permissions: {
              create: true,
              read: true,
              update: true,
              delete: true,
            },
          },
        ],
      }

      const role1 = getUserRole(user)
      const role2 = getUserRole(user)
      const canAccess1 = canAccessUserManagement(user)
      const canAccess2 = canAccessUserManagement(user)

      expect(role1).toBe(role2)
      expect(canAccess1).toBe(canAccess2)
      expect(role1).toBe('admin')
      expect(canAccess1).toBe(true)
    })

    it('should handle complex user scenarios correctly', () => {
      const scenarios = [
        {
          description: 'Global admin with org-level permissions',
          user: {
            core_groups: [
              {
                is_global: true,
                is_org_level: true,
                permissions: { create: true, read: true, update: true, delete: true },
              },
            ],
          },
          expectedRole: 'global-admin' as UserRole,
          expectedAccess: true,
        },
        {
          description: 'Org admin with full permissions',
          user: {
            core_groups: [
              {
                is_global: false,
                is_org_level: true,
                permissions: { create: true, read: true, update: true, delete: true },
              },
            ],
          },
          expectedRole: 'admin' as UserRole,
          expectedAccess: true,
        },
        {
          description: 'Read-only user',
          user: {
            core_groups: [
              {
                is_global: false,
                is_org_level: true,
                permissions: { create: false, read: true, update: false, delete: false },
              },
            ],
          },
          expectedRole: 'user' as UserRole,
          expectedAccess: false,
        },
        {
          description: 'User with no org-level access',
          user: {
            core_groups: [
              {
                is_global: false,
                is_org_level: false,
                permissions: { create: true, read: true, update: true, delete: true },
              },
            ],
          },
          expectedRole: 'user' as UserRole,
          expectedAccess: false,
        },
      ]

      scenarios.forEach(({ description, user, expectedRole, expectedAccess }) => {
        const role = getUserRole(user)
        const access = canAccessUserManagement(user)

        expect(role).toBe(expectedRole)
        expect(access).toBe(expectedAccess)
      })
    })
  })
})