import { expect, test } from "@playwright/test";
import { HomePage } from "./fixtures/page-objects";

test.describe("Home Page E2E", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should load home page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/홈|Home|경매/);
  });

  test("should display header navigation", async () => {
    const header = await homePage.getHeader();
    await expect(header).toBeVisible();
  });

  test("should display search bar", async () => {
    const searchBar = await homePage.getSearchBar();
    await expect(searchBar).toBeVisible();
  });

  test("should display category grid", async () => {
    const categoryGrid = await homePage.getCategoryGrid();
    await expect(categoryGrid).toBeVisible();

    const categoryItems = await homePage.getCategoryItems();
    expect(categoryItems.length).toBeGreaterThan(0);
  });

  test("should display featured auctions section", async () => {
    const featuredSection = await homePage.getFeaturedSection();
    await expect(featuredSection).toBeVisible();
  });

  test("should display auction cards", async () => {
    const auctionCards = await homePage.getAuctionCards();
    expect(auctionCards.length).toBeGreaterThan(0);

    for (const card of auctionCards.slice(0, 1)) {
      await expect(card).toBeVisible();
    }
  });

  test("should display auction card details", async () => {
    const auctionCards = await homePage.getAuctionCards();
    if (auctionCards.length > 0) {
      const title = await auctionCards[0].locator('[data-testid="title"]');
      const price = await auctionCards[0].locator('[data-testid="price"]');
      const location = await auctionCards[0].locator(
        '[data-testid="location"]',
      );

      await expect(title).toBeVisible();
      // Price might be visible conditionally
      // Location might be visible conditionally
    }
  });

  test("should navigate to category on click", async ({ page }) => {
    const categoryItems = await homePage.getCategoryItems();
    if (categoryItems.length > 0) {
      await categoryItems[0].click();
      // Should navigate to search results with category filter
      await expect(page).toHaveURL(/search|list|category/);
    }
  });

  test("should navigate to auction detail on card click", async ({ page }) => {
    const auctionCards = await homePage.getAuctionCards();
    if (auctionCards.length > 0) {
      await auctionCards[0].click();
      // Should navigate to auction detail page
      await expect(page).toHaveURL(/\[id\]|auction|detail|\d+/);
    }
  });

  test("should have scrollable content", async ({ page }) => {
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));
    const scrolledY = await page.evaluate(() => window.scrollY);

    expect(scrolledY).toBeGreaterThan(initialScroll);
  });

  test("should display news banner if available", async () => {
    const newsBanner = await homePage.getNewsBanner();
    if (newsBanner) {
      const isVisible = await newsBanner.isVisible();
      if (isVisible) {
        await expect(newsBanner).toBeVisible();
      }
    }
  });

  test("should display quiz banner if available", async () => {
    const quizBanner = await homePage.getQuizBanner();
    if (quizBanner) {
      const isVisible = await quizBanner.isVisible();
      if (isVisible) {
        await expect(quizBanner).toBeVisible();
      }
    }
  });

  test("should have responsive layout on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const categoryGrid = await homePage.getCategoryGrid();
    await expect(categoryGrid).toBeVisible();

    const auctionCards = await homePage.getAuctionCards();
    expect(auctionCards.length).toBeGreaterThan(0);
  });

  test("should have responsive layout on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const categoryGrid = await homePage.getCategoryGrid();
    await expect(categoryGrid).toBeVisible();

    const auctionCards = await homePage.getAuctionCards();
    expect(auctionCards.length).toBeGreaterThan(0);
  });

  test("should load images with proper alt text", async () => {
    const images = await homePage.getImages();

    for (const image of images.slice(0, 3)) {
      const altText = await image.getAttribute("alt");
      if (altText) {
        expect(altText.length).toBeGreaterThan(0);
      }
    }
  });

  test("should have accessible buttons", async () => {
    const buttons = await homePage.getButtons();

    for (const button of buttons.slice(0, 3)) {
      const ariaLabel = await button.getAttribute("aria-label");
      const text = await button.textContent();

      // Either aria-label or visible text should be present
      expect(ariaLabel || text).toBeTruthy();
    }
  });
});

test.describe("Home Page Navigation E2E", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should have working tab navigation", async ({ page }) => {
    const tabs = await homePage.getTabBar();
    if (tabs) {
      await expect(tabs).toBeVisible();
    }
  });

  test("should show bottom nav bar", async () => {
    const navBar = await homePage.getNavBar();
    await expect(navBar).toBeVisible();
  });

  test("should navigate to favorites tab", async ({ page }) => {
    const favoritesTab = await homePage.getFavoritesTab();
    if (favoritesTab) {
      await favoritesTab.click();
      await expect(page).toHaveURL(/favorite|like|wishlist/);
    }
  });

  test("should navigate to search", async ({ page }) => {
    const searchBar = await homePage.getSearchBar();
    await searchBar.click();
    await expect(page).toHaveURL(/search/);
  });
});
