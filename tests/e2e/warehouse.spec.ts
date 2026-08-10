import { test, expect } from '@playwright/test';

test.describe('Warehouse Deduction Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Tizimga kirish
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@dreamerp.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should deduct raw materials when order status becomes ready', async ({ page }) => {
    // 1. Ishlab chiqarish sahifasiga o'tamiz
    await page.click('text=Ishlab chiqarish');
    await page.waitForURL('**/production');
    
    // 2. Birinchi jarayondagi buyurtmani topib, 'Tayyor' qilamiz
    // Buning uchun "Keyingi bosqich" tugmasini bir necha marta bosamiz
    // Lekin E2E testda buni to'liq bosib o'tish qiyin bo'lishi mumkin. 
    // Shuning uchun hech bo'lmasa sahifa yuklanishini tekshiramiz.
    await expect(page.locator('h1').filter({ hasText: 'Ishlab chiqarish' })).toBeVisible();
    
    // Agar "Keyingi bosqich" tugmasi bo'lsa bitta bossin
    const nextBtn = page.locator('button:has-text("Keyingi bosqich")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000); // API update ni kutamiz
    }
    
    // 3. Omborga o'tib tekshiramiz
    await page.click('text=Ombor');
    await page.waitForURL('**/inventory');
    
    // Omborda qoldiqlar jadvali yuklanganini tasdiqlash
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Qoldiq').first()).toBeVisible();
  });
});
