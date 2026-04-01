/**
 * Playwright Page Objects
 * Helper classes for E2E tests
 */

import { Locator, Page } from "@playwright/test";

/**
 * Base Page Object
 */
export class BasePage {
  constructor(readonly page: Page) {}

  async goto(path: string = "") {
    if (!path.startsWith("http")) {
      path = `http://localhost:3000${path.startsWith("/") ? path : "/" + path}`;
    }
    await this.page
      .goto(path, { waitUntil: "domcontentloaded" })
      .catch(() => {});
  }

  async waitForElement(selector: string, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
    } catch {
      // Element not found, continue
    }
  }

  async click(selector: string) {
    await this.page.click(selector).catch(() => {});
  }

  async fill(selector: string, text: string) {
    await this.page.fill(selector, text).catch(() => {});
  }

  async getText(selector: string) {
    try {
      return await this.page.textContent(selector);
    } catch {
      return null;
    }
  }

  async isVisible(selector: string) {
    try {
      return await this.page.isVisible(selector);
    } catch {
      return false;
    }
  }

  async waitForNavigation(fn: () => Promise<void>) {
    await Promise.all([
      this.page
        .waitForNavigation({ waitUntil: "domcontentloaded" })
        .catch(() => {}),
      fn(),
    ]);
  }
}

/**
 * Auth Page Object
 */
export class AuthPage extends BasePage {
  async goto() {
    await super.goto("/auth/login");
  }

  async getEmailInput(): Promise<Locator> {
    return this.page
      .locator(
        'input[name="email"], input[placeholder*="이메일"], input[placeholder*="email"]',
      )
      .first();
  }

  async getPasswordInput(): Promise<Locator> {
    return this.page
      .locator('input[name="password"], input[type="password"]')
      .first();
  }

  async getPasswordTogpleButton(): Promise<Locator> {
    return this.page
      .locator('button[aria-label*="비밀번호"], button[aria-label*="password"]')
      .first();
  }

  async getLoginButton(): Promise<Locator> {
    return this.page
      .locator(
        'button:has-text("로그인"), button:has-text("Sign In"), button[type="submit"]',
      )
      .first();
  }

  async getSignupLink(): Promise<Locator> {
    return this.page
      .locator('a:has-text("회원가입"), a:has-text("Sign Up"), text=가입')
      .first();
  }

  async getForgotPasswordLink(): Promise<Locator> {
    return this.page
      .locator('a:has-text("비밀번호 찾기"), a:has-text("Forgot"), text=찾기')
      .first();
  }

  async getErrorMessage(): Promise<Locator | null> {
    const error1 = this.page.locator('[role="alert"]');
    const error2 = this.page.locator('[data-testid="error"]');
    const error3 = this.page.locator(".text-red, .error");

    if (await error1.isVisible().catch(() => false)) return error1;
    if (await error2.isVisible().catch(() => false)) return error2;
    if (await error3.isVisible().catch(() => false)) return error3;
    return null;
  }

  async fillEmail(email: string) {
    const input = await this.getEmailInput();
    await input.fill(email);
  }

  async fillPassword(password: string) {
    const input = await this.getPasswordInput();
    await input.fill(password);
  }

  async clickLoginButton() {
    const button = await this.getLoginButton();
    await button.click();
  }

  async fillName(name: string) {
    const input = this.page
      .locator('input[name="name"], input[placeholder*="이름"]')
      .first();
    await input.fill(name);
  }

  async getNameInput(): Promise<Locator> {
    return this.page
      .locator('input[name="name"], input[placeholder*="이름"]')
      .first();
  }

  async getSignupButton(): Promise<Locator> {
    return this.page
      .locator(
        'button:has-text("가입"), button:has-text("Sign Up"), button[type="submit"]',
      )
      .nth(1);
  }

  async clickSignupButton() {
    const button = await this.getSignupButton();
    await button.click().catch(() => {});
  }

  async getKakaoLoginButton(): Promise<Locator> {
    return this.page
      .locator('button:has-text("카카오"), [data-testid="kakao-login"]')
      .first();
  }

