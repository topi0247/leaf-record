import { test, expect } from '@playwright/test'

const mockAuth = async (page: import('@playwright/test').Page) => {
  await page.route('**/api/v1/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, user: { id: 1, name: 'testuser' } }),
    })
  )
}

test.describe('VRT', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('ホームページ', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home.png')
  })

  test('プライバシーポリシーページ', async ({ page }) => {
    await page.goto('/privacypolicy')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('privacy-policy.png')
  })

  test('利用規約ページ', async ({ page }) => {
    await page.goto('/termsofservice')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('terms-of-service.png')
  })

  test('記録一覧（記録あり）', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/api/v1/records', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: 'test-repo-1', description: '', private: true, created_at: '2024-01-01' },
          { name: 'test-repo-2', description: '', private: true, created_at: '2024-01-01' },
        ]),
      })
    )
    await page.goto('/record')
    await expect(page.getByText('test-repo-1')).toBeVisible()
    await expect(page).toHaveScreenshot('record-list.png')
  })

  test('記録一覧（記録なし）', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/api/v1/records', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    )
    await page.goto('/record')
    await expect(page.getByText('記録がありません')).toBeVisible()
    await expect(page).toHaveScreenshot('record-list-empty.png')
  })

  test('エディタ（ファイルあり）', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/api/v1/records/test-repo', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          files: [{ name: 'README.md', path: 'README.md', content: '# Hello' }],
        }),
      })
    )
    await page.goto('/record/test-repo')
    await expect(page.getByRole('heading', { name: 'README.md' })).toBeVisible()
    await expect(page).toHaveScreenshot('editor.png')
  })
})
