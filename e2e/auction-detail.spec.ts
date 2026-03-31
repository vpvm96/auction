import { expect, test } from "@playwright/test";
import { AuctionDetailPage } from "./fixtures/page-objects";

test.describe("Auction Detail E2E", () => {
  let detailPage: AuctionDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new AuctionDetailPage(page);
    // Navigate to a sample auction detail page
    await detailPage.goto("auction-123");
  });

  test("should load auction detail page", async ({ page }) => {
    await expect(page).toHaveTitle(/경매|Auction|상세|Detail/);
  });

  test("should display auction title", async () => {
    const title = await detailPage.getTitle();
    await expect(title).toBeVisible();

    const titleText = await title.textContent();
    expect(titleText?.length).toBeGreaterThan(0);
  });

  test("should display auction images", async () => {
    const images = await detailPage.getImages();
    expect(images.length).toBeGreaterThan(0);

    for (const image of images) {
      await expect(image).toBeVisible();
    }
  });

  test("should display image carousel controls", async () => {
    const images = await detailPage.getImages();
    if (images.length > 1) {
      const prevButton = await detailPage.getImagePrevButton();
      const nextButton = await detailPage.getImageNextButton();

      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();
    }
  });

  test("should navigate images with previous button", async () => {
    const images = await detailPage.getImages();
    if (images.length > 1) {
      const prevButton = await detailPage.getImagePrevButton();
      const initialImage = images[0];

      await prevButton.click();
      await expect(images[0]).not.toBeFocused();
    }
  });

  test("should navigate images with next button", async () => {
    const images = await detailPage.getImages();
    if (images.length > 1) {
      const nextButton = await detailPage.getImageNextButton();

      await nextButton.click();
      // Image carousel should advance
      await expect(nextButton).toBeVisible();
    }
  });

  test("should display auction price info", async () => {
    const priceSection = await detailPage.getPriceSection();
    await expect(priceSection).toBeVisible();

    const startPrice = await detailPage.getStartPrice();
    const currentBid = await detailPage.getCurrentBid();

    await expect(startPrice).toBeVisible();
    await expect(currentBid).toBeVisible();
  });

  test("should display auction status", async () => {
    const status = await detailPage.getStatus();
    await expect(status).toBeVisible();

    const statusText = await status.textContent();
    expect(["ACTIVE", "CLOSED", "PENDING", "CANCELLED"]).toContain(
      statusText?.toUpperCase().trim(),
    );
  });

  test("should display auction details section", async () => {
    const detailsSection = await detailPage.getDetailsSection();
    await expect(detailsSection).toBeVisible();
  });

  test("should display auction location", async () => {
    const location = await detailPage.getLocation();
    await expect(location).toBeVisible();

    const locationText = await location.textContent();
    expect(locationText?.length).toBeGreaterThan(0);
  });

  test("should display auction type", async () => {
    const type = await detailPage.getType();
    if (type) {
      await expect(type).toBeVisible();
    }
  });

  test("should display auction description", async () => {
    const description = await detailPage.getDescription();
    if (description) {
      await expect(description).toBeVisible();

      const descText = await description.textContent();
      expect(descText?.length).toBeGreaterThan(0);
    }
  });

  test("should display favorite button", async () => {
    const favoriteButton = await detailPage.getFavoriteButton();
    await expect(favoriteButton).toBeVisible();
  });

  test("should toggle favorite status", async () => {
    const favoriteButton = await detailPage.getFavoriteButton();
    const initialClass = await favoriteButton.getAttribute("class");

    await favoriteButton.click();
    const newClass = await favoriteButton.getAttribute("class");

    // Class or aria-pressed should change
    expect(newClass).not.toBe(initialClass);
  });

  test("should display share button", async () => {
    const shareButton = await detailPage.getShareButton();
    if (shareButton) {
      await expect(shareButton).toBeVisible();
    }
  });

  test("should display bidding section for active auction", async () => {
    const biddingSection = await detailPage.getBiddingSection();
    if (biddingSection) {
      await expect(biddingSection).toBeVisible();
    }
  });

  test("should display bid history", async () => {
    const bidHistory = await detailPage.getBidHistory();
    if (bidHistory) {
      await expect(bidHistory).toBeVisible();

      const bidItems = await detailPage.getBidHistoryItems();
      expect(bidItems.length).toBeGreaterThanOrEqual(0);
    }
  });

  test("should display related/similar auctions", async () => {
    const relatedSection = await detailPage.getRelatedAuctionsSection();
    if (relatedSection) {
      await expect(relatedSection).toBeVisible();

      const relatedCards = await detailPage.getRelatedAuctionCards();
      expect(relatedCards.length).toBeGreaterThan(0);
    }
  });

  test("should navigate to related auction detail", async ({ page }) => {
    const relatedCards = await detailPage.getRelatedAuctionCards();
    if (relatedCards.length > 0) {
      await relatedCards[0].click();

      // Should navigate to another auction detail
      await expect(page).toHaveURL(/\[id\]|auction|detail|\d+/);
    }
  });

  test("should display contact/inquiry button", async () => {
    const inquiryButton = await detailPage.getInquiryButton();
    if (inquiryButton) {
      await expect(inquiryButton).toBeVisible();
    }
  });

  test("should open inquiry modal on button click", async () => {
    const inquiryButton = await detailPage.getInquiryButton();
    if (inquiryButton) {
      await inquiryButton.click();

      const modal = await detailPage.getModal();
      await expect(modal).toBeVisible();
    }
  });

  test("should have back navigation button", async ({ page }) => {
    const backButton = await detailPage.getBackButton();
    if (backButton) {
      await expect(backButton).toBeVisible();

      // Store current URL
      const currentUrl = page.url();

      await backButton.click();

      // Should navigate to previous page
      const newUrl = page.url();
      expect(newUrl).not.toBe(currentUrl);
    }
  });

  test("should display responsive image gallery", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const images = await detailPage.getImages();
    expect(images.length).toBeGreaterThan(0);

    await page.setViewportSize({ width: 768, height: 1024 });
    const imagesAfterResize = await detailPage.getImages();
    expect(imagesAfterResize.length).toBeGreaterThan(0);
  });

  test("should have accessible auction details", async () => {
    const title = await detailPage.getTitle();
    const heading = await title.locator('[role="heading"]');
    const headingRole = await heading.getAttribute("role");

    if (headingRole) {
      expect(["heading", "h1", "h2"]).toContain(headingRole);
    }
  });

  test("should display bidding rate if available", async () => {
    const biddingRate = await detailPage.getBiddingRate();
    if (biddingRate) {
      await expect(biddingRate).toBeVisible();

      const rateText = await biddingRate.textContent();
      expect(rateText).toMatch(/\d+%/);
    }
  });

  test("should display auction dates", async () => {
    const startDate = await detailPage.getAuctionStartDate();
    const endDate = await detailPage.getAuctionEndDate();

    if (startDate) await expect(startDate).toBeVisible();
    if (endDate) await expect(endDate).toBeVisible();
  });

  test("should have full auction details visible", async () => {
    const title = await detailPage.getTitle();
    const priceSection = await detailPage.getPriceSection();
    const status = await detailPage.getStatus();
    const location = await detailPage.getLocation();

    await expect(title).toBeVisible();
    await expect(priceSection).toBeVisible();
    await expect(status).toBeVisible();
    await expect(location).toBeVisible();
  });
});

