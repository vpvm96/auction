/**
 * Playwright Global Setup
 * Run before all E2E tests start
 */

import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  // Optional: Perform login once and reuse it across tests
  // This can speed up test execution

  console.log("🚀 Setting up E2E test environment...");

  // You can start a browser, log in, and save auth state here
  // Then use it in tests with: use: { storageState: 'auth.json' }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to app
  const projectUse = config.projects[0]?.use;
  const baseURL =
    (typeof projectUse?.baseURL === "string"
      ? projectUse.baseURL
      : undefined) || "http://localhost:3000";
  await page.goto(baseURL);

  // Wait for app to load (optional)
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
    console.warn("⚠️  App did not reach networkidle, continuing anyway...");
  });

  console.log("✅ E2E environment ready");

  await context.close();
  await browser.close();
}

export default globalSetup;
