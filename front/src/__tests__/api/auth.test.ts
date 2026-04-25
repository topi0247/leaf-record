import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authFetch } from '@/api/auth'

describe('authFetch', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('localStorageの値をリクエストヘッダーに付加する', async () => {
    localStorage.setItem('access-token', 'test-token')
    localStorage.setItem('client', 'test-client')
    localStorage.setItem('uid', 'test-uid')
    localStorage.setItem('expiry', '9999999999')

    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await authFetch('/me')

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }]
    expect(options.headers['access-token']).toBe('test-token')
    expect(options.headers['client']).toBe('test-client')
    expect(options.headers['uid']).toBe('test-uid')
    expect(options.headers['expiry']).toBe('9999999999')
  })

  it('localStorageが空の場合ヘッダーにaccess-tokenが含まれない', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await authFetch('/me')

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }]
    expect(options.headers['access-token']).toBeUndefined()
  })
})
