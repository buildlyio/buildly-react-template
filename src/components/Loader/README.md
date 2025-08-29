# Loader Components

Beautiful, accessible loader components for the application with multiple variants and usage patterns.

## Components

### 1. `<Loader />` - Main Loader Component
Full-featured loader with overlay and customization options.

```tsx
import { Loader } from '../components/Loader/Loader'

// Full-screen overlay loader
<Loader 
  isVisible={isLoading} 
  message="Processing your request..." 
  size="large"
  overlay={true}
/>

// Inline loader without overlay
<Loader 
  isVisible={isLoading} 
  message="Loading data..." 
  size="small"
  overlay={false}
/>
```

### 2. `<InlineLoader />` - Simplified Inline Loader
Convenient component for inline loading states.

```tsx
import { InlineLoader } from '../components/Loader/Loader'

// Simple inline loader
<InlineLoader message="Fetching data..." size="medium" />
```

### 3. `<GlobalLoader />` - App-level Loader
Global loader managed by Zustand store for app-wide loading states.

```tsx
// Already included in App.tsx
import { GlobalLoader } from '../components/GlobalLoader/GlobalLoader'

function App() {
  return (
    <div>
      {/* Your app content */}
      <GlobalLoader />
    </div>
  )
}
```

## Hook: `useLoader`

Manage global loader state from anywhere in the app.

```tsx
import { useLoader } from '../hooks/useLoader'

function MyComponent() {
  const { showLoader, hideLoader, isLoading } = useLoader()
  
  const handleApiCall = async () => {
    showLoader('Processing...')
    
    try {
      await apiCall()
    } catch (error) {
      // Handle error
    } finally {
      hideLoader()
    }
  }
  
  return (
    <button onClick={handleApiCall} disabled={isLoading}>
      Submit
    </button>
  )
}
```

## Props

### Loader Props
```tsx
interface LoaderProps {
  isVisible: boolean      // Controls loader visibility
  message?: string        // Loading message (default: "Loading...")
  size?: 'small' | 'medium' | 'large'  // Loader size
  overlay?: boolean       // Full-screen overlay (default: true)
}
```

### InlineLoader Props
```tsx
interface InlineLoaderProps {
  message?: string        // Loading message
  size?: 'small' | 'medium' | 'large'  // Loader size
}
```

## Usage Examples

### 1. API Call with Global Loader
```tsx
import { useLoader } from '../hooks/useLoader'

const MyComponent = () => {
  const { showLoader, hideLoader } = useLoader()
  
  const handleSubmit = async (data) => {
    showLoader('Saving changes...')
    
    try {
      await saveData(data)
      // Success handling
    } catch (error) {
      // Error handling
    } finally {
      hideLoader()
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### 2. Component-level Loading
```tsx
import { useState } from 'react'
import { Loader } from '../components/Loader/Loader'

const DataList = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchData()
      // Handle data
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <button onClick={loadData}>Load Data</button>
      
      <Loader 
        isVisible={isLoading}
        message="Fetching latest data..."
        size="medium"
        overlay={false}
      />
      
      {/* Your data display */}
    </div>
  )
}
```

### 3. TanStack Query Integration
```tsx
import { useQuery } from '@tanstack/react-query'
import { InlineLoader } from '../components/Loader/Loader'

const UserProfile = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })
  
  if (isLoading) {
    return <InlineLoader message="Loading profile..." size="medium" />
  }
  
  if (error) {
    return <div>Error loading profile</div>
  }
  
  return <div>{/* User profile content */}</div>
}
```

## Features

- **Beautiful Animation**: Smooth spinning rings with pulsing center
- **Accessible**: Proper ARIA attributes and focus management  
- **Responsive**: Adapts to different screen sizes
- **Theme-aware**: Supports light/dark themes
- **Reduced Motion**: Respects user's motion preferences
- **Overlay Protection**: Prevents user interaction during loading
- **Multiple Sizes**: Small, medium, and large variants
- **Customizable Messages**: Dynamic loading text
- **Global State Management**: App-wide loader control

## Accessibility

- Uses proper ARIA attributes (`role="status"`, `aria-live="polite"`)
- Prevents background scrolling during overlay
- Keyboard navigation friendly
- Screen reader compatible
- Respects `prefers-reduced-motion` setting

## Styling

The loader uses CSS custom properties from the theme system:
- `--color-primary` - Main spinner color
- `--color-secondary` - Secondary spinner accent
- `--color-surface` - Background color
- `--color-text-primary` - Message text color

Customize by overriding these CSS variables in your theme.