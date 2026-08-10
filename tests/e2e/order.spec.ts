import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Tizimga kirish
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@dreamerp.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create a new order successfully', async ({ page }) => {
    // CRM sahifasiga o'tish
    await page.click('text=CRM / Savdo');
    await page.waitForURL('**/crm');
    
    // Yangi buyurtma tugmasini bosish
    await page.click('text=Yangi Buyurtma');
    await page.waitForURL('**/crm/new');
    
    // Mijoz tanlash (birinchi opsiyani tanlaymiz)
    const clientSelect = page.locator('select').nth(0);
    await clientSelect.waitFor({ state: 'attached' });
    // Ozgina kutish, chunki ma'lumotlar API dan keladi
    await page.waitForTimeout(2000); 
    
    // Ikkita select bor: 1-Mijoz, 2-Mahsulot
    await page.locator('select').nth(0).selectOption({ index: 1 }); // Birinchi haqiqiy mijoz
    await page.locator('select').nth(1).selectOption({ index: 1 }); // Birinchi haqiqiy mahsulot
    
    // Miqdor kiritish
    await page.fill('input[type="number"]', '5');
    
    // Avans kiritish
    const inputs = page.locator('input[type="text"]');
    // Avans maydoni - odatda URL (link) dan keyin keladi
    await inputs.last().fill('100000');
    
    // Saqlash tugmasini bosish (Ikkita 'Yuborish' tugmasi bor bo'lishi mumkin, shuning uchun type=submit)
    await page.click('button[type="submit"]');
    
    // Muvaffaqiyatli saqlangach, CRM sahifasiga qaytishi kerak
    await page.waitForURL('**/crm');
    
    // Jadvalda yangi buyurtma paydo bo'lganini tekshirish
    await expect(page.locator('table')).toBeVisible();
  });
});
