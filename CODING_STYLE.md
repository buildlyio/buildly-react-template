# Buildly React Template - Coding Style Guide

This document defines the coding standards and conventions used throughout this React TypeScript application. **ALL changes to the codebase MUST follow these guidelines**.

## 🚨 MANDATORY DEVELOPMENT WORKFLOW

### Before Making ANY Changes:
1. **Read and understand** these coding style guidelines
2. **Plan your implementation** following the established patterns
3. **Write code** adhering to all conventions below
4. **Test your changes** to ensure they work correctly
5. **Update documentation** (README.md and CLAUDE.md) to reflect changes
6. **Commit changes** with descriptive commit messages

---

## 📋 React Component Patterns

### Component Structure (MANDATORY)
```typescript
/**
 * Component description with features and purpose
 * Features:
 * - Feature 1 description
 * - Feature 2 description
 */
export const ComponentName = () => {
  // Component implementation
}
```

**Requirements:**
- ✅ **Named exports only**: `export const ComponentName`
- ✅ **Functional components only**: No class components
- ✅ **JSDoc comments**: Document component purpose and features
- ✅ **Co-location pattern**: Component, styles, tests, stories in same directory

### Props and TypeScript (MANDATORY)
```typescript
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  required: string
  optional?: boolean
  variant?: 'small' | 'medium' | 'large'
}

export const Component = ({ 
  required,
  optional = false,
  variant = 'medium',
  className,
  ...props 
}: ComponentProps) => {
  // Implementation
}
```

**Requirements:**
- ✅ **Interface-based props**: Always define props via TypeScript interfaces
- ✅ **Extend HTML attributes**: When applicable, extend appropriate HTML element interfaces
- ✅ **Default parameters**: Use destructuring defaults `optional = false`
- ✅ **Spread remaining props**: Always use `{...props}` for HTML attributes

---

## 🔧 TypeScript Usage (MANDATORY)

### Type Definitions
```typescript
// ✅ CORRECT - Use interfaces for object shapes
interface User {
  id: number
  name: string
  email?: string
}

// ✅ CORRECT - Use const assertions for immutable data
export const CONSTANTS = {
  MAX_ITEMS: 10,
  TIMEOUT: 5000,
} as const

// ✅ CORRECT - Union types for limited values
type Theme = 'light' | 'dark' | 'system'
```

**Requirements:**
- ✅ **Strict typing**: All functions, variables, components must have explicit types
- ✅ **Interface over type**: Use `interface` for object shapes
- ✅ **Const assertions**: Use `as const` for immutable objects
- ✅ **Union types**: For limited value sets
- ✅ **Optional properties**: Use `?:` for optional fields

### Type Organization
```typescript
// ✅ CORRECT - Define interfaces inline or in API files
interface ComponentProps {
  data: User[]
  onUpdate: (user: User) => void
}

// ✅ CORRECT - Import shared types from API files
import type { User, Organization } from '../../api/users'
```

**Requirements:**
- ✅ **Inline interfaces**: Define simple interfaces directly in component files
- ✅ **Shared types**: Define complex types in API files and import with `type` keyword
- ✅ **Generic types**: Use generics for reusable components and hooks

---

## 🏪 State Management Patterns (MANDATORY)

### Zustand Store Structure
```typescript
interface StoreState {
  data: DataType[]
  isLoading: boolean
  addItem: (item: DataType) => void
  removeItem: (id: string) => void
}

export const useStore = create<StoreState>()((set, get) => ({
  data: [],
  isLoading: false,
  
  addItem: (item) => {
    set((state) => ({
      data: [...state.data, item]
    }))
  },
  
  removeItem: (id) => {
    set((state) => ({
      data: state.data.filter(item => item.id !== id)
    }))
  },
}))

// ✅ CORRECT - Custom hook wrapper
export const useCustomHook = () => {
  const { data, addItem } = useStore()
  return {
    items: data,
    addItem,
    // Expose specific methods only
  }
}
```

**Requirements:**
- ✅ **Zustand pattern**: Use `create<Interface>()((set, get) => ({}))`
- ✅ **Persist middleware**: Use for localStorage integration when needed
- ✅ **Custom hook wrappers**: Create specific hooks that expose only needed methods
- ✅ **Immutable updates**: Always use spread operators for state updates
- ✅ **Flat state structure**: Minimize nesting in state objects

---

## 🌐 API Integration Patterns (MANDATORY)

### TanStack Query Usage
```typescript
// ✅ CORRECT - API function
const fetchUsers = async (token: string): Promise<User[]> => {
  const response = await fetch('/api/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// ✅ CORRECT - Query hook
export const useUsersQuery = (token: string | null) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}

// ✅ CORRECT - Mutation hook (NO error handling in hook)
export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ token, userId, data }: UpdateUserParams) => 
      updateUser(token, userId, data)
    // No onError here - handle at component level
  })
}
```

