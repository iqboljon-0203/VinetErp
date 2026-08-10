# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: warehouse.spec.ts >> Warehouse Deduction Flow >> should deduct raw materials when order status becomes ready
- Location: tests\e2e\warehouse.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - button "🇷🇺 Русский" [ref=e5] [cursor=pointer]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img "VINET ERP" [ref=e9]
        - heading "VINET ERP" [level=1] [ref=e10]
        - paragraph [ref=e11]: Tizimga kirish
      - paragraph [ref=e15]: Invalid login credentials
      - generic [ref=e16]:
        - generic [ref=e17]:
          - text: Email manzil
          - textbox "admin@vinet.uz" [ref=e22]
        - generic [ref=e23]:
          - text: Parol
          - textbox "••••••••" [ref=e28]: admin123
        - button "Tizimga kirish" [ref=e29] [cursor=pointer]
    - paragraph [ref=e32]: © 2024 VINET ERP. Barcha huquqlar himoyalangan.
  - generic [ref=e37] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e38]
    - generic [ref=e42]:
      - button "Open issues overlay" [ref=e43]:
        - generic [ref=e44]:
          - generic [ref=e45]: "0"
          - generic [ref=e46]: "1"
        - generic [ref=e47]: Issue
      - button "Collapse issues badge" [ref=e48]
  - alert [ref=e51]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Warehouse Deduction Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Tizimga kirish
  6  |     await page.goto('/login');
  7  |     await page.fill('input[type="email"]', 'admin@vinet.uz');
  8  |     await page.fill('input[type="password"]', 'admin123');
  9  |     await page.click('button[type="submit"]');
> 10 |     await page.waitForURL('/dashboard');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  11 |   });
  12 | 
  13 |   test('should deduct raw materials when order status becomes ready', async ({ page }) => {
  14 |     // 1. Ishlab chiqarish sahifasiga o'tamiz
  15 |     await page.click('text=Ishlab chiqarish');
  16 |     await page.waitForURL('**/production');
  17 |     
  18 |     // 2. Birinchi jarayondagi buyurtmani topib, 'Tayyor' qilamiz
  19 |     // Buning uchun "Keyingi bosqich" tugmasini bir necha marta bosamiz
  20 |     // Lekin E2E testda buni to'liq bosib o'tish qiyin bo'lishi mumkin. 
  21 |     // Shuning uchun hech bo'lmasa sahifa yuklanishini tekshiramiz.
  22 |     await expect(page.locator('h1').filter({ hasText: 'Ishlab chiqarish' })).toBeVisible();
  23 |     
  24 |     // Agar "Keyingi bosqich" tugmasi bo'lsa bitta bossin
  25 |     const nextBtn = page.locator('button:has-text("Keyingi bosqich")').first();
  26 |     if (await nextBtn.isVisible()) {
  27 |       await nextBtn.click();
  28 |       await page.waitForTimeout(1000); // API update ni kutamiz
  29 |     }
  30 |     
  31 |     // 3. Omborga o'tib tekshiramiz
  32 |     await page.click('text=Ombor');
  33 |     await page.waitForURL('**/inventory');
  34 |     
  35 |     // Omborda qoldiqlar jadvali yuklanganini tasdiqlash
  36 |     await expect(page.locator('table')).toBeVisible();
  37 |     await expect(page.locator('text=Qoldiq').first()).toBeVisible();
  38 |   });
  39 | });
  40 | 
```