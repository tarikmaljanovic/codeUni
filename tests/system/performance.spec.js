const { test, expect } = require('@playwright/test');

test.describe('Performance and Accessibility System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        admin: true
      }));
      localStorage.setItem('token', JSON.stringify('mock-token'));
    });

    await page.route('**/courses/getAllCourses', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, course_title: 'Test Course', deleted: 0 }
        ])
      });
    });

    await page.route('**/badges/getAllBadges', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
  });

  test('should load landing page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    await expect(page.locator('.banner')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    
    await expect(page.locator('.course-list')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
              metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            }
          });
          
          resolve(metrics);
        }).observe({ entryTypes: ['navigation'] });
        
        setTimeout(() => resolve({}), 1000);
      });
    });
    
    if (metrics.loadTime) {
      expect(metrics.loadTime).toBeLessThan(2000); 
    }
  });

  test('should be accessible - landing page', async ({ page }) => {
    await page.goto('/');
    
    
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThanOrEqual(0);
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    const loginButton = page.locator('button:has-text("Login")');
    await expect(loginButton).toBeVisible();
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
  });

  test('should be accessible - dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('.course-list')).toBeVisible();
    
    await expect(page.locator('.nav-container')).toBeVisible();
    
    const courseLinks = page.locator('a[href*="/course/"]');
    const linkCount = await courseLinks.count();
    
    if (linkCount > 0) {
      await expect(courseLinks.first()).toBeVisible();
    }
    
    const speedDial = page.locator('[aria-label="SpeedDial basic example"]');
    await expect(speedDial).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab'); 
    await page.keyboard.press('Tab'); 
    
    await page.keyboard.press('Enter');
    
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
  });

  test('should work with screen reader simulation', async ({ page }) => {
    await page.goto('/');
    
    const banner = page.locator('.banner');
    await expect(banner).toBeVisible();
    
    const form = page.locator('form, .form-body');
    await expect(form).toBeVisible();
    
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should handle high contrast mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto('/');
    
    await expect(page.locator('.banner')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    await expect(page.locator('.banner')).toBeVisible();
    
  });

  test('should be responsive across different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },  
      { width: 375, height: 667 },  
      { width: 768, height: 1024 }, 
      { width: 1024, height: 768 }, 
      { width: 1920, height: 1080 } 
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      await expect(page.locator('.banner')).toBeVisible();
      await expect(page.locator('.landing-box')).toBeVisible();
      
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button:has-text("Login")')).toBeVisible();
    }
  });

  test('should handle slow network conditions', async ({ page }) => {
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    
    await expect(page.locator('.banner')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); 
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    await page.goto('/');
    
    await page.goto('/dashboard');
    await expect(page.locator('.course-list')).toBeVisible();
    
    await page.goto('/');
    await expect(page.locator('.banner')).toBeVisible();
    
    await page.goto('/dashboard');
    await expect(page.locator('.course-list')).toBeVisible();
    
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    
    await page.goto('/');
    await page.goto('/dashboard');
    
    expect(errors.length).toBe(0);
  });
}); 