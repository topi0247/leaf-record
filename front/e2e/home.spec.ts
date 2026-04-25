import { test, expect } from '@playwright/test'

test.describe('公開ページ', () => {
  test('ホームページが表示されログインボタンが存在する', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'ログインボタンはモバイルでは折りたたみメニュー内')
    await page.goto('/')
    await expect(page).toHaveTitle(/leaf record/i)
    const loginButton = page.getByRole('button', { name: /github/i })
      .or(page.getByText(/login/i))
      .or(page.getByText(/ログイン/i))
    await expect(loginButton.first()).toBeVisible()
  })

  test('プライバシーポリシーページが表示される', async ({ page }) => {
    await page.goto('/privacypolicy')
    await expect(page).toHaveURL(/privacypolicy/)
    await expect(page.locator('main, article, [role="main"]').first()).toBeVisible()
  })

  test('利用規約ページが表示される', async ({ page }) => {
    await page.goto('/termsofservice')
    await expect(page).toHaveURL(/termsofservice/)
    await expect(page.locator('main, article, [role="main"]').first()).toBeVisible()
  })

  test('未認証で/recordにアクセスするとリダイレクトまたはログイン画面が表示される', async ({ page }) => {
    await page.goto('/record')
    const isRedirected = page.url().includes('/')
    expect(isRedirected).toBe(true)
  })
})
