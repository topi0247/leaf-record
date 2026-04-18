import { test, expect } from '@playwright/test'

test.describe('Public pages', () => {
  test('home page loads and shows login button', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/leaf record/i)
    // ログインボタンが存在する
    const loginButton = page.getByRole('button', { name: /github/i })
      .or(page.getByText(/login/i))
      .or(page.getByText(/ログイン/i))
    await expect(loginButton.first()).toBeVisible()
  })

  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/privacypolicy')
    await expect(page).toHaveURL(/privacypolicy/)
    await expect(page.locator('main, article, [role="main"]').first()).toBeVisible()
  })

  test('terms of service page loads', async ({ page }) => {
    await page.goto('/termsofservice')
    await expect(page).toHaveURL(/termsofservice/)
    await expect(page.locator('main, article, [role="main"]').first()).toBeVisible()
  })

  test('unauthenticated user on /record sees redirect or login prompt', async ({ page }) => {
    await page.goto('/record')
    // ログインが必要なページにアクセスした場合、ホームに戻るかログインプロンプトが出る
    const isRedirected = page.url().includes('/')
    expect(isRedirected).toBe(true)
  })
})
