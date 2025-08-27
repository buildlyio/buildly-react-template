import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Loader, InlineLoader } from './Loader'
import { useLoader } from '../../hooks/useLoader'

const meta = {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Beautiful, accessible loader component with multiple variants for different use cases.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Controls loader visibility'
    },
    message: {
      control: 'text',
      description: 'Loading message displayed to user'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the loader'
    },
    overlay: {
      control: 'boolean',
      description: 'Whether to show full-screen overlay'
    }
  }
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

// Basic loader examples
export const FullScreenOverlay: Story = {
  args: {
    isVisible: true,
    message: 'Loading your data...',
    size: 'large',
    overlay: true
  }
}

export const SmallOverlay: Story = {
  args: {
    isVisible: true,
    message: 'Processing...',
    size: 'small',
    overlay: true
  }
}

export const MediumOverlay: Story = {
  args: {
    isVisible: true,
    message: 'Please wait...',
    size: 'medium',
    overlay: true
  }
}

export const InlineSmall: Story = {
  args: {
    isVisible: true,
    message: 'Loading...',
    size: 'small',
    overlay: false
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: 'var(--color-background)' }}>
        <h3>Inline Loader Example</h3>
        <p>This loader appears inline without blocking the entire screen.</p>
        <Story />
        <p>Content below the loader is still visible.</p>
      </div>
    )
  ]
}

export const InlineMedium: Story = {
  args: {
    isVisible: true,
    message: 'Fetching data...',
    size: 'medium',
    overlay: false
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: 'var(--color-background)', textAlign: 'center' }}>
        <h3>Medium Inline Loader</h3>
        <Story />
      </div>
    )
  ]
}

export const CustomMessages: Story = {
  render: () => {
    const messages = [
      'Authenticating user...',
      'Fetching your profile...',
      'Loading dashboard...',
      'Saving changes...',
      'Processing payment...'
    ]
    
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const nextMessage = () => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }
    
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={nextMessage} style={{ marginBottom: '1rem' }}>
          Next Message
        </button>
        <Loader 
          isVisible={true}
          message={messages[currentIndex]}
          size="medium"
          overlay={false}
        />
      </div>
    )
  }
}

// InlineLoader component stories
export const InlineLoaderSmall: StoryObj<typeof InlineLoader> = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h3>Small Inline Loader</h3>
      <InlineLoader message="Loading..." size="small" />
    </div>
  )
}

export const InlineLoaderMedium: StoryObj<typeof InlineLoader> = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h3>Medium Inline Loader</h3>
      <InlineLoader message="Fetching data..." size="medium" />
    </div>
  )
}

export const InlineLoaderLarge: StoryObj<typeof InlineLoader> = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h3>Large Inline Loader</h3>
      <InlineLoader message="Processing request..." size="large" />
    </div>
  )
}

// Interactive example with global loader
export const GlobalLoaderExample: StoryObj = {
  render: () => {
    const LoaderDemo = () => {
      const { showLoader, hideLoader, isLoading } = useLoader()
      
      const simulateApiCall = (message: string, duration: number = 2000) => {
        showLoader(message)
        setTimeout(() => {
          hideLoader()
        }, duration)
      }
      
      return (
        <div style={{ padding: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => simulateApiCall('Signing you in...', 1500)}
            disabled={isLoading}
          >
            Simulate Login
          </button>
          
          <button 
            onClick={() => simulateApiCall('Saving changes...', 2500)}
            disabled={isLoading}
          >
            Simulate Save
          </button>
          
          <button 
            onClick={() => simulateApiCall('Loading dashboard...', 3000)}
            disabled={isLoading}
          >
            Simulate Dashboard Load
          </button>
          
          <button 
            onClick={() => simulateApiCall('Processing payment...', 4000)}
            disabled={isLoading}
          >
            Simulate Payment
          </button>
        </div>
      )
    }
    
    return <LoaderDemo />
  }
}

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Small</h4>
        <Loader isVisible={true} message="Small" size="small" overlay={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Medium</h4>
        <Loader isVisible={true} message="Medium" size="medium" overlay={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Large</h4>
        <Loader isVisible={true} message="Large" size="large" overlay={false} />
      </div>
    </div>
  )
}