const { test, expect } = require('@playwright/test');

test.describe('Dashboard System Tests', () => {
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
          {
            id: 1,
            course_title: 'JavaScript Fundamentals',
            course_image_url: 'https://example.com/js.jpg',
            deleted: 0
          },
          {
            id: 2,
            course_title: 'React Advanced',
            course_image_url: 'https://example.com/react.jpg',
            deleted: 0
          }
        ])
      });
    });

    await page.route('**/badges/getAllBadges', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            badge_name: 'JavaScript Master',
            badge_image_url: 'https://example.com/badge.jpg'
          }
        ])
      });
    });
  });

  test('should display dashboard for authenticated admin user', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('.nav-container')).toBeVisible();
    await expect(page.locator('.title')).toContainText('codeuni');
    
    await expect(page.locator('.user-section')).toBeVisible();
    
    await expect(page.locator('.course-list')).toBeVisible();
    
    await expect(page.locator('[aria-label="SpeedDial basic example"]')).toBeVisible();
  });

  test('should display courses correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=JavaScript Fundamentals')).toBeVisible();
    await expect(page.locator('text=React Advanced')).toBeVisible();
    
    await expect(page.locator('a[href*="/course/1"]')).toBeVisible();
    await expect(page.locator('a[href*="/course/2"]')).toBeVisible();
  });

  test('should navigate to course detail page', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=JavaScript Fundamentals')).toBeVisible();
    
    await page.click('text=JavaScript Fundamentals');
    
    await expect(page).toHaveURL(/\/course\/1/);
  });

  test('should show admin functionality for admin users', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('[aria-label="SpeedDial basic example"]')).toBeVisible();
    
    await page.click('[aria-label="SpeedDial basic example"]');
    
    await expect(page.locator('[title="Create Course"]')).toBeVisible();
  });

  test('should open create course modal', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.click('[aria-label="SpeedDial basic example"]');
    
    await page.click('[title="Create Course"]');
    
    await expect(page.locator('.MuiModal-root')).toBeVisible();
    await expect(page.locator('text=Create Course')).toBeVisible();
    
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should handle course creation', async ({ page }) => {
    await page.route('**/courses/createCourse', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 3,
          course_title: 'New Course',
          course_image_url: 'https://example.com/new.jpg'
        })
      });
    });

    await page.route('**/cloudinary.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://example.com/uploaded.jpg'
        })
      });
    });

    await page.goto('/dashboard');
    
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Create Course"]');
    
    await page.fill('label:has-text("Name") input', 'New Test Course');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    });
    
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator('.MuiModal-root')).not.toBeVisible();
  });

  test('should display badges section', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=Badges')).toBeVisible();
    await expect(page.locator('text=JavaScript Master')).toBeVisible();
  });

  test('should handle show more/less functionality', async ({ page }) => {
    await page.route('**/courses/getAllCourses', async route => {
      const courses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        course_title: `Course ${i + 1}`,
        course_image_url: `https://example.com/course${i + 1}.jpg`,
        deleted: 0
      }));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(courses)
      });
    });

    await page.goto('/dashboard');
    
    await expect(page.locator('text=Course 1')).toBeVisible();
    await expect(page.locator('text=Course 6')).toBeVisible();
    
    await expect(page.locator('text=Show More')).toBeVisible();
    
    await page.click('text=Show More');
    
    await expect(page.locator('text=Course 7')).toBeVisible();
    
    await expect(page.locator('text=Show Less')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    await expect(page.locator('.is-hidden-desktop')).toBeVisible();
    
    await expect(page.locator('.course-list')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/courses/getAllCourses', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.goto('/dashboard');
    
    await expect(page.locator('.nav-container')).toBeVisible();
  });

  test('should redirect unauthenticated users', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/dashboard');
    
    await expect(page).toHaveURL('/');
  });
}); 