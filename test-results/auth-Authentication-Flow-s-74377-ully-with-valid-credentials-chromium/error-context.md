# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> should login successfully with valid credentials
- Location: tests\e2e\auth.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
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
  3  | test.describe('Authentication Flow', () => {
  4  |   test('should login successfully with valid credentials', async ({ page }) => {
  5  |     // 1. Sahifaga kirish
  6  |     await page.goto('/login');
  7  |     
  8  |     // 2. Elementlarni kutish va qiymat kiritish
  9  |     await page.fill('input[type="email"]', 'admin@vinet.uz');
  10 |     await page.fill('input[type="password"]', 'admin123');
  11 |     
  12 |     // 3. Login tugmasini bosish
  13 |     await page.click('button[type="submit"]');
  14 |     
  15 |     // 4. URL o'zgarganini (dashboard'ga o'tganini) kutish
> 16 |     await page.waitForURL('/dashboard');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  17 |     
  18 |     // 5. Dashboard sahifasida to'g'ri header borligiga ishonch hosil qilish
  19 |     await expect(page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  20 |   });
  21 | 
  22 |   test('should show error with invalid credentials', async ({ page }) => {
  23 |     await page.goto('/login');
  24 |     await page.fill('input[type="email"]', 'wrong@example.com');
  25 |     await page.fill('input[type="password"]', 'wrongpass');
  26 |     await page.click('button[type="submit"]');
  27 |     
  28 |     // "Xato" degan yozuv chiqishini kutish (bizda LoginForm.tsx qanday xato berishini tekshirish)
  29 |     await expect(page.locator('text=xato')).toBeVisible({ timeout: 5000 }).catch(() => {
  30 |       // Agar 'xato' so'zi bo'lmasa, ehtimol 'error' yoki boshqa so'z bordir
  31 |       console.log('Error message not found with "xato" text');
  32 |     });
  33 |   });
  34 | });
  35 | 
```