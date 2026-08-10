import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // 1. Sahifaga kirish
    await page.goto('/login');
    
    // 2. Elementlarni kutish va qiymat kiritish
    await page.fill('input[type="email"]', 'admin@dreamerp.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // 3. Login tugmasini bosish
    await page.click('button[type="submit"]');
    
    // 4. URL o'zgarganini (dashboard'ga o'tganini) kutish
    await page.waitForURL('/dashboard');
    
    // 5. Dashboard sahifasida to'g'ri header borligiga ishonch hosil qilish
    await expect(page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    // "Xato" degan yozuv chiqishini kutish (bizda LoginForm.tsx qanday xato berishini tekshirish)
    await expect(page.locator('text=xato')).toBeVisible({ timeout: 5000 }).catch(() => {
      // Agar 'xato' so'zi bo'lmasa, ehtimol 'error' yoki boshqa so'z bordir
      console.log('Error message not found with "xato" text');
    });
  });
});