**Requirements:**
- ✅ **Async/await syntax**: All API functions use async/await
- ✅ **Error throwing**: API functions throw errors, let TanStack Query handle them
- ✅ **Response validation**: Always check `response.ok` before parsing
- ✅ **Type safety**: Explicit return types for all API functions
- ✅ **No redundant error handling**: Handle errors at component level only
- ✅ **Custom hooks**: Wrap TanStack Query hooks for specific use cases

---

## 🎨 Styling Conventions (MANDATORY)

### CSS Custom Properties
```css
/* ✅ CORRECT - Use CSS custom properties */
.component {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.component:hover {
  background-color: var(--color-surface-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ✅ CORRECT - BEM-like modifiers */
.component--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.component--large {
  padding: 12px 24px;
  font-size: 16px;
}
```

**Requirements:**
- ✅ **CSS Custom Properties**: Use `var(--property-name)` for all theme values
- ✅ **Semantic naming**: `--color-text-primary`, not `--blue-500`
- ✅ **Component-scoped CSS**: Each component has its own CSS file
- ✅ **BEM-like naming**: `.component--modifier` for variants
- ✅ **Hover states**: Consistent hover animations with `transform` and `box-shadow`
- ✅ **Transitions**: Use `transition: all 0.2s ease` for smooth interactions

### Style Organization
```
src/
├── styles/
│   ├── theme.css         # Global theme variables
│   ├── forms.css         # Shared form styles
│   └── auth-pages.css    # Shared authentication styles
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.css    # Component-specific styles
│       ├── Button.test.tsx
│       └── Button.stories.tsx
```

**Requirements:**
- ✅ **Co-located CSS**: Component styles in same directory
- ✅ **Global themes**: Theme definitions in `src/styles/theme.css`
- ✅ **Shared styles**: Common styles in separate files when used by multiple components
- ✅ **No CSS-in-JS**: Use pure CSS files with CSS custom properties

---

## 📁 File Organization (MANDATORY)

### Directory Structure
```
src/
├── api/                 # API functions and types
├── components/          # Reusable UI components
│   └── ComponentName/   # Each component in own directory
├── hooks/              # Custom React hooks
├── pages/              # Route-level components
├── stores/             # Zustand state stores
├── styles/             # Global styles and themes
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

**Requirements:**
- ✅ **Feature grouping**: Related components grouped by domain
- ✅ **Co-location**: All related files in same directory
- ✅ **Flat structure**: Minimal nesting within feature directories
- ✅ **Clear separation**: API, components, hooks, pages, stores clearly separated

### Naming Conventions
```typescript
// ✅ CORRECT - File and component naming
// File: src/components/UserMenu/UserMenu.tsx
export const UserMenu = () => {}

// ✅ CORRECT - Interface naming
interface UserMenuProps {}

// ✅ CORRECT - Variable and function naming
const handleSubmit = () => {}
const isLoading = true

// ✅ CORRECT - Constant naming
export const API_ENDPOINTS = {
  USERS: '/api/users',
} as const
```

**Requirements:**
- ✅ **PascalCase**: Components, interfaces, types
- ✅ **camelCase**: Variables, functions, object properties
- ✅ **UPPER_SNAKE_CASE**: Constants and enum-like objects
- ✅ **kebab-case**: CSS classes and file names for styles
- ✅ **Descriptive names**: Clear, self-documenting names

---

## 📥 Import/Export Patterns (MANDATORY)

### Import Organization
```typescript
// ✅ CORRECT - Import order and grouping
// 1. React and React-related imports
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Third-party library imports  
import { useMutation } from '@tanstack/react-query'

// 3. Local component imports
import { Button } from '../../components/Button/Button'
import { useAuthStore } from '../../stores/authStore'

// 4. Utility and constant imports
import { env } from '../../utils/env'
import { LOADER_MESSAGES } from '../../utils/constants'

// 5. Asset imports
import darkLogo from '../../assets/dark-logo.png'

// 6. Style imports (last)
import './ComponentName.css'
```

**Requirements:**
- ✅ **Grouped imports**: React, third-party, local components, utilities, assets, styles
- ✅ **Named imports**: Use `{ useState }` instead of default imports when possible
- ✅ **Relative paths**: Use `../../` with explicit file extensions for local imports
- ✅ **Type imports**: Use `import type { }` for type-only imports

### Export Patterns
```typescript
// ✅ CORRECT - Named exports preferred
export const ComponentName = () => {}
export interface ComponentProps {}
export type ComponentVariant = 'small' | 'large'