  async getGoogleLoginButton(): Promise<Locator> {
    return this.page
      .locator(
        'button:has-text("구글"), button:has-text("Google"), [data-testid="google-login"]',
      )
      .first();
  }

  async getSubmitButton(): Promise<Locator> {
    return this.page
      .locator(
        'button[type="submit"], button:has-text("제출"), button:has-text("submit")',
      )
      .first();
  }

  async getSuccessMessage(): Promise<Locator | null> {
    const msg1 = this.page.locator('[role="status"]');
    const msg2 = this.page.locator('[data-testid="success"]');
    const msg3 = this.page.locator(".text-green, .success");

    if (await msg1.isVisible().catch(() => false)) return msg1;
    if (await msg2.isVisible().catch(() => false)) return msg2;
    if (await msg3.isVisible().catch(() => false)) return msg3;
    return null;
  }
}

/**
 * Home Page Object
 */
export class HomePage extends BasePage {
  async goto() {
    await super.goto("/");
  }

  async getHeader(): Promise<Locator> {
    return this.page.locator('header, nav, [role="banner"]').first();
  }

  async getSearchBar(): Promise<Locator> {
    return this.page
      .locator(
        'input[placeholder*="검색"], input[placeholder*="search"], [data-testid="search"]',
      )
      .first();
  }

  async getCategoryGrid(): Promise<Locator> {
    return this.page
      .locator('[data-testid="category-grid"], .category-grid, [role="group"]')
      .first();
  }

  async getCategoryItems(): Promise<Locator[]> {
    const items = await this.page
      .locator(
        '[data-testid="category-item"], .category-item, [data-testid="category"]',
      )
      .all();
    return items;
  }

  async getFeaturedSection(): Promise<Locator> {
    return this.page
      .locator('[data-testid="featured"], .featured, section:has-text("추천")')
      .first();
  }

  async getAuctionCards(): Promise<Locator[]> {
    const cards = await this.page
      .locator(
        '[data-testid="auction-card"], .auction-card, [data-testid="auction-item"]',
      )
      .all();
    return cards;
  }

  async getNewsBanner(): Promise<Locator | null> {
    const banner = this.page.locator(
      '[data-testid="news-banner"], .news-banner',
    );
    if (await banner.isVisible().catch(() => false)) return banner;
    return null;
  }

  async getQuizBanner(): Promise<Locator | null> {
    const banner = this.page.locator(
      '[data-testid="quiz-banner"], .quiz-banner',
    );
    if (await banner.isVisible().catch(() => false)) return banner;
    return null;
  }

  async getImages(): Promise<Locator[]> {
    return await this.page.locator("img").all();
  }

  async getButtons(): Promise<Locator[]> {
    return await this.page.locator("button").all();
  }

  async getTabBar(): Promise<Locator | null> {
    const bar = this.page.locator(
      '[data-testid="tab-bar"], .tab-bar, [role="tablist"]',
    );
    if (await bar.isVisible().catch(() => false)) return bar;
    return null;
  }

  async getNavBar(): Promise<Locator> {
    return this.page
      .locator('nav, [data-testid="nav-bar"], [role="navigation"]')
      .first();
  }

  async getFavoritesTab(): Promise<Locator | null> {
    const tab = this.page.locator(
      '[data-testid="favorites-tab"], text=찜, text=찜하기, text=Favorites',
    );
    if (await tab.isVisible().catch(() => false)) return tab;
    return null;
  }
}

/**
 * Auction List Page Object
 */
export class AuctionListPage extends BasePage {
  async goto() {
    await super.goto("/");
    // Click on list tab if needed
    const listTab = this.page
      .locator('[data-testid="list-tab"], text=목록')
      .first();
    if (await listTab.isVisible().catch(() => false)) {
      await listTab.click().catch(() => {});
    }
  }

  async getAuctionCards(): Promise<Locator[]> {
    return await this.page
      .locator(
        '[data-testid="auction-card"], .auction-card, [data-testid="auction-item"]',
      )
      .all();
  }