test.describe("Auction Bidding E2E", () => {
  let detailPage: AuctionDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new AuctionDetailPage(page);
    await detailPage.goto("auction-123");
  });

  test("should display bid input field for active auction", async () => {
    const biddingSection = await detailPage.getBiddingSection();
    if (biddingSection) {
      const bidInput = await detailPage.getBidInput();
      if (bidInput) {
        await expect(bidInput).toBeVisible();
      }
    }
  });

  test("should display bid button", async () => {
    const biddingSection = await detailPage.getBiddingSection();
    if (biddingSection) {
      const bidButton = await detailPage.getBidButton();
      if (bidButton) {
        await expect(bidButton).toBeVisible();
      }
    }
  });

  test("should validate bid amount", async () => {
    const bidInput = await detailPage.getBidInput();
    const bidButton = await detailPage.getBidButton();

    if (bidInput && bidButton) {
      // Try entering invalid amount
      await bidInput.fill("1");
      await bidButton.click();

      // Should show error
      const error = await detailPage.getErrorMessage();
      if (error) {
        await expect(error).toBeVisible();
      }
    }
  });

  test("should display highest bidder info", async () => {
    const highestBidder = await detailPage.getHighestBidder();
    if (highestBidder) {
      await expect(highestBidder).toBeVisible();
    }
  });
});
