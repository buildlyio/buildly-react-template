import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to external links', async ({ page, context }) => {
    await page.goto('/');
    
    // Test Vite link opens in new tab
    const viteLink = page.getByRole('link').filter({ has: page.getByAltText('Vite logo') });
    await expect(viteLink).toHaveAttribute('href', 'https://vite.dev');
    await expect(viteLink).toHaveAttribute('target', '_blank');
    
    // Test React link opens in new tab
    const reactLink = page.getByRole('link').filter({ has: page.getByAltText('React logo') });
    await expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    await expect(reactLink).toHaveAttribute('target', '_blank');
  });

  test('should handle page refresh correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click counter a few times
    const counterButton = page.getByRole('button', { name: /count is \d+/i });
    await counterButton.click();
    await counterButton.click();
    await expect(counterButton).toHaveText('Count is 2');
    
    // Refresh page - counter should reset
    await page.reload();
    await expect(counterButton).toHaveText('Count is 0');
  });
});