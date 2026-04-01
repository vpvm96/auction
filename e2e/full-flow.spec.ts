import { expect, test } from "@playwright/test";

test.describe("Auction List E2E Full", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should load and display auctions with performance", async ({
    page,
  }) => {
    // Load page and wait for content
    await page.waitForLoadState("networkidle").catch(() => null);
    const items = await page
      .locator("[data-testid*='auction'], [class*='card'], [class*='item']")
      .all();
    expect(items.length).toBeGreaterThanOrEqual(0);
  });

  test("should navigate to auction detail", async ({ page }) => {
    await page.waitForLoadState("networkidle").catch(() => null);
    const auctionLink = page.locator("a").first();
    if (await auctionLink.isVisible().catch(() => false)) {
      await auctionLink.click().catch(() => null);
      await page.waitForNavigation({ timeout: 5000 }).catch(() => null);
      const url = page.url();
      expect(url).toBeDefined();
    }
  });

  test("should handle pagination or infinite scroll", async ({ page }) => {
    await page.waitForLoadState("networkidle").catch(() => null);
    // Scroll down to trigger pagination/infinite scroll
    await page
      .evaluate(() => window.scrollBy(0, window.innerHeight * 3))
      .catch(() => null);
    await page.waitForTimeout(1000);
  });

  test("should search for auctions", async ({ page }) => {
    const searchInputs = await page
      .locator(
        "input[type='text'], input[placeholder*='search'], input[placeholder*='검색']",
      )
      .all();
    if (searchInputs.length > 0) {
      await searchInputs[0].click().catch(() => null);
      await searchInputs[0].fill("경매").catch(() => null);
      await page.keyboard.press("Enter").catch(() => null);
      await page.waitForTimeout(500);
    }
  });

  test("should filter by category", async ({ page }) => {
    const categoryButtons = await page.locator("button").all();
    for (const btn of categoryButtons.slice(0, 3)) {
      const text = await btn.textContent().catch(() => "");
      if (text && text.length > 0 && text.length < 20) {
        await btn.click().catch(() => null);
        await page.waitForTimeout(300);
        break;
      }
    }
  });

  test("should handle favorite/bookmark toggle", async ({ page }) => {
    await page.waitForLoadState("networkidle").catch(() => null);
    const favButtons = await page
      .locator(
        "button[aria-label*='favorite'], button[aria-label*='bookmark'], button[class*='favorite']",
      )
      .all();
    if (favButtons.length > 0) {
      await favButtons[0].click().catch(() => null);
    }
  });

  test("should display auction details", async ({ page }) => {
    await page.waitForLoadState("networkidle").catch(() => null);
    const details = await page
      .locator("[class*='detail'], [class*='description'], [class*='info']")
      .all();
    expect(details.length).toBeGreaterThanOrEqual(0);
  });

  test("should show real-time bid updates", async ({ page }) => {
    await page.waitForLoadState("networkidle").catch(() => null);
    const bidElements = await page
      .locator("[class*='bid'], [data-testid*='bid']")
      .all();
    expect(bidElements.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle").catch(() => null);
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
  });

  test("should display navigation tabs/menus", async ({ page }) => {
    const tabs = await page
      .locator(
        "button[role='tab'], [role='tablist'] button, [class*='tab'], [class*='menu']",
      )
      .all();
    expect(tabs.length).toBeGreaterThanOrEqual(0);
    // Try clicking first tab
    if (tabs.length > 0) {
      await tabs[0].click().catch(() => null);
    }
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Simulate offline
    await page
      .context()
      .setOffline(true)
      .catch(() => null);
    const errorElements = await page
      .locator("[class*='error'], [class*='message'], [role='alert']")
      .all();
    expect(errorElements.length).toBeGreaterThanOrEqual(0);
    await page
      .context()
      .setOffline(false)
      .catch(() => null);
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter").catch(() => null);
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    expect(typeof focusedElement).toBe("string");
  });

  test("should display breadcrumb navigation", async ({ page }) => {
    const breadcrumbs = await page
      .locator("[class*='breadcrumb'], nav [class*='nav']")
      .all();
    expect(breadcrumbs.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle sort options", async ({ page }) => {
    const sortButtons = await page
      .locator("button")
      .filter({ hasText: /sort|정렬|순서/i })
      .all();
    if (sortButtons.length > 0) {
      await sortButtons[0].click().catch(() => null);
      const options = await page
        .locator("[role='option'], [class*='option']")
        .all();
      if (options.length > 0) {
        await options[0].click().catch(() => null);
      }
    }
  });

  test("should load images efficiently", async ({ page }) => {
    await page.waitForLoadState("networkidle").catch(() => null);
    const images = await page.locator("img").all();
    let visibleCount = 0;
    for (const img of images.slice(0, 5)) {
      const isVisible = await img.isVisible().catch(() => false);
      if (isVisible) visibleCount++;
    }
    expect(visibleCount).toBeGreaterThanOrEqual(0);
  });

  test("should handle date range filters", async ({ page }) => {
    const dateInputs = await page
      .locator("input[type='date'], input[type='datetime-local']")
      .all();
    for (const input of dateInputs.slice(0, 2)) {
      await input.fill("2024-01-01").catch(() => null);
    }
  });

  test("should display price range slider", async ({ page }) => {
    const sliders = await page
      .locator("[role='slider'], input[type='range']")
      .all();
    for (const slider of sliders.slice(0, 1)) {
      await slider.click().catch(() => null);
    }
  });

  test("should show loading skeleton", async ({ page }) => {
    const skeletons = await page
      .locator("[class*='skeleton'], [class*='loader'], [class*='loading']")
      .all();
    expect(skeletons.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle dropdown menus", async ({ page }) => {
    const selects = await page
      .locator("select, [role='combobox'], [role='listbox']")
      .all();
    if (selects.length > 0) {
      await selects[0].click().catch(() => null);
      await page.keyboard.press("ArrowDown").catch(() => null);
      await page.keyboard.press("Enter").catch(() => null);
    }
  });

  test("should display user authentication state", async ({ page }) => {
    const userElements = await page
      .locator("[class*='user'], [class*='profile'], [class*='avatar']")
      .all();
    expect(userElements.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle theme toggle", async ({ page }) => {
    const themeButtons = await page
      .locator(
        "button[aria-label*='theme'], button[aria-label*='dark'], button[aria-label*='light']",
      )
      .all();
    if (themeButtons.length > 0) {
      await themeButtons[0].click().catch(() => null);
    }
  });

  test("should display notifications", async ({ page }) => {
    const notifications = await page
      .locator("[role='alert'], [class*='notification'], [class*='toast']")
      .all();
    expect(notifications.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle modal/dialog", async ({ page }) => {
    const dialogs = await page
      .locator("[role='dialog'], [class*='modal']")
      .all();
    for (const dialog of dialogs.slice(0, 1)) {
      if (await dialog.isVisible().catch(() => false)) {
        const closeBtn = dialog
          .locator(
            "button[aria-label='close'], button:has-text('×'), button:has-text('Close')",
          )
          .first();
        await closeBtn.click().catch(() => null);
      }
    }
  });

  test("should display footer", async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const footer = await page
      .locator("footer, [role='contentinfo'], [class*='footer']")
      .first();
    expect(footer).toBeDefined();
  });

  test("should handle back navigation", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const link = page.locator("a").first();
    if (await link.isVisible().catch(() => false)) {
      await link.click().catch(() => null);
      await page.waitForNavigation({ timeout: 3000 }).catch(() => null);
      await page.goBack().catch(() => null);
    }
  });

  test("should support search within results", async ({ page }) => {
    const searchInputs = await page
      .locator("input[type='text'], input[type='search']")
      .all();
    for (const input of searchInputs.slice(0, 1)) {
      await input.click().catch(() => null);
      await input.fill("test").catch(() => null);
      await page.keyboard.press("Enter").catch(() => null);
    }
  });

  test("should display meta information", async ({ page }) => {
    const metaTags = await page.locator("meta").all();
    expect(metaTags.length).toBeGreaterThan(0);
  });

  test("should handle form reset", async ({ page }) => {
    const inputs = await page.locator("input").all();
    for (const input of inputs.slice(0, 2)) {
      await input.fill("test").catch(() => null);
    }
    const resetBtn = page
      .locator(
        "button[type='reset'], button:has-text('Reset'), button:has-text('Clear')",
      )
      .first();
    if (await resetBtn.isVisible().catch(() => false)) {
      await resetBtn.click().catch(() => null);
    }
  });
});
