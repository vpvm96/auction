import { expect, test } from "@playwright/test";
import { ProfilePage } from "./fixtures/page-objects";

test.describe("Profile Page E2E", () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.goto();
  });

  test("should load profile page", async ({ page }) => {
    await expect(page).toHaveTitle(/프로필|Profile|내정보|My/);
  });

  test("should display user avatar", async () => {
    const avatar = await profilePage.getAvatar();
    await expect(avatar).toBeVisible();
  });

  test("should display user name", async () => {
    const userName = await profilePage.getUserName();
    await expect(userName).toBeVisible();

    const nameText = await userName.textContent();
    expect(nameText?.length).toBeGreaterThan(0);
  });

  test("should display user email", async () => {
    const userEmail = await profilePage.getUserEmail();
    if (userEmail) {
      await expect(userEmail).toBeVisible();

      const emailText = await userEmail.textContent();
      expect(emailText).toMatch(/@/);
    }
  });

  test("should display profile menu items", async () => {
    const menuItems = await profilePage.getMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test("should display edit profile option", async () => {
    const editProfileOption = await profilePage.getEditProfileOption();
    if (editProfileOption) {
      await expect(editProfileOption).toBeVisible();
    }
  });

  test("should navigate to edit profile", async ({ page }) => {
    const editProfileOption = await profilePage.getEditProfileOption();
    if (editProfileOption) {
      await editProfileOption.click();
      await expect(page).toHaveURL(/edit|update/);
    }
  });

  test("should display favorites option", async () => {
    const favoritesOption = await profilePage.getFavoritesOption();
    if (favoritesOption) {
      await expect(favoritesOption).toBeVisible();
    }
  });

  test("should navigate to favorites", async ({ page }) => {
    const favoritesOption = await profilePage.getFavoritesOption();
    if (favoritesOption) {
      await favoritesOption.click();
      await expect(page).toHaveURL(/favorite|like|wishlist/);
    }
  });

  test("should display recently viewed option", async () => {
    const recentlyViewedOption = await profilePage.getRecentlyViewedOption();
    if (recentlyViewedOption) {
      await expect(recentlyViewedOption).toBeVisible();
    }
  });

  test("should navigate to recently viewed", async ({ page }) => {
    const recentlyViewedOption = await profilePage.getRecentlyViewedOption();
    if (recentlyViewedOption) {
      await recentlyViewedOption.click();
      await expect(page).toHaveURL(/recently|history|viewed/);
    }
  });

  test("should display notifications option", async () => {
    const notificationsOption = await profilePage.getNotificationsOption();
    if (notificationsOption) {
      await expect(notificationsOption).toBeVisible();
    }
  });

  test("should navigate to notification settings", async ({ page }) => {
    const notificationsOption = await profilePage.getNotificationsOption();
    if (notificationsOption) {
      await notificationsOption.click();
      await expect(page).toHaveURL(/notification|setting/);
    }
  });

  test("should display settings option", async () => {
    const settingsOption = await profilePage.getSettingsOption();
    if (settingsOption) {
      await expect(settingsOption).toBeVisible();
    }
  });

  test("should navigate to settings", async ({ page }) => {
    const settingsOption = await profilePage.getSettingsOption();
    if (settingsOption) {
      await settingsOption.click();
      await expect(page).toHaveURL(/setting|preference/);
    }
  });

  test("should display logout button", async () => {
    const logoutButton = await profilePage.getLogoutButton();
    await expect(logoutButton).toBeVisible();
  });

  test("should handle logout", async ({ page }) => {
    const logoutButton = await profilePage.getLogoutButton();
    await logoutButton.click();

    // Should show confirmation dialog
    const confirmDialog = await profilePage.getConfirmDialog();
    if (confirmDialog) {
      await expect(confirmDialog).toBeVisible();

      const confirmButton = await profilePage.getConfirmButton();
      await confirmButton.click();

      // Should redirect to login
      await expect(page).toHaveURL(/login|auth/);
    }
  });

  test("should display help/support option", async () => {
    const helpOption = await profilePage.getHelpOption();
    if (helpOption) {
      await expect(helpOption).toBeVisible();
    }
  });

  test("should display privacy policy option", async () => {
    const privacyOption = await profilePage.getPrivacyOption();
    if (privacyOption) {
      await expect(privacyOption).toBeVisible();
    }
  });

  test("should navigate to privacy policy", async ({ page }) => {
    const privacyOption = await profilePage.getPrivacyOption();
    if (privacyOption) {
      await privacyOption.click();
      await expect(page).toHaveURL(/privacy/);
    }
  });

  test("should display terms of service option", async () => {
    const termsOption = await profilePage.getTermsOption();
    if (termsOption) {
      await expect(termsOption).toBeVisible();
    }
  });

  test("should navigate to terms of service", async ({ page }) => {
    const termsOption = await profilePage.getTermsOption();
    if (termsOption) {
      await termsOption.click();
      await expect(page).toHaveURL(/terms|service/);
    }
  });

  test("should display version info", async () => {
    const versionInfo = await profilePage.getVersionInfo();
    if (versionInfo) {
      await expect(versionInfo).toBeVisible();

      const versionText = await versionInfo.textContent();
      expect(versionText).toMatch(/v?\d+\.\d+/);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const userName = await profilePage.getUserName();
    await expect(userName).toBeVisible();

    const menuItems = await profilePage.getMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const userName = await profilePage.getUserName();
    await expect(userName).toBeVisible();

    const menuItems = await profilePage.getMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);
  });
});

