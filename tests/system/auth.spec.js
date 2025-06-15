const { test, expect } = require('@playwright/test');

test.describe('Authentication System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/CodeUni/);
    
    await expect(page.locator('.banner')).toContainText('codeuni');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should validate login form fields', async ({ page }) => {
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
  });

  test('should switch between login and signup forms', async ({ page }) => {
    await page.click('text=Sign up');
    
    await expect(page.locator('input[placeholder*="First Name"], label:has-text("First Name")').first()).toBeVisible();
    await expect(page.locator('input[placeholder*="Last Name"], label:has-text("Last Name")').first()).toBeVisible();
    
    await page.click('text=Login');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
    await expect(page.locator('.MuiAlert-root')).toContainText(/Error logging in/i);
  });

  test('should validate signup form fields', async ({ page }) => {
    await page.click('text=Sign up');
    
    await page.click('button:has-text("Sign up")');
    
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
  });

  test('should handle signup form validation', async ({ page }) => {
    await page.click('text=Sign up');
    
    await page.fill('label:has-text("First Name") input', 'John');
    await page.fill('label:has-text("Last Name") input', 'Doe');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123');
    
    await page.click('button:has-text("Sign up")');
    
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('.landing-container')).toBeVisible();
    await expect(page.locator('.landing-box')).toBeVisible();
    await expect(page.locator('.banner')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/users/login', route => {
      route.abort('failed');
    });
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
  });
}); 