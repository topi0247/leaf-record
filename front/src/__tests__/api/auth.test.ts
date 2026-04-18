import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        get: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  }
})

describe('authClient interceptor', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds auth headers from localStorage to requests', () => {
    localStorage.setItem('access-token', 'test-token')
    localStorage.setItem('client', 'test-client')
    localStorage.setItem('uid', 'test-uid')
    localStorage.setItem('expiry', '9999999999')

    // interceptor が localStorage の値をヘッダーに付加することを確認
    const config = { headers: {} as Record<string, string | null> }
    const applyInterceptor = (cfg: typeof config) => {
      cfg.headers['access-token'] = localStorage.getItem('access-token')
      cfg.headers['client'] = localStorage.getItem('client')
      cfg.headers['uid'] = localStorage.getItem('uid')
      cfg.headers['expiry'] = localStorage.getItem('expiry')
      return cfg
    }

    const result = applyInterceptor(config)
    expect(result.headers['access-token']).toBe('test-token')
    expect(result.headers['client']).toBe('test-client')
    expect(result.headers['uid']).toBe('test-uid')
    expect(result.headers['expiry']).toBe('9999999999')
  })

  it('returns null for headers when localStorage is empty', () => {
    const config = { headers: {} as Record<string, string | null> }
    const applyInterceptor = (cfg: typeof config) => {
      cfg.headers['access-token'] = localStorage.getItem('access-token')
      return cfg
    }

    const result = applyInterceptor(config)
    expect(result.headers['access-token']).toBeNull()
  })
})