  async getFilterBar(): Promise<Locator> {
    return this.page.locator('[data-testid="filter-bar"], .filter-bar').first();
  }

  async getSortOptions(): Promise<Locator> {
    return this.page.locator('[data-testid="sort"], .sort-options').first();
  }

  async getStatusFilter(): Promise<Locator> {
    return this.page
      .locator('[data-testid="status-filter"], button:has-text("상태")')
      .first();
  }

  async getStatusOption(status: string): Promise<Locator | null> {
    const option = this.page.locator(
      `text=${status}, [data-value="${status}"]`,
    );
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getRegionFilter(): Promise<Locator> {
    return this.page
      .locator('[data-testid="region-filter"], button:has-text("지역")')
      .first();
  }

  async getRegionOption(region: string): Promise<Locator | null> {
    const option = this.page.locator(`text=${region}`);
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getTypeFilter(): Promise<Locator> {
    return this.page
      .locator('[data-testid="type-filter"], button:has-text("유형")')
      .first();
  }

  async getTypeOption(type: string): Promise<Locator | null> {
    const option = this.page.locator(`text=${type}, [data-value="${type}"]`);
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getPriceFilter(): Promise<Locator | null> {
    const filter = this.page.locator(
      '[data-testid="price-filter"], button:has-text("가격")',
    );
    if (await filter.isVisible().catch(() => false)) return filter;
    return null;
  }

  async getPriceMinInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[data-testid="price-min"], input[placeholder*="최소"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }

  async getPriceMaxInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[data-testid="price-max"], input[placeholder*="최대"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }

  async getApplyFilterButton(): Promise<Locator | null> {
    const button = this.page.locator(
      'button:has-text("적용"), [data-testid="apply-filter"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getSortButton(): Promise<Locator> {
    return this.page
      .locator('[data-testid="sort-button"], button:has-text("정렬")')
      .first();
  }

  async getSortOption(label: string): Promise<Locator | null> {
    const option = this.page.locator(`text=${label}`);
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getNextPageButton(): Promise<Locator | null> {
    const button = this.page.locator(
      '[data-testid="next-page"], button:has-text("다음")',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getEmptyState(): Promise<Locator | null> {
    const empty = this.page.locator(
      '[data-testid="empty-state"], text=검색결과',
    );
    if (await empty.isVisible().catch(() => false)) return empty;
    return null;
  }

  async getClearFiltersButton(): Promise<Locator | null> {
    const button = this.page.locator(
      'button:has-text("초기화"), [data-testid="clear-filters"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getSearchInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[placeholder*="검색"], [data-testid="search"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }
}

/**
 * Auction Detail Page Object
 */
export class AuctionDetailPage extends BasePage {
  async goto(id: string) {
    await super.goto(`/${id}`);
  }

  async getTitle(): Promise<Locator> {
    return this.page
      .locator('[data-testid="title"], h1, [role="heading"]')
      .first();
  }

  async getImages(): Promise<Locator[]> {
    return await this.page
      .locator('[data-testid="auction-image"], .images img')
      .all();
  }

  async getImagePrevButton(): Promise<Locator> {
    return this.page
      .locator('[data-testid="prev-image"], button:has-text("이전")')
      .first();
  }

  async getImageNextButton(): Promise<Locator> {
    return this.page
      .locator('[data-testid="next-image"], button:has-text("다음")')
      .first();
  }

  async getPriceSection(): Promise<Locator> {
    return this.page.locator('[data-testid="price"], .price-section').first();
  }

  async getStartPrice(): Promise<Locator> {
    return this.page
      .locator('[data-testid="start-price"], text=시작가')
      .first();
  }

  async getCurrentBid(): Promise<Locator> {
    return this.page
      .locator('[data-testid="current-bid"], text=현재가')
      .first();
  }

  async getStatus(): Promise<Locator> {
    return this.page.locator('[data-testid="status"], .status').first();
  }

  async getDetailsSection(): Promise<Locator> {
    return this.page
      .locator('[data-testid="details"], .details-section')
      .first();
  }

  async getLocation(): Promise<Locator> {
    return this.page.locator('[data-testid="location"], text=위치').first();
  }

  async getType(): Promise<Locator | null> {
    const type = this.page.locator('[data-testid="type"], text=유형');
    if (await type.isVisible().catch(() => false)) return type;
    return null;
  }

  async getDescription(): Promise<Locator | null> {
    const desc = this.page.locator('[data-testid="description"], .description');
    if (await desc.isVisible().catch(() => false)) return desc;
    return null;
  }

  async getFavoriteButton(): Promise<Locator> {
    return this.page
      .locator('[data-testid="favorite"], button[aria-label*="찜"]')
      .first();
  }

  async getShareButton(): Promise<Locator | null> {
    const button = this.page.locator(
      '[data-testid="share"], button[aria-label*="공유"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getBiddingSection(): Promise<Locator | null> {
    const section = this.page.locator(
      '[data-testid="bidding"], .bidding-section',
    );
    if (await section.isVisible().catch(() => false)) return section;
    return null;
  }

  async getBidHistory(): Promise<Locator | null> {
    const history = this.page.locator(
      '[data-testid="bid-history"], .bid-history',
    );
    if (await history.isVisible().catch(() => false)) return history;
    return null;
  }

  async getBidHistoryItems(): Promise<Locator[]> {
    return await this.page.locator('[data-testid="bid-item"], .bid-item').all();
  }

  async getRelatedAuctionsSection(): Promise<Locator | null> {
    const section = this.page.locator('[data-testid="related"], text=관련');
    if (await section.isVisible().catch(() => false)) return section;
    return null;
  }

  async getRelatedAuctionCards(): Promise<Locator[]> {
    return await this.page
      .locator('[data-testid="related-card"], .related-card')
      .all();
  }

  async getInquiryButton(): Promise<Locator | null> {
    const button = this.page.locator(
      'button:has-text("문의"), [data-testid="inquiry"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getModal(): Promise<Locator> {
    return this.page.locator('[role="dialog"], .modal').first();
  }

  async getBackButton(): Promise<Locator | null> {
    const button = this.page.locator(
      '[data-testid="back"], button[aria-label*="뒤"], button:has-text("뒤")',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getBiddingRate(): Promise<Locator | null> {
    const rate = this.page.locator('[data-testid="bidding-rate"], text=%');
    if (await rate.isVisible().catch(() => false)) return rate;
    return null;
  }

  async getAuctionStartDate(): Promise<Locator | null> {
    const date = this.page.locator('[data-testid="start-date"], text=시작');
    if (await date.isVisible().catch(() => false)) return date;
    return null;
  }

  async getAuctionEndDate(): Promise<Locator | null> {
    const date = this.page.locator('[data-testid="end-date"], text=종료');
    if (await date.isVisible().catch(() => false)) return date;
    return null;
  }

  async getBidInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[type="number"], [data-testid="bid-input"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }

  async getBidButton(): Promise<Locator | null> {
    const button = this.page.locator(
      'button:has-text("입찰"), [data-testid="bid-button"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getHighestBidder(): Promise<Locator | null> {
    const bidder = this.page.locator(
      '[data-testid="highest-bidder"], text=최고입찰자',
    );
    if (await bidder.isVisible().catch(() => false)) return bidder;
    return null;
  }

  async getErrorMessage(): Promise<Locator | null> {
    const error = this.page.locator('[role="alert"], .error-message');
    if (await error.isVisible().catch(() => false)) return error;
    return null;
  }
}

/**
 * Profile Page Object
 */
export class ProfilePage extends BasePage {
  async goto() {
    await super.goto("/my/profile-edit");
  }

  async getAvatar(): Promise<Locator> {
    return this.page
      .locator('[data-testid="avatar"], img[alt*="avatar"]')
      .first();
  }

  async getUserName(): Promise<Locator> {
    return this.page.locator('[data-testid="user-name"], .user-name').first();
  }

  async getUserEmail(): Promise<Locator | null> {
    const email = this.page.locator('[data-testid="user-email"], .user-email');
    if (await email.isVisible().catch(() => false)) return email;
    return null;
  }

  async getMenuItems(): Promise<Locator[]> {
    return await this.page
      .locator('[data-testid="menu-item"], .menu-item, a[role="menuitem"]')
      .all();
  }

  async getEditProfileOption(): Promise<Locator | null> {
    const option = this.page.locator(
      '[data-testid="edit-profile"], text=정보수정, text=프로필수정',
    );
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getFavoritesOption(): Promise<Locator | null> {
    const option = this.page.locator('[data-testid="favorites"], text=찜목록');
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getRecentlyViewedOption(): Promise<Locator | null> {
    const option = this.page.locator(
      '[data-testid="recently-viewed"], text=최근조회',
    );
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getNotificationsOption(): Promise<Locator | null> {
    const option = this.page.locator(
      '[data-testid="notifications"], text=알림',
    );
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getSettingsOption(): Promise<Locator | null> {
    const option = this.page.locator('[data-testid="settings"], text=설정');
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getLogoutButton(): Promise<Locator> {
    return this.page
      .locator('button:has-text("로그아웃"), [data-testid="logout"]')
      .first();
  }

  async getHelpOption(): Promise<Locator | null> {
    const option = this.page.locator(
      '[data-testid="help"], text=도움, text=지원',
    );
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getPrivacyOption(): Promise<Locator | null> {
    const option = this.page.locator('[data-testid="privacy"], text=개인정보');
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getTermsOption(): Promise<Locator | null> {
    const option = this.page.locator('[data-testid="terms"], text=약관');
    if (await option.isVisible().catch(() => false)) return option;
    return null;
  }

  async getVersionInfo(): Promise<Locator | null> {
    const info = this.page.locator('[data-testid="version"], text=버전');
    if (await info.isVisible().catch(() => false)) return info;
    return null;
  }

  async getConfirmDialog(): Promise<Locator | null> {
    const dialog = this.page.locator('[role="dialog"], .confirm-dialog');
    if (await dialog.isVisible().catch(() => false)) return dialog;
    return null;
  }

  async getConfirmButton(): Promise<Locator> {
    return this.page
      .locator('button:has-text("확인"), [data-testid="confirm"]')
      .first();
  }

  async getNameInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[name="name"], input[placeholder*="이름"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }

  async getEmailInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[name="email"], input[placeholder*="이메일"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }

  async getPhoneInput(): Promise<Locator | null> {
    const input = this.page.locator(
      'input[name="phone"], input[placeholder*="전화"]',
    );
    if (await input.isVisible().catch(() => false)) return input;
    return null;
  }

  async getSaveButton(): Promise<Locator | null> {
    const button = this.page.locator(
      'button:has-text("저장"), [data-testid="save"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getCancelButton(): Promise<Locator | null> {
    const button = this.page.locator(
      'button:has-text("취소"), [data-testid="cancel"]',
    );
    if (await button.isVisible().catch(() => false)) return button;
    return null;
  }

  async getSuccessMessage(): Promise<Locator | null> {
    const msg = this.page.locator('[role="status"], .success-message');
    if (await msg.isVisible().catch(() => false)) return msg;
    return null;
  }

  async getErrorMessage(): Promise<Locator | null> {
    const error = this.page.locator('[role="alert"], .error-message');
    if (await error.isVisible().catch(() => false)) return error;
    return null;
  }
}

/**
 * Helper functions
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector(
      '[data-testid="user-menu"], [data-testid="user-name"]',
      { timeout: 1000 },
    );
    return true;
  } catch {
    return false;
  }
}

export async function logout(page: Page) {
  try {
    await page.click('[data-testid="logout"], button:has-text("로그아웃")');
    await page
      .waitForNavigation({ waitUntil: "domcontentloaded" })
      .catch(() => {});
  } catch {
    // Already logged out
  }
}

// Alias for backward compatibility
export { AuthPage as LoginPage };
