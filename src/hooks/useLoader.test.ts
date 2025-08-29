import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoader, useLoaderStore } from './useLoader'

describe('useLoader Hook', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useLoaderStore.getState().hide()
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useLoader())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBe('Loading...')
      expect(typeof result.current.showLoader).toBe('function')
      expect(typeof result.current.hideLoader).toBe('function')
    })

    it('should have consistent initial state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useLoader())
      const { result: result2 } = renderHook(() => useLoader())

      expect(result1.current.isLoading).toBe(result2.current.isLoading)
      expect(result1.current.message).toBe(result2.current.message)
    })
  })

  describe('showLoader Function', () => {
    it('should show loader with default message', () => {
      const { result } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe('Loading...')
    })

    it('should show loader with custom message', () => {
      const { result } = renderHook(() => useLoader())
      const customMessage = 'Processing your request...'

      act(() => {
        result.current.showLoader(customMessage)
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe(customMessage)
    })

    it('should update message when showLoader is called multiple times', () => {
      const { result } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader('First message')
      })

      expect(result.current.message).toBe('First message')

      act(() => {
        result.current.showLoader('Second message')
      })

      expect(result.current.message).toBe('Second message')
      expect(result.current.isLoading).toBe(true)
    })

    it('should handle empty string message', () => {
      const { result } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader('')
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe('')
    })

    it('should handle whitespace-only message', () => {
      const { result } = renderHook(() => useLoader())
      const whitespaceMessage = '   '

      act(() => {
        result.current.showLoader(whitespaceMessage)
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe(whitespaceMessage)
    })

    it('should handle special characters in message', () => {
      const { result } = renderHook(() => useLoader())
      const specialMessage = 'Loading... 🚀 Progress: 50% (½)'

      act(() => {
        result.current.showLoader(specialMessage)
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe(specialMessage)
    })

    it('should handle very long message', () => {
      const { result } = renderHook(() => useLoader())
      const longMessage = 'A'.repeat(1000)

      act(() => {
        result.current.showLoader(longMessage)
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe(longMessage)
      expect(result.current.message.length).toBe(1000)
    })
  })

  describe('hideLoader Function', () => {
    it('should hide loader', () => {
      const { result } = renderHook(() => useLoader())

      // First show the loader
      act(() => {
        result.current.showLoader('Test message')
      })

      expect(result.current.isLoading).toBe(true)

      // Then hide it
      act(() => {
        result.current.hideLoader()
      })

      expect(result.current.isLoading).toBe(false)
      // Message should remain the same when hiding
      expect(result.current.message).toBe('Test message')
    })

    it('should be safe to call hideLoader when already hidden', () => {
      const { result } = renderHook(() => useLoader())

      // Ensure it starts hidden
      expect(result.current.isLoading).toBe(false)

      // Hide again - should not throw error
      act(() => {
        result.current.hideLoader()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should preserve message after hiding', () => {
      const { result } = renderHook(() => useLoader())
      const testMessage = 'Saving data...'

      act(() => {
        result.current.showLoader(testMessage)
      })

      act(() => {
        result.current.hideLoader()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBe(testMessage)
    })
  })

  describe('State Persistence Across Hook Instances', () => {
    it('should share state between multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useLoader())
      const { result: result2 } = renderHook(() => useLoader())

      expect(result1.current.isLoading).toBe(result2.current.isLoading)

      act(() => {
        result1.current.showLoader('Shared message')
      })

      expect(result1.current.isLoading).toBe(true)
      expect(result2.current.isLoading).toBe(true)
      expect(result1.current.message).toBe('Shared message')
      expect(result2.current.message).toBe('Shared message')

      act(() => {
        result2.current.hideLoader()
      })

      expect(result1.current.isLoading).toBe(false)
      expect(result2.current.isLoading).toBe(false)
    })

    it('should allow actions from any hook instance', () => {
      const { result: result1 } = renderHook(() => useLoader())
      const { result: result2 } = renderHook(() => useLoader())

      act(() => {
        result1.current.showLoader('From first hook')
      })

      expect(result2.current.isLoading).toBe(true)
      expect(result2.current.message).toBe('From first hook')

      act(() => {
        result2.current.showLoader('From second hook')
      })

      expect(result1.current.isLoading).toBe(true)
      expect(result1.current.message).toBe('From second hook')
    })
  })

  describe('Hook Return Value Structure', () => {
    it('should return object with expected properties', () => {
      const { result } = renderHook(() => useLoader())

      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('message')
      expect(result.current).toHaveProperty('showLoader')
      expect(result.current).toHaveProperty('hideLoader')

      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.message).toBe('string')
      expect(typeof result.current.showLoader).toBe('function')
      expect(typeof result.current.hideLoader).toBe('function')
    })

    it('should have consistent return value structure', () => {
      const { result } = renderHook(() => useLoader())
      const keys = Object.keys(result.current)

      expect(keys.sort()).toEqual(['hideLoader', 'isLoading', 'message', 'showLoader'].sort())
    })
  })

  describe('Function Signature and Behavior', () => {
    it('should accept optional string parameter for showLoader', () => {
      const { result } = renderHook(() => useLoader())

      // Should work with no parameters
      expect(() => {
        act(() => {
          result.current.showLoader()
        })
      }).not.toThrow()

      // Should work with string parameter
      expect(() => {
        act(() => {
          result.current.showLoader('Test message')
        })
      }).not.toThrow()
    })

    it('should not accept parameters for hideLoader', () => {
      const { result } = renderHook(() => useLoader())

      expect(() => {
        act(() => {
          result.current.hideLoader()
        })
      }).not.toThrow()
    })

    it('should maintain function identity between renders', () => {
      const { result, rerender } = renderHook(() => useLoader())

      const initialShowLoader = result.current.showLoader
      const initialHideLoader = result.current.hideLoader

      rerender()

      expect(result.current.showLoader).toBe(initialShowLoader)
      expect(result.current.hideLoader).toBe(initialHideLoader)
    })
  })

  describe('Complex Usage Scenarios', () => {
    it('should handle rapid show/hide cycles', () => {
      const { result } = renderHook(() => useLoader())

      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.showLoader(`Message ${i}`)
        })
        expect(result.current.isLoading).toBe(true)

        act(() => {
          result.current.hideLoader()
        })
        expect(result.current.isLoading).toBe(false)
      }
    })

    it('should handle nested show/hide operations correctly', () => {
      const { result } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader('Operation 1')
        result.current.showLoader('Operation 2')
        result.current.showLoader('Operation 3')
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe('Operation 3')

      act(() => {
        result.current.hideLoader()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should work correctly in async scenarios', async () => {
      const { result } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader('Starting async operation...')
      })

      expect(result.current.isLoading).toBe(true)

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 10))

      act(() => {
        result.current.showLoader('Async operation in progress...')
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe('Async operation in progress...')

      await new Promise(resolve => setTimeout(resolve, 10))

      act(() => {
        result.current.hideLoader()
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined messages gracefully', () => {
      const { result } = renderHook(() => useLoader())

      // These would be caught by TypeScript, but test runtime behavior
      act(() => {
        result.current.showLoader(undefined as any)
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe('Loading...') // Should fallback to default
    })

    it('should handle numeric message values', () => {
      const { result } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader(123 as any)
      })

      expect(result.current.isLoading).toBe(true)
      // Should convert to string or handle appropriately
      expect(typeof result.current.message).toBe('string')
    })

    it('should be stable during component unmounting', () => {
      const { result, unmount } = renderHook(() => useLoader())

      act(() => {
        result.current.showLoader('Test message')
      })

      expect(() => unmount()).not.toThrow()

      // After unmount, other instances should still work
      const { result: newResult } = renderHook(() => useLoader())
      expect(newResult.current.isLoading).toBe(true)
      expect(newResult.current.message).toBe('Test message')
    })
  })

  describe('Direct Store Access', () => {
    it('should allow direct store access alongside hook usage', () => {
      const { result } = renderHook(() => useLoader())

      // Use hook to show loader
      act(() => {
        result.current.showLoader('Hook message')
      })

      // Verify state through direct store access
      expect(useLoaderStore.getState().isLoading).toBe(true)
      expect(useLoaderStore.getState().message).toBe('Hook message')

      // Use direct store access to hide
      act(() => {
        useLoaderStore.getState().hide()
      })

      // Verify hook sees the change
      expect(result.current.isLoading).toBe(false)
    })
  })
})