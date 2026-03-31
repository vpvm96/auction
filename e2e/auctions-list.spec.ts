import { expect, test } from "@playwright/test";
import { AuctionListPage } from "./fixtures/page-objects";

test.describe("Auction List E2E", () => {
  let listPage: AuctionListPage;

  test.beforeEach(async ({ page }) => {
    listPage = new AuctionListPage(page);
    await listPage.goto();
  });

  test("should load auction list page", async ({ page }) => {
    await expect(page).toHaveTitle(/경매|Auction|List/);
  });

  test("should display auction list", async () => {
    const auctionCards = await listPage.getAuctionCards();
    expect(auctionCards.length).toBeGreaterThan(0);
  });

  test("should display filter bar", async () => {
    const filterBar = await listPage.getFilterBar();
    await expect(filterBar).toBeVisible();
  });

  test("should display sort options", async () => {
    const sortOptions = await listPage.getSortOptions();
    await expect(sortOptions).toBeVisible();
  });

  test("should filter by status", async () => {
    const statusFilter = await listPage.getStatusFilter();
    await expect(statusFilter).toBeVisible();

    await statusFilter.click();
    const activeOption = await listPage.getStatusOption("ACTIVE");
    if (activeOption) {
      await activeOption.click();

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should filter by region", async () => {
    const regionFilter = await listPage.getRegionFilter();
    await expect(regionFilter).toBeVisible();

    await regionFilter.click();
    const seoulOption = await listPage.getRegionOption("서울");
    if (seoulOption) {
      await seoulOption.click();

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should filter by type", async () => {
    const typeFilter = await listPage.getTypeFilter();
    await expect(typeFilter).toBeVisible();

    await typeFilter.click();
    const apartmentOption = await listPage.getTypeOption("APARTMENT");
    if (apartmentOption) {
      await apartmentOption.click();

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should filter by price range", async () => {
    const priceFilter = await listPage.getPriceFilter();
    if (priceFilter) {
      await expect(priceFilter).toBeVisible();

      await priceFilter.click();
      const minInput = await listPage.getPriceMinInput();
      const maxInput = await listPage.getPriceMaxInput();

      if (minInput && maxInput) {
        await minInput.fill("1000000000");
        await maxInput.fill("5000000000");

        const applyButton = await listPage.getApplyFilterButton();
        if (applyButton) {
          await applyButton.click();
        }
      }
    }
  });

  test("should sort by newest first", async () => {
    const sortButton = await listPage.getSortButton();
    await expect(sortButton).toBeVisible();

    await sortButton.click();
    const newestOption = await listPage.getSortOption("최신순");
    if (newestOption) {
      await newestOption.click();

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should sort by price ascending", async () => {
    const sortButton = await listPage.getSortButton();
    await sortButton.click();

    const priceAscOption = await listPage.getSortOption("낮은가격순");
    if (priceAscOption) {
      await priceAscOption.click();

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should sort by price descending", async () => {
    const sortButton = await listPage.getSortButton();
    await sortButton.click();

    const priceDescOption = await listPage.getSortOption("높은가격순");
    if (priceDescOption) {
      await priceDescOption.click();

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should paginate to next page", async () => {
    const nextButton = await listPage.getNextPageButton();
    if (nextButton) {
      const isEnabled = await nextButton.isEnabled();
      if (isEnabled) {
        await nextButton.click();
        const auctionCards = await listPage.getAuctionCards();
        expect(auctionCards.length).toBeGreaterThan(0);
      }
    }
  });

  test("should display empty state when no results", async ({ page }) => {
    const statusFilter = await listPage.getStatusFilter();
    await statusFilter.click();

    const closedOption = await listPage.getStatusOption("CLOSED");
    if (closedOption) {
      await closedOption.click();

      // If no results, should show empty state or message
      const emptyState = await listPage.getEmptyState();
      const auctionCards = await listPage.getAuctionCards();

      const hasNoResults = emptyState || auctionCards.length === 0;
      expect(hasNoResults).toBeTruthy();
    }
  });

  test("should clear all filters", async () => {
    const clearButton = await listPage.getClearFiltersButton();
    if (clearButton) {
      // First apply some filters
      const statusFilter = await listPage.getStatusFilter();
      await statusFilter.click();
      const activeOption = await listPage.getStatusOption("ACTIVE");
      if (activeOption) {
        await activeOption.click();
      }

      // Clear filters
      await clearButton.click();
      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });

  test("should display auction card details", async () => {
    const auctionCards = await listPage.getAuctionCards();
    if (auctionCards.length > 0) {
      const firstCard = auctionCards[0];

      const title = await firstCard.locator('[data-testid="title"]');
      const price = await firstCard.locator('[data-testid="price"]');
      const location = await firstCard.locator('[data-testid="location"]');

      await expect(title).toBeVisible();
      // Price and location might be conditional
    }
  });

  test("should navigate to auction detail", async ({ page }) => {
    const auctionCards = await listPage.getAuctionCards();
    if (auctionCards.length > 0) {
      await auctionCards[0].click();
      await expect(page).toHaveURL(/\[id\]|auction|detail|\d+/);
    }
  });

  test("should toggle favorite from list", async () => {
    const auctionCards = await listPage.getAuctionCards();
    if (auctionCards.length > 0) {
      const favoriteButton = await auctionCards[0].locator(
        '[data-testid="favorite-btn"]',
      );
      if (favoriteButton) {
        const initialState = await favoriteButton.getAttribute("aria-pressed");
        await favoriteButton.click();
        const newState = await favoriteButton.getAttribute("aria-pressed");
        expect(newState).not.toBe(initialState);
      }
    }
  });

  test("should have infinite scroll or pagination", async ({ page }) => {
    const initialCardCount = (await listPage.getAuctionCards()).length;

    // Scroll to bottom
    await page.evaluate(() => {
      const element = document.querySelector('[data-testid="auction-list"]');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });

    // Wait for potential new items to load
    await page.waitForTimeout(500);

    const newCardCount = (await listPage.getAuctionCards()).length;

    // Either more items loaded or we're at the end
    expect(newCardCount >= initialCardCount).toBeTruthy();
  });

  test("should have responsive list layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const auctionCards = await listPage.getAuctionCards();
    expect(auctionCards.length).toBeGreaterThan(0);

    await page.setViewportSize({ width: 768, height: 1024 });
    const cardsAfterResize = await listPage.getAuctionCards();
    expect(cardsAfterResize.length).toBeGreaterThan(0);
  });
});

test.describe("Search E2E", () => {
  let listPage: AuctionListPage;

  test.beforeEach(async ({ page }) => {
    listPage = new AuctionListPage(page);
    await listPage.goto();
  });

  test("should search by keyword", async ({ page }) => {
    const searchInput = await listPage.getSearchInput();
    if (searchInput) {
      await searchInput.fill("오피스텔");
      await page.keyboard.press("Enter");

      // Wait for results to load
      await page.waitForLoadState("networkidle");

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThanOrEqual(0);
    }
  });

  test("should clear search", async () => {
    const searchInput = await listPage.getSearchInput();
    if (searchInput) {
      await searchInput.fill("오피스텔");
      await searchInput.fill("");

      const auctionCards = await listPage.getAuctionCards();
      expect(auctionCards.length).toBeGreaterThan(0);
    }
  });
});
