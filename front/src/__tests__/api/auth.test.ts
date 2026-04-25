import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authFetch } from '@/api/auth'

describe('authFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('credentials: include でリクエストを送る', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await authFetch('/me')

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(options.credentials).toBe('include')
  })

  it('Content-Type: application/json ヘッダーが付加される', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await authFetch('/me')

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }]
    expect(options.headers['Content-Type']).toBe('application/json')
  })
})