// ❌ AVOID - Default exports (except for special cases)
// export default ComponentName
```

**Requirements:**
- ✅ **Named exports**: Prefer named exports over default exports
- ✅ **No re-exports**: Import directly from source files
- ✅ **Explicit exports**: Export interfaces and types that might be reused

---

## 🚫 Error Handling & UX (MANDATORY)

### Error Handling Patterns
```typescript
// ✅ CORRECT - Component-level error handling
const handleSubmit = async () => {
  try {
    showLoader('Processing...')
    await mutation.mutateAsync(data)
    showSuccess('Operation completed successfully!')
  } catch (error) {
    showError('Operation failed. Please try again.')
    // No console.log or console.error
  } finally {
    hideLoader()
  }
}

// ✅ CORRECT - API function error handling
const apiFunction = async (): Promise<DataType> => {
  const response = await fetch('/api/endpoint')
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}
```

**Requirements:**
- ✅ **Try/catch at component level**: Wrap API calls in try/catch
- ✅ **User-friendly messages**: No technical error details to users
- ✅ **Global notifications**: Use notification system for user feedback
- ✅ **Loading states**: Use global loader for API operations
- ✅ **No console statements**: Remove all console.log, console.error for production

### User Experience Standards
```typescript
// ✅ CORRECT - Loading and feedback patterns
const { showLoader, hideLoader } = useLoader()
const { showSuccess, showError } = useNotification()

// Always show loading states
showLoader('Updating user...')

// Always provide user feedback
showSuccess('User updated successfully!')
showError('Failed to update user. Please try again.')
```

**Requirements:**
- ✅ **Loading indicators**: Always show loading states for async operations
- ✅ **User feedback**: Provide success/error notifications for all operations
- ✅ **Descriptive loading messages**: Use specific messages like "Updating user..."
- ✅ **Consistent patterns**: Use same notification patterns throughout app

---

## 📝 Documentation Standards (MANDATORY)

### Component Documentation
```typescript
/**
 * UserMenu component for authenticated user actions
 * Features:
 * - User profile information display
 * - Dropdown menu with navigation options
 * - Logout functionality with confirmation
 * - Click-outside and escape key handling
 * - Responsive design with mobile support
 */
export const UserMenu = () => {
  // Implementation
}
```

### Code Comments
```typescript
// ✅ CORRECT - Explain complex logic
const processedGroups = useMemo(() => {
  return coreGroups.map(group => {
    // Find organization name from organizations API if group has organization reference
    let displayName = group.name
    
    if (group.is_global) {
      displayName = group.name // Keep as is for global roles like "Global Admin"
    } else if (group.organization) {
      // Handle both object and ID references for organization
      const org = organizations.find(org => 
        org.id === group.organization || 
        org.organization_uuid === group.organization
      )
      if (org) {
        displayName = `${group.name} - ${org.name}`
      }
    }
    
    return { id: group.id, displayName, permissions: group.permissions }
  })
}, [coreGroups, organizations])
```

**Requirements:**
- ✅ **JSDoc for components**: Document purpose and key features
- ✅ **Inline comments**: Explain complex logic and business rules
- ✅ **API documentation**: Document endpoint usage and data transformations
- ✅ **Update README/CLAUDE**: Always update documentation when making changes

---

## 🔄 MANDATORY PRE-COMMIT CHECKLIST

### Before Every Commit:

1. **✅ Code Quality Check**
   - [ ] All code follows established patterns above
   - [ ] No console.log or console.error statements
   - [ ] All TypeScript errors resolved
   - [ ] All components have proper JSDoc documentation

2. **✅ Testing & Functionality**
   - [ ] All functionality works as expected
   - [ ] Error handling is implemented properly
   - [ ] Loading states and user feedback work correctly
   - [ ] Responsive design is maintained

3. **✅ Documentation Update (MANDATORY)**
   - [ ] Update `README.md` if new features or components added
   - [ ] Update `CLAUDE.md` with implementation details
   - [ ] Update this `CODING_STYLE.md` if new patterns introduced
   - [ ] Verify all documentation is accurate and current

4. **✅ Final Review**
   - [ ] Code is clean and production-ready
   - [ ] All imports are organized correctly
   - [ ] CSS follows naming conventions
   - [ ] File structure is maintained

### Commit Message Format:
```
feat: implement user role management system

- Add UserRolesTab component with read-only permissions display
- Implement conditional API updates for user organization changes
- Add comprehensive error handling with user notifications
- Update documentation to reflect new functionality

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🎯 Key Principles

1. **Consistency First**: Follow established patterns exactly
2. **Type Safety**: Everything must be properly typed
3. **User Experience**: Always provide loading states and feedback
4. **Clean Code**: No debug logging, clear naming, proper documentation
5. **Documentation**: Always update docs before committing
6. **Production Ready**: Code should be ready for production deployment

**Remember: These guidelines are MANDATORY. All code changes must follow these patterns to maintain code quality and consistency.**