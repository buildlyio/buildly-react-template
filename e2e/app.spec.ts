import { test, expect } from '@playwright/test';

test.describe('React App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads correctly
    await expect(page).toHaveTitle(/React App/);
    
    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check for Vite and React logos
    await expect(page.getByAltText('Vite logo')).toBeVisible();
    await expect(page.getByAltText('React logo')).toBeVisible();
  });

  test('should increment counter when button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Find the counter button
    const counterButton = page.getByRole('button', { name: /count is \d+/i });
    await expect(counterButton).toBeVisible();
    
    // Initial count should be 0
    await expect(counterButton).toHaveText('Count is 0');
    
    // Click the button to increment
    await counterButton.click();
    await expect(counterButton).toHaveText('Count is 1');
    
    // Click again to verify it increments
    await counterButton.click();
    await expect(counterButton).toHaveText('Count is 2');
  });

  test('should display environment information', async ({ page }) => {
    await page.goto('/');
    
    // Check that environment info is displayed
    await expect(page.getByText(/Environment:/)).toBeVisible();
    await expect(page.getByText(/Version:/)).toBeVisible();
    await expect(page.getByText(/API URL:/)).toBeVisible();
  });

  test('should have proper responsive layout', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    const logo = page.getByAltText('Vite logo');
    await expect(logo).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(logo).toBeVisible();
    
    // Counter should still work on mobile
    const counterButton = page.getByRole('button', { name: /count is \d+/i });
    await counterButton.click();
    await expect(counterButton).toHaveText('Count is 1');
  });
});