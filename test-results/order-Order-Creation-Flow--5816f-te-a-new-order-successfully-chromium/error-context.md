# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order.spec.ts >> Order Creation Flow >> should create a new order successfully
- Location: tests\e2e\order.spec.ts:13:7

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
  3  | test.describe('Order Creation Flow', () => {
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
  13 |   test('should create a new order successfully', async ({ page }) => {
  14 |     // CRM sahifasiga o'tish
  15 |     await page.click('text=CRM / Savdo');
  16 |     await page.waitForURL('**/crm');
  17 |     
  18 |     // Yangi buyurtma tugmasini bosish
  19 |     await page.click('text=Yangi Buyurtma');
  20 |     await page.waitForURL('**/crm/new');
  21 |     
  22 |     // Mijoz tanlash (birinchi opsiyani tanlaymiz)
  23 |     const clientSelect = page.locator('select').nth(0);
  24 |     await clientSelect.waitFor({ state: 'attached' });
  25 |     // Ozgina kutish, chunki ma'lumotlar API dan keladi
  26 |     await page.waitForTimeout(2000); 
  27 |     
  28 |     // Ikkita select bor: 1-Mijoz, 2-Mahsulot
  29 |     await page.locator('select').nth(0).selectOption({ index: 1 }); // Birinchi haqiqiy mijoz
  30 |     await page.locator('select').nth(1).selectOption({ index: 1 }); // Birinchi haqiqiy mahsulot
  31 |     
  32 |     // Miqdor kiritish
  33 |     await page.fill('input[type="number"]', '5');
  34 |     
  35 |     // Avans kiritish
  36 |     const inputs = page.locator('input[type="text"]');
  37 |     // Avans maydoni - odatda URL (link) dan keyin keladi
  38 |     await inputs.last().fill('100000');
  39 |     
  40 |     // Saqlash tugmasini bosish (Ikkita 'Yuborish' tugmasi bor bo'lishi mumkin, shuning uchun type=submit)
  41 |     await page.click('button[type="submit"]');
  42 |     
  43 |     // Muvaffaqiyatli saqlangach, CRM sahifasiga qaytishi kerak
  44 |     await page.waitForURL('**/crm');
  45 |     
  46 |     // Jadvalda yangi buyurtma paydo bo'lganini tekshirish
  47 |     await expect(page.locator('table')).toBeVisible();
  48 |   });
  49 | });
  50 | 
```