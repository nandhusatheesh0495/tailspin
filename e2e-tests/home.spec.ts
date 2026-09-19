import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the correct title', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle('Tailspin Toys - Crowdfunding your new favorite game!');
  });

  test('should display the main heading', async ({ page }) => {
    // Check that the main page heading is present
    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Toys', exact: true })).toBeVisible();
  });

  test('should display the site branding in header', async ({ page }) => {
    // Check that the site branding is present in the header (no longer an h1)
    await expect(page.getByText('Tailspin Toys').first()).toBeVisible();
  });

  test('should display the welcome message', async ({ page }) => {
    // Check that the welcome message is present using more specific locator
    await expect(page.getByText('Find your next game! And maybe even back one! Explore our collection!')).toBeVisible();
  });

  test('should display the catalog summary', async ({ page }) => {
    await expect(page.getByTestId('catalog-game-count')).toContainText(/\d+/);
    await expect(page.getByTestId('catalog-average-rating')).toContainText(/\/ 5|Not yet rated/);
  });

  test('should filter games by category and publisher', async ({ page }) => {
    const categoryFilter = page.getByTestId('category-filter');
    const publisherFilter = page.getByTestId('publisher-filter');
    const categoryOption = categoryFilter.locator('option').first();
    const publisherOption = publisherFilter.locator('option').first();
    const totalCards = await page.getByTestId('game-card').count();

    await categoryFilter.selectOption(await categoryOption.getAttribute('value'));
    await publisherFilter.selectOption(await publisherOption.getAttribute('value'));

    const visibleCards = page.locator('[data-testid="game-card"]:not([hidden])');
    await expect(visibleCards.first()).toBeVisible();
    const filteredCardCount = await visibleCards.count();
    expect(filteredCardCount).toBeLessThan(totalCards);
    await expect(page.getByTestId('no-filter-results')).toBeHidden();

    await page.getByTestId('reset-filters').click();
    await expect(page.getByTestId('game-card').first()).toBeVisible();
  });
});
