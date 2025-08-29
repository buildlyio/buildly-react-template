import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { env } from './env'

// Mock import.meta.env
const mockImportMetaEnv = {
  VITE_API_URL: undefined,
  VITE_APP_NAME: undefined,
  VITE_ENV: undefined,
  VITE_VERSION: undefined,
  VITE_OAUTH_TOKEN_URL: undefined,
  VITE_OAUTH_CLIENT_ID: undefined,
}

vi.stubGlobal('import.meta.env', mockImportMetaEnv)

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Clear window._env_ and import.meta.env before each test
    delete (window as any)._env_
    Object.keys(mockImportMetaEnv).forEach(key => {
      mockImportMetaEnv[key as keyof typeof mockImportMetaEnv] = undefined
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Default Configuration', () => {
    it('should return default values when no environment is set', () => {
      expect(env.API_URL).toBe('http://localhost:3001/api')
      expect(env.APP_NAME).toBe('React App')
      expect(env.ENV).toBe('development')
      expect(env.VERSION).toBe('1.0.0')
      expect(env.OAUTH_TOKEN_URL).toBe('http://localhost:3001/oauth/token/')
      expect(env.OAUTH_CLIENT_ID).toBe('your-client-id')
      expect(env.IS_PRODUCTION).toBe(false)
      expect(env.IS_DEVELOPMENT).toBe(true)
    })
  })

  describe('Vite Environment Variables', () => {
    it('should use Vite environment variables when available', () => {
      mockImportMetaEnv.VITE_API_URL = 'https://api.production.com'
      mockImportMetaEnv.VITE_APP_NAME = 'Production App'
      mockImportMetaEnv.VITE_ENV = 'production'
      mockImportMetaEnv.VITE_VERSION = '2.0.0'
      mockImportMetaEnv.VITE_OAUTH_TOKEN_URL = 'https://oauth.production.com/token/'
      mockImportMetaEnv.VITE_OAUTH_CLIENT_ID = 'prod-client-id'

      // Re-import to get updated values
      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.API_URL).toBe('https://api.production.com')
      expect(updatedEnv.APP_NAME).toBe('Production App')
      expect(updatedEnv.ENV).toBe('production')
      expect(updatedEnv.VERSION).toBe('2.0.0')
      expect(updatedEnv.OAUTH_TOKEN_URL).toBe('https://oauth.production.com/token/')
      expect(updatedEnv.OAUTH_CLIENT_ID).toBe('prod-client-id')
      expect(updatedEnv.IS_PRODUCTION).toBe(true)
      expect(updatedEnv.IS_DEVELOPMENT).toBe(false)
    })

    it('should use partial Vite environment variables with defaults for missing ones', () => {
      mockImportMetaEnv.VITE_API_URL = 'https://custom.api.com'
      mockImportMetaEnv.VITE_APP_NAME = 'Custom App'
      // VITE_ENV, VITE_VERSION, etc. remain undefined

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.API_URL).toBe('https://custom.api.com')
      expect(updatedEnv.APP_NAME).toBe('Custom App')
      expect(updatedEnv.ENV).toBe('development') // default
      expect(updatedEnv.VERSION).toBe('1.0.0') // default
      expect(updatedEnv.OAUTH_TOKEN_URL).toBe('http://localhost:3001/oauth/token/') // default
      expect(updatedEnv.OAUTH_CLIENT_ID).toBe('your-client-id') // default
    })
  })

  describe('Docker Runtime Environment', () => {
    it('should prioritize Docker runtime environment over Vite env', () => {
      // Set Vite environment
      mockImportMetaEnv.VITE_API_URL = 'https://vite.api.com'
      mockImportMetaEnv.VITE_APP_NAME = 'Vite App'

      // Set Docker runtime environment
      ;(window as any)._env_ = {
        VITE_API_URL: 'https://docker.api.com',
        VITE_APP_NAME: 'Docker App',
        VITE_ENV: 'docker',
        VITE_VERSION: '3.0.0',
        VITE_OAUTH_TOKEN_URL: 'https://docker.oauth.com/token/',
        VITE_OAUTH_CLIENT_ID: 'docker-client-id',
      }

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.API_URL).toBe('https://docker.api.com')
      expect(updatedEnv.APP_NAME).toBe('Docker App')
      expect(updatedEnv.ENV).toBe('docker')
      expect(updatedEnv.VERSION).toBe('3.0.0')
      expect(updatedEnv.OAUTH_TOKEN_URL).toBe('https://docker.oauth.com/token/')
      expect(updatedEnv.OAUTH_CLIENT_ID).toBe('docker-client-id')
    })

    it('should fallback to Vite env when Docker env has partial values', () => {
      // Set Vite environment
      mockImportMetaEnv.VITE_API_URL = 'https://vite.api.com'
      mockImportMetaEnv.VITE_APP_NAME = 'Vite App'
      mockImportMetaEnv.VITE_ENV = 'staging'

      // Set partial Docker runtime environment
      ;(window as any)._env_ = {
        VITE_API_URL: 'https://docker.api.com',
        // VITE_APP_NAME is missing from Docker env
        VITE_VERSION: '3.0.0',
      }

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.API_URL).toBe('https://docker.api.com') // from Docker
      expect(updatedEnv.APP_NAME).toBe('Vite App') // from Vite (fallback)
      expect(updatedEnv.ENV).toBe('staging') // from Vite (fallback)
      expect(updatedEnv.VERSION).toBe('3.0.0') // from Docker
    })

    it('should fallback to defaults when neither Docker nor Vite env have values', () => {
      // Set Docker runtime environment with empty/null values
      ;(window as any)._env_ = {
        VITE_API_URL: '',
        VITE_APP_NAME: null,
        VITE_ENV: undefined,
      }

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      // Should use defaults since Docker values are empty/null
      expect(updatedEnv.API_URL).toBe('http://localhost:3001/api')
      expect(updatedEnv.APP_NAME).toBe('React App')
      expect(updatedEnv.ENV).toBe('development')
    })
  })

  describe('Environment Flags', () => {
    it('should correctly set IS_PRODUCTION flag when env is production', () => {
      mockImportMetaEnv.VITE_ENV = 'production'

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.ENV).toBe('production')
      expect(updatedEnv.IS_PRODUCTION).toBe(true)
      expect(updatedEnv.IS_DEVELOPMENT).toBe(false)
    })

    it('should correctly set IS_DEVELOPMENT flag when env is development', () => {
      mockImportMetaEnv.VITE_ENV = 'development'

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.ENV).toBe('development')
      expect(updatedEnv.IS_PRODUCTION).toBe(false)
      expect(updatedEnv.IS_DEVELOPMENT).toBe(true)
    })

    it('should correctly handle custom environment values', () => {
      mockImportMetaEnv.VITE_ENV = 'staging'

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.ENV).toBe('staging')
      expect(updatedEnv.IS_PRODUCTION).toBe(false)
      expect(updatedEnv.IS_DEVELOPMENT).toBe(false)
    })

    it('should handle Docker runtime environment flags correctly', () => {
      ;(window as any)._env_ = {
        VITE_ENV: 'production',
      }

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.ENV).toBe('production')
      expect(updatedEnv.IS_PRODUCTION).toBe(true)
      expect(updatedEnv.IS_DEVELOPMENT).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle window being undefined (SSR)', () => {
      // Mock window as undefined
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      mockImportMetaEnv.VITE_API_URL = 'https://ssr.api.com'

      vi.resetModules()
      
      expect(() => {
        require('./env')
      }).not.toThrow()

      // Restore window
      global.window = originalWindow
    })

    it('should handle malformed Docker environment object', () => {
      // Set malformed Docker environment
      ;(window as any)._env_ = 'invalid-string-instead-of-object'

      expect(() => {
        vi.resetModules()
        require('./env')
      }).not.toThrow()
    })

    it('should handle empty string environment values', () => {
      mockImportMetaEnv.VITE_API_URL = ''
      mockImportMetaEnv.VITE_APP_NAME = ''

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      // Should fallback to defaults for empty strings
      expect(updatedEnv.API_URL).toBe('http://localhost:3001/api')
      expect(updatedEnv.APP_NAME).toBe('React App')
    })

    it('should handle whitespace-only environment values', () => {
      mockImportMetaEnv.VITE_API_URL = '   '
      mockImportMetaEnv.VITE_APP_NAME = '\t\n'

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      // Whitespace strings should be preserved (not treated as empty)
      expect(updatedEnv.API_URL).toBe('   ')
      expect(updatedEnv.APP_NAME).toBe('\t\n')
    })

    it('should handle numeric and boolean environment values as strings', () => {
      mockImportMetaEnv.VITE_VERSION = '2.0.0'
      ;(window as any)._env_ = {
        VITE_API_URL: 'https://docker.api.com',
        VITE_VERSION: 'v3.0.0', // String version should work
      }

      vi.resetModules()
      const { env: updatedEnv } = require('./env')

      expect(updatedEnv.VERSION).toBe('v3.0.0')
      expect(typeof updatedEnv.VERSION).toBe('string')
    })
  })

  describe('Configuration Consistency', () => {
    it('should maintain consistent configuration object structure', () => {
      const expectedKeys = [
        'API_URL',
        'APP_NAME',
        'ENV',
        'VERSION',
        'OAUTH_TOKEN_URL',
        'OAUTH_CLIENT_ID',
        'IS_PRODUCTION',
        'IS_DEVELOPMENT',
      ]

      expect(Object.keys(env).sort()).toEqual(expectedKeys.sort())
    })

    it('should provide all configuration values as strings except boolean flags', () => {
      expect(typeof env.API_URL).toBe('string')
      expect(typeof env.APP_NAME).toBe('string')
      expect(typeof env.ENV).toBe('string')
      expect(typeof env.VERSION).toBe('string')
      expect(typeof env.OAUTH_TOKEN_URL).toBe('string')
      expect(typeof env.OAUTH_CLIENT_ID).toBe('string')
      expect(typeof env.IS_PRODUCTION).toBe('boolean')
      expect(typeof env.IS_DEVELOPMENT).toBe('boolean')
    })

    it('should have non-empty default values for critical config', () => {
      // Reset to defaults
      delete (window as any)._env_
      Object.keys(mockImportMetaEnv).forEach(key => {
        mockImportMetaEnv[key as keyof typeof mockImportMetaEnv] = undefined
      })

      vi.resetModules()
      const { env: defaultEnv } = require('./env')

      expect(defaultEnv.API_URL).toBeTruthy()
      expect(defaultEnv.APP_NAME).toBeTruthy()
      expect(defaultEnv.ENV).toBeTruthy()
      expect(defaultEnv.VERSION).toBeTruthy()
      expect(defaultEnv.OAUTH_TOKEN_URL).toBeTruthy()
      expect(defaultEnv.OAUTH_CLIENT_ID).toBeTruthy()
    })
  })

  describe('Real-world Scenarios', () => {
    it('should handle typical Docker deployment scenario', () => {
      ;(window as any)._env_ = {
        VITE_API_URL: 'https://api.myapp.com',
        VITE_APP_NAME: 'MyApp Production',
        VITE_ENV: 'production',
        VITE_VERSION: '1.2.3',
        VITE_OAUTH_TOKEN_URL: 'https://auth.myapp.com/oauth/token/',
        VITE_OAUTH_CLIENT_ID: 'prod-oauth-client-123',
      }

      vi.resetModules()
      const { env: prodEnv } = require('./env')

      expect(prodEnv.API_URL).toBe('https://api.myapp.com')
      expect(prodEnv.APP_NAME).toBe('MyApp Production')
      expect(prodEnv.ENV).toBe('production')
      expect(prodEnv.VERSION).toBe('1.2.3')
      expect(prodEnv.OAUTH_TOKEN_URL).toBe('https://auth.myapp.com/oauth/token/')
      expect(prodEnv.OAUTH_CLIENT_ID).toBe('prod-oauth-client-123')
      expect(prodEnv.IS_PRODUCTION).toBe(true)
      expect(prodEnv.IS_DEVELOPMENT).toBe(false)
    })

    it('should handle typical development scenario', () => {
      mockImportMetaEnv.VITE_API_URL = 'http://localhost:3001/api'
      mockImportMetaEnv.VITE_APP_NAME = 'MyApp Development'
      mockImportMetaEnv.VITE_ENV = 'development'
      mockImportMetaEnv.VITE_VERSION = '1.0.0-dev'
      mockImportMetaEnv.VITE_OAUTH_TOKEN_URL = 'http://localhost:3001/oauth/token/'
      mockImportMetaEnv.VITE_OAUTH_CLIENT_ID = 'dev-oauth-client-123'

      vi.resetModules()
      const { env: devEnv } = require('./env')

      expect(devEnv.API_URL).toBe('http://localhost:3001/api')
      expect(devEnv.APP_NAME).toBe('MyApp Development')
      expect(devEnv.ENV).toBe('development')
      expect(devEnv.VERSION).toBe('1.0.0-dev')
      expect(devEnv.OAUTH_TOKEN_URL).toBe('http://localhost:3001/oauth/token/')
      expect(devEnv.OAUTH_CLIENT_ID).toBe('dev-oauth-client-123')
      expect(devEnv.IS_PRODUCTION).toBe(false)
      expect(devEnv.IS_DEVELOPMENT).toBe(true)
    })
  })
})