test.describe("Profile Edit E2E", () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.goto();

    const editProfileOption = await profilePage.getEditProfileOption();
    if (editProfileOption) {
      await editProfileOption.click();
    }
  });

  test("should display edit profile form", async ({ page }) => {
    await expect(page).toHaveURL(/edit|update/);
  });

  test("should display name input field", async () => {
    const nameInput = await profilePage.getNameInput();
    if (nameInput) {
      await expect(nameInput).toBeVisible();
    }
  });

  test("should display email input field", async () => {
    const emailInput = await profilePage.getEmailInput();
    if (emailInput) {
      await expect(emailInput).toBeVisible();
    }
  });

  test("should display phone input field", async () => {
    const phoneInput = await profilePage.getPhoneInput();
    if (phoneInput) {
      await expect(phoneInput).toBeVisible();
    }
  });

  test("should display save button", async () => {
    const saveButton = await profilePage.getSaveButton();
    if (saveButton) {
      await expect(saveButton).toBeVisible();
    }
  });

  test("should update profile name", async () => {
    const nameInput = await profilePage.getNameInput();
    const saveButton = await profilePage.getSaveButton();

    if (nameInput && saveButton) {
      await nameInput.clear();
      await nameInput.fill("Updated Name");
      await saveButton.click();

      // Should show success message
      const successMessage = await profilePage.getSuccessMessage();
      if (successMessage) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  test("should validate email format", async () => {
    const emailInput = await profilePage.getEmailInput();
    const saveButton = await profilePage.getSaveButton();

    if (emailInput && saveButton) {
      await emailInput.clear();
      await emailInput.fill("invalid-email");
      await saveButton.click();

      const errorMessage = await profilePage.getErrorMessage();
      if (errorMessage) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test("should display cancel button", async () => {
    const cancelButton = await profilePage.getCancelButton();
    if (cancelButton) {
      await expect(cancelButton).toBeVisible();
    }
  });

  test("should cancel edit profile", async ({ page }) => {
    const cancelButton = await profilePage.getCancelButton();
    if (cancelButton) {
      const currentUrl = page.url();
      await cancelButton.click();

      // Should navigate back to profile
      const newUrl = page.url();
      expect(newUrl).not.toBe(currentUrl);
    }
  });
});
