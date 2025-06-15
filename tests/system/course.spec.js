const { test, expect } = require('@playwright/test');

test.describe('Course System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
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

    // Mock course API response
    await page.route('**/courses/byId/1/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          course: {
            id: 1,
            course_title: 'JavaScript Fundamentals',
            UserCour: { starred: false, progress: 0.5 }
          },
          lessons: [
            { id: 1, lesson_title: 'Introduction to JavaScript' },
            { id: 2, lesson_title: 'Variables and Data Types' }
          ],
          projects: [
            { id: 1, project_title: 'Build a Calculator' },
            { id: 2, project_title: 'Todo List App' }
          ]
        })
      });
    });
  });

  test('should display course details correctly', async ({ page }) => {
    await page.goto('/course/1');
    
    // Verify course title is displayed
    await expect(page.locator('text=JavaScript Fundamentals')).toBeVisible();
    
    // Verify progress bar is present
    await expect(page.locator('.progress')).toBeVisible();
    
    // Verify favorite checkbox is present
    await expect(page.locator('[type="checkbox"]')).toBeVisible();
  });

  test('should display lessons and projects', async ({ page }) => {
    await page.goto('/course/1');
    
    // Wait for content to load
    await expect(page.locator('text=Introduction to JavaScript')).toBeVisible();
    await expect(page.locator('text=Variables and Data Types')).toBeVisible();
    
    // Verify projects are displayed
    await expect(page.locator('text=Build a Calculator')).toBeVisible();
    await expect(page.locator('text=Todo List App')).toBeVisible();
    
    // Verify lesson and project links
    await expect(page.locator('a[href*="/lesson/1"]')).toBeVisible();
    await expect(page.locator('a[href*="/project/1"]')).toBeVisible();
  });

  test('should navigate to lesson page', async ({ page }) => {
    await page.goto('/course/1');
    
    // Wait for lessons to load
    await expect(page.locator('text=Introduction to JavaScript')).toBeVisible();
    
    // Click on first lesson
    await page.click('text=Introduction to JavaScript');
    
    // Should navigate to lesson page
    await expect(page).toHaveURL(/\/lesson\/1/);
  });

  test('should navigate to project page', async ({ page }) => {
    await page.goto('/course/1');
    
    // Wait for projects to load
    await expect(page.locator('text=Build a Calculator')).toBeVisible();
    
    // Click on first project
    await page.click('text=Build a Calculator');
    
    // Should navigate to project page
    await expect(page).toHaveURL(/\/project\/1/);
  });

  test('should show admin controls for admin users', async ({ page }) => {
    await page.goto('/course/1');
    
    // Verify speed dial is present for admin
    await expect(page.locator('[aria-label="SpeedDial basic example"]')).toBeVisible();
    
    // Click speed dial to open actions
    await page.click('[aria-label="SpeedDial basic example"]');
    
    // Verify admin actions are available
    await expect(page.locator('[title="Create Lesson"]')).toBeVisible();
    await expect(page.locator('[title="Create Project"]')).toBeVisible();
    await expect(page.locator('[title="Edit Course"]')).toBeVisible();
    await expect(page.locator('[title="Delete Course"]')).toBeVisible();
  });

  test('should open create lesson modal', async ({ page }) => {
    await page.goto('/course/1');
    
    // Click speed dial and create lesson action
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Create Lesson"]');
    
    // Verify modal is open
    await expect(page.locator('.MuiModal-root')).toBeVisible();
    await expect(page.locator('text=Create Lesson')).toBeVisible();
    
    // Verify form fields
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
  });

  test('should create a new lesson', async ({ page }) => {
    // Mock lesson creation API
    await page.route('**/lessons/createLesson', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 3,
          lesson_title: 'New Lesson'
        })
      });
    });

    await page.goto('/course/1');
    
    // Open create lesson modal
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Create Lesson"]');
    
    // Fill form
    await page.fill('label:has-text("Name") input', 'New Test Lesson');
    
    // Submit form
    await page.click('button:has-text("Submit")');
    
    // Modal should close
    await expect(page.locator('.MuiModal-root')).not.toBeVisible();
  });

  test('should open create project modal', async ({ page }) => {
    await page.goto('/course/1');
    
    // Click speed dial and create project action
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Create Project"]');
    
    // Verify modal is open
    await expect(page.locator('.MuiModal-root')).toBeVisible();
    await expect(page.locator('text=Create Project')).toBeVisible();
  });

  test('should open edit course modal', async ({ page }) => {
    await page.goto('/course/1');
    
    // Click speed dial and edit course action
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Edit Course"]');
    
    // Verify modal is open
    await expect(page.locator('.MuiModal-root')).toBeVisible();
    await expect(page.locator('text=Edit Course')).toBeVisible();
    
    // Verify form fields
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should open delete course modal', async ({ page }) => {
    await page.goto('/course/1');
    
    // Click speed dial and delete course action
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Delete Course"]');
    
    // Verify modal is open
    await expect(page.locator('.MuiModal-root')).toBeVisible();
    await expect(page.locator('text=Delete Course')).toBeVisible();
    
    // Verify delete confirmation
    await expect(page.locator('text=Are you sure you want to delete this course?')).toBeVisible();
    await expect(page.locator('button:has-text("Delete Course")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test('should handle course deletion', async ({ page }) => {
    // Mock delete course API
    await page.route('**/courses/deleteCourse/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.goto('/course/1');
    
    // Open delete course modal
    await page.click('[aria-label="SpeedDial basic example"]');
    await page.click('[title="Delete Course"]');
    
    // Confirm deletion
    await page.click('button:has-text("Delete Course")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should toggle favorite status', async ({ page }) => {
    // Mock favorite course API
    await page.route('**/courses/favoriteCourse', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.goto('/course/1');
    
    // Click favorite checkbox
    await page.click('[type="checkbox"]');
    
    // API should be called
    // Note: In a real test, you might want to verify the API call was made
  });

  test('should show finish course button for non-admin users', async ({ page }) => {
    // Mock non-admin user
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        first_name: 'Student',
        last_name: 'User',
        email: 'student@example.com',
        admin: false
      }));
    });

    // Mock course with 100% progress
    await page.route('**/courses/byId/1/2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          course: {
            id: 1,
            course_title: 'JavaScript Fundamentals',
            UserCour: { starred: false, progress: 1.0 }
          },
          lessons: [],
          projects: []
        })
      });
    });

    await page.goto('/course/1');
    
    // Verify finish course button is present and enabled
    await expect(page.locator('button:has-text("Finish Course")')).toBeVisible();
    await expect(page.locator('button:has-text("Finish Course")')).toBeEnabled();
  });

  test('should disable finish course button for incomplete course', async ({ page }) => {
    // Mock non-admin user
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        first_name: 'Student',
        last_name: 'User',
        email: 'student@example.com',
        admin: false
      }));
    });

    await page.goto('/course/1');
    
    // Verify finish course button is disabled (progress is 0.5)
    await expect(page.locator('button:has-text("Finish Course")')).toBeDisabled();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/course/1');
    
    // Verify content is still accessible
    await expect(page.locator('text=JavaScript Fundamentals')).toBeVisible();
    await expect(page.locator('.course-list')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/courses/byId/1/1', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.goto('/course/1');
    
    // Should still render the page structure
    await expect(page.locator('.nav-container')).toBeVisible();
  });

  test('should redirect unauthenticated users', async ({ page }) => {
    // Clear localStorage to simulate unauthenticated state
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/course/1');
    
    // Should redirect to landing page
    await expect(page).toHaveURL('/');
  });
}); 