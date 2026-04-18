import { test, expect } from '@playwright/test'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const mockAuthRoutes = async (page: import('@playwright/test').Page) => {
  await page.route(`${API_URL}/api/v1/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, user: { id: 1, name: 'testuser' } }),
    })
  )
}

const setAuthStorage = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('access-token', 'test-token')
    localStorage.setItem('client', 'test-client')
    localStorage.setItem('uid', 'test-uid')
    localStorage.setItem('expiry', '9999999999')
  })
}

test.describe('認証済みページ', () => {
  test.describe('記録一覧 (/record)', () => {
    test('ログイン済みユーザーが記録一覧ページを表示できる', async ({ page }) => {
      await mockAuthRoutes(page)
      await page.route(`${API_URL}/api/v1/records`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, repository_name: 'test-repo-1' },
            { id: 2, repository_name: 'test-repo-2' },
          ]),
        })
      )
      await setAuthStorage(page)
      await page.goto('/record')
      await expect(page).toHaveURL('/record')
      await expect(page.getByText('記録集一覧')).toBeVisible()
    })

    test('記録が0件の場合もページが表示される', async ({ page }) => {
      await mockAuthRoutes(page)
      await page.route(`${API_URL}/api/v1/records`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      )
      await setAuthStorage(page)
      await page.goto('/record')
      await expect(page).toHaveURL('/record')
      await expect(page.getByText('記録集一覧')).toBeVisible()
    })

    test('未認証ユーザーはホームにリダイレクトされる', async ({ page }) => {
      await page.route(`${API_URL}/api/v1/me`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: false }),
        })
      )
      await page.goto('/record')
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('エディタ (/record/[name])', () => {
    test('ファイル一覧とエディタが表示される', async ({ page }) => {
      await mockAuthRoutes(page)
      await page.route(`${API_URL}/api/v1/records/test-repo`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            files: [
              { name: 'README.md', path: 'README.md', content: '# Hello' },
            ],
          }),
        })
      )
      await setAuthStorage(page)
      await page.goto('/record/test-repo')
      await expect(page.getByText('test-repo')).toBeVisible()
      await expect(page.getByRole('button', { name: 'README.md' })).toBeVisible()
    })

    test('リポジトリが存在しない場合は記録一覧に戻る', async ({ page }) => {
      await mockAuthRoutes(page)
      await page.route(`${API_URL}/api/v1/records/missing-repo`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'リポジトリが見つかりません' }),
        })
      )
      await page.route(`${API_URL}/api/v1/records`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      )
      await setAuthStorage(page)
      await page.goto('/record/missing-repo')
      await expect(page).toHaveURL('/record')
    })
  })
})
