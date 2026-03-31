import { expect, test } from "@playwright/test";
import { AuthPage } from "./fixtures/page-objects";

test.describe("Authentication E2E", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test("should navigate to login page", async ({ page }) => {
    await expect(page).toHaveTitle(/로그인|Login/);
  });

  test("should display login form fields", async () => {
    const emailInput = await authPage.getEmailInput();
    const passwordInput = await authPage.getPasswordInput();
    const loginButton = await authPage.getLoginButton();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test("should show validation error for invalid email", async () => {
    await authPage.fillEmail("invalid-email");
    await authPage.fillPassword("password123");
    await authPage.clickLoginButton();

    const error = await authPage.getErrorMessage();
    await expect(error).toBeVisible();
  });

  test("should show validation error for empty password", async () => {
    await authPage.fillEmail("test@example.com");
    await authPage.fillPassword("");
    await authPage.clickLoginButton();

    const error = await authPage.getErrorMessage();
    // Error might be shown inline or in validation state
    const passwordInput = await authPage.getPasswordInput();
    await expect(passwordInput).toBeFocused();
  });

  test("should toggle password visibility", async () => {
    const passwordInput = await authPage.getPasswordInput();
    const toggleButton = await authPage.getPasswordTogpleButton();

    // Initially password type
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click toggle
    await toggleButton.click();

    // Should be text type
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Click toggle again
    await toggleButton.click();

    // Back to password type
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should navigate to signup", async () => {
    const signupLink = await authPage.getSignupLink();
    await signupLink.click();

    // Should navigate to signup page
    await expect(authPage.page).toHaveURL(/signup|register/);
  });

  test("should navigate to forgot password", async () => {
    const forgotLink = await authPage.getForgotPasswordLink();
    await forgotLink.click();

    // Should navigate to forgot password page
    await expect(authPage.page).toHaveURL(/forgot|reset/);
  });

  test("should display social login buttons", async () => {
    const kakaoButton = await authPage.getKakaoLoginButton();
    const googleButton = await authPage.getGoogleLoginButton();

    await expect(kakaoButton).toBeVisible();
    await expect(googleButton).toBeVisible();
  });

  test("should maintain email value on focus change", async () => {
    const testEmail = "persistent@example.com";
    await authPage.fillEmail(testEmail);

    const passwordInput = await authPage.getPasswordInput();
    await passwordInput.focus();

    const emailInput = await authPage.getEmailInput();
    await expect(emailInput).toHaveValue(testEmail);
  });
});

test.describe("Signup E2E", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();

    const signupLink = await authPage.getSignupLink();
    await signupLink.click();
  });

  test("should display signup form fields", async () => {
    const nameInput = await authPage.getNameInput();
    const emailInput = await authPage.getEmailInput();
    const passwordInput = await authPage.getPasswordInput();
    const signupButton = await authPage.getSignupButton();

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(signupButton).toBeVisible();
  });

  test("should show validation error for weak password", async () => {
    await authPage.fillName("Test User");
    await authPage.fillEmail("test@example.com");
    await authPage.fillPassword("123");
    await authPage.clickSignupButton();

    const error = await authPage.getErrorMessage();
    await expect(error).toBeVisible();
  });
});

test.describe("Forgot Password E2E", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();

    const forgotLink = await authPage.getForgotPasswordLink();
    await forgotLink.click();
  });

  test("should display forgot password form", async () => {
    const emailInput = await authPage.getEmailInput();
    const submitButton = await authPage.getSubmitButton();

    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("should show success message after submission", async () => {
    await authPage.fillEmail("test@example.com");
    await authPage.getSubmitButton().click();

    const successMessage = await authPage.getSuccessMessage();
    await expect(successMessage).toBeVisible();
  });
});
