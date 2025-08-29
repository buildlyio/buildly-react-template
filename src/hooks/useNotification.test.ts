import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useNotification, useNotificationStore } from './useNotification'

// Mock setTimeout and clearTimeout for testing auto-removal
vi.useFakeTimers()

describe('useNotification Hook', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useNotificationStore.getState().clearAll()
    })
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  describe('Initial State', () => {
    it('should have empty notifications array initially', () => {
      const { result } = renderHook(() => useNotification())

      expect(result.current.notifications).toEqual([])
    })

    it('should have all required functions', () => {
      const { result } = renderHook(() => useNotification())

      expect(typeof result.current.showSuccess).toBe('function')
      expect(typeof result.current.showError).toBe('function')
      expect(typeof result.current.showWarning).toBe('function')
      expect(typeof result.current.showInfo).toBe('function')
      expect(typeof result.current.removeNotification).toBe('function')
      expect(typeof result.current.clearAll).toBe('function')
    })

    it('should have consistent initial state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useNotification())
      const { result: result2 } = renderHook(() => useNotification())

      expect(result1.current.notifications).toEqual(result2.current.notifications)
      expect(result1.current.notifications).toHaveLength(0)
    })
  })

  describe('Adding Notifications', () => {
    describe('showSuccess', () => {
      it('should add success notification with default options', () => {
        const { result } = renderHook(() => useNotification())

        act(() => {
          result.current.showSuccess('Success message')
        })

        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0]).toMatchObject({
          type: 'success',
          message: 'Success message',
          duration: 5000,
          persistent: false,
        })
        expect(result.current.notifications[0].id).toBeTruthy()
      })

      it('should add success notification with custom options', () => {
        const { result } = renderHook(() => useNotification())

        act(() => {
          result.current.showSuccess('Success message', { duration: 3000, persistent: true })
        })

        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0]).toMatchObject({
          type: 'success',
          message: 'Success message',
          duration: 3000,
          persistent: true,
        })
      })
    })

    describe('showError', () => {
      it('should add error notification', () => {
        const { result } = renderHook(() => useNotification())

        act(() => {
          result.current.showError('Error message')
        })

        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0]).toMatchObject({
          type: 'error',
          message: 'Error message',
          duration: 5000,
          persistent: false,
        })
      })

      it('should add error notification with persistent option', () => {
        const { result } = renderHook(() => useNotification())

        act(() => {
          result.current.showError('Critical error', { persistent: true })
        })

        expect(result.current.notifications[0]).toMatchObject({
          type: 'error',
          message: 'Critical error',
          persistent: true,
        })
      })
    })

    describe('showWarning', () => {
      it('should add warning notification', () => {
        const { result } = renderHook(() => useNotification())

        act(() => {
          result.current.showWarning('Warning message')
        })

        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0]).toMatchObject({
          type: 'warning',
          message: 'Warning message',
        })
      })
    })

    describe('showInfo', () => {
      it('should add info notification', () => {
        const { result } = renderHook(() => useNotification())

        act(() => {
          result.current.showInfo('Info message')
        })

        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0]).toMatchObject({
          type: 'info',
          message: 'Info message',
        })
      })
    })

    it('should add multiple notifications', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Success 1')
        result.current.showError('Error 1')
        result.current.showWarning('Warning 1')
        result.current.showInfo('Info 1')
      })

      expect(result.current.notifications).toHaveLength(4)
      expect(result.current.notifications[0].type).toBe('success')
      expect(result.current.notifications[1].type).toBe('error')
      expect(result.current.notifications[2].type).toBe('warning')
      expect(result.current.notifications[3].type).toBe('info')
    })

    it('should generate unique IDs for notifications', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Message 1')
        result.current.showSuccess('Message 2')
      })

      expect(result.current.notifications).toHaveLength(2)
      expect(result.current.notifications[0].id).not.toBe(result.current.notifications[1].id)
      expect(result.current.notifications[0].id).toBeTruthy()
      expect(result.current.notifications[1].id).toBeTruthy()
    })
  })

  describe('Auto-Removal', () => {
    it('should auto-remove non-persistent notifications after duration', async () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Auto-remove message', { duration: 1000 })
      })

      expect(result.current.notifications).toHaveLength(1)

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(0)
      })
    })

    it('should not auto-remove persistent notifications', async () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showError('Persistent error', { persistent: true, duration: 1000 })
      })

      expect(result.current.notifications).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Should still be there after the duration
      expect(result.current.notifications).toHaveLength(1)
    })

    it('should not auto-remove notifications with duration 0', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showInfo('No auto-remove', { duration: 0 })
      })

      expect(result.current.notifications).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(10000) // Long time
      })

      expect(result.current.notifications).toHaveLength(1)
    })

    it('should handle multiple auto-removing notifications with different durations', async () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Short message', { duration: 500 })
        result.current.showInfo('Long message', { duration: 1500 })
      })

      expect(result.current.notifications).toHaveLength(2)

      // After 500ms, first should be removed
      act(() => {
        vi.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0].message).toBe('Long message')
      })

      // After additional 1000ms, second should be removed
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(0)
      })
    })
  })

  describe('Manual Removal', () => {
    it('should remove notification by ID', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Message to remove')
      })

      const notificationId = result.current.notifications[0].id

      act(() => {
        result.current.removeNotification(notificationId)
      })

      expect(result.current.notifications).toHaveLength(0)
    })

    it('should only remove specified notification when multiple exist', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Keep this')
        result.current.showError('Remove this')
        result.current.showInfo('Keep this too')
      })

      const removeId = result.current.notifications[1].id

      act(() => {
        result.current.removeNotification(removeId)
      })

      expect(result.current.notifications).toHaveLength(2)
      expect(result.current.notifications[0].message).toBe('Keep this')
      expect(result.current.notifications[1].message).toBe('Keep this too')
    })

    it('should handle removal of non-existent notification ID gracefully', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Test message')
      })

      expect(() => {
        act(() => {
          result.current.removeNotification('non-existent-id')
        })
      }).not.toThrow()

      expect(result.current.notifications).toHaveLength(1)
    })

    it('should clear all notifications', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Success 1')
        result.current.showError('Error 1')
        result.current.showWarning('Warning 1')
      })

      expect(result.current.notifications).toHaveLength(3)

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.notifications).toHaveLength(0)
    })

    it('should be safe to clear when no notifications exist', () => {
      const { result } = renderHook(() => useNotification())

      expect(result.current.notifications).toHaveLength(0)

      expect(() => {
        act(() => {
          result.current.clearAll()
        })
      }).not.toThrow()

      expect(result.current.notifications).toHaveLength(0)
    })
  })

  describe('State Persistence Across Hook Instances', () => {
    it('should share notification state between hook instances', () => {
      const { result: result1 } = renderHook(() => useNotification())
      const { result: result2 } = renderHook(() => useNotification())

      act(() => {
        result1.current.showSuccess('Shared notification')
      })

      expect(result1.current.notifications).toHaveLength(1)
      expect(result2.current.notifications).toHaveLength(1)
      expect(result1.current.notifications[0]).toBe(result2.current.notifications[0])
    })

    it('should allow actions from any hook instance', () => {
      const { result: result1 } = renderHook(() => useNotification())
      const { result: result2 } = renderHook(() => useNotification())

      act(() => {
        result1.current.showSuccess('From instance 1')
      })

      const notificationId = result2.current.notifications[0].id

      act(() => {
        result2.current.removeNotification(notificationId)
      })

      expect(result1.current.notifications).toHaveLength(0)
      expect(result2.current.notifications).toHaveLength(0)
    })
  })

  describe('Message Handling', () => {
    it('should handle empty string messages', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('')
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].message).toBe('')
    })

    it('should handle very long messages', () => {
      const { result } = renderHook(() => useNotification())
      const longMessage = 'A'.repeat(1000)

      act(() => {
        result.current.showInfo(longMessage)
      })

      expect(result.current.notifications[0].message).toBe(longMessage)
      expect(result.current.notifications[0].message.length).toBe(1000)
    })

    it('should handle special characters in messages', () => {
      const { result } = renderHook(() => useNotification())
      const specialMessage = 'Message with émojis 🎉 and spëcial chars & symbols!'

      act(() => {
        result.current.showWarning(specialMessage)
      })

      expect(result.current.notifications[0].message).toBe(specialMessage)
    })

    it('should handle HTML-like content in messages', () => {
      const { result } = renderHook(() => useNotification())
      const htmlMessage = '<script>alert("test")</script>Hello <b>world</b>!'

      act(() => {
        result.current.showError(htmlMessage)
      })

      expect(result.current.notifications[0].message).toBe(htmlMessage)
    })
  })

  describe('Options Validation', () => {
    it('should handle negative duration values', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Test', { duration: -1000 })
      })

      expect(result.current.notifications[0].duration).toBe(-1000)

      // Should not auto-remove with negative duration
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.notifications).toHaveLength(1)
    })

    it('should handle undefined options gracefully', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Test', undefined)
      })

      expect(result.current.notifications[0]).toMatchObject({
        type: 'success',
        message: 'Test',
        duration: 5000,
        persistent: false,
      })
    })

    it('should handle partial options', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showError('Test', { duration: 2000 })
      })

      expect(result.current.notifications[0]).toMatchObject({
        type: 'error',
        message: 'Test',
        duration: 2000,
        persistent: false, // Should use default
      })
    })
  })

  describe('Complex Usage Scenarios', () => {
    it('should handle rapid notification creation and removal', () => {
      const { result } = renderHook(() => useNotification())

      // Add many notifications rapidly
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.showInfo(`Message ${i}`)
        })
      }

      expect(result.current.notifications).toHaveLength(10)

      // Remove them rapidly
      const idsToRemove = [...result.current.notifications.map(n => n.id)]
      idsToRemove.forEach(id => {
        act(() => {
          result.current.removeNotification(id)
        })
      })

      expect(result.current.notifications).toHaveLength(0)
    })

    it('should handle mixed persistent and auto-removing notifications', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Auto-remove 1', { duration: 1000 })
        result.current.showError('Persistent 1', { persistent: true })
        result.current.showWarning('Auto-remove 2', { duration: 2000 })
        result.current.showInfo('Persistent 2', { persistent: true })
      })

      expect(result.current.notifications).toHaveLength(4)

      // After 1 second
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.notifications).toHaveLength(3)
      expect(result.current.notifications.some(n => n.message === 'Auto-remove 1')).toBe(false)

      // After another second
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.notifications).toHaveLength(2)
      expect(result.current.notifications.every(n => n.persistent)).toBe(true)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle component unmounting with active timers', () => {
      const { result, unmount } = renderHook(() => useNotification())

      act(() => {
        result.current.showSuccess('Test', { duration: 1000 })
      })

      expect(() => unmount()).not.toThrow()

      // Timer should still work for other instances
      const { result: newResult } = renderHook(() => useNotification())
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(newResult.current.notifications).toHaveLength(0)
    })

    it('should be stable during rapid re-renders', () => {
      const { result, rerender } = renderHook(() => useNotification())

      const initialShowSuccess = result.current.showSuccess
      const initialRemoveNotification = result.current.removeNotification

      for (let i = 0; i < 10; i++) {
        rerender()
      }

      expect(result.current.showSuccess).toBe(initialShowSuccess)
      expect(result.current.removeNotification).toBe(initialRemoveNotification)
    })

    it('should handle store state corruption gracefully', () => {
      const { result } = renderHook(() => useNotification())

      // Manually corrupt the store state (simulating edge case)
      act(() => {
        useNotificationStore.setState({ notifications: null as any })
      })

      // Hook should handle this gracefully
      expect(() => {
        result.current.showSuccess('Test after corruption')
      }).not.toThrow()
    })
  })

  describe('Direct Store Access', () => {
    it('should work alongside direct store access', () => {
      const { result } = renderHook(() => useNotification())

      // Add via hook
      act(() => {
        result.current.showSuccess('From hook')
      })

      // Verify via direct store access
      expect(useNotificationStore.getState().notifications).toHaveLength(1)

      // Add via direct store access
      act(() => {
        useNotificationStore.getState().addNotification({
          type: 'error',
          message: 'From store',
        })
      })

      // Verify via hook
      expect(result.current.notifications).toHaveLength(2)
    })
  })
})