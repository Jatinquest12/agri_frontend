import { test, expect } from "@playwright/test";

const DEMO_PHONE = "9898989898";
const DEMO_OTP = "123456";

async function loginAsFarmer(page: import("@playwright/test").Page) {
  await page.goto("/farmer/login");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.getByRole("button", { name: /send otp/i }).click();
  await expect(page.getByText(/otp sent to/i)).toBeVisible({ timeout: 15_000 });
  await page.getByRole("textbox").nth(1).fill(DEMO_OTP);
  await page.getByRole("button", { name: /verify & continue/i }).click();
  await expect(page).toHaveURL(/\/farmer\/?$/, { timeout: 15_000 });
}

test.describe("Farm registration & proof E2E", () => {
  test("register demo farm via UI", async ({ page }) => {
    await loginAsFarmer(page);

    await page.getByRole("link", { name: /add farm/i }).click();
    await expect(page).toHaveURL(/\/farmer\/farms\/new/);

    await page.getByRole("button", { name: /register on backend/i }).click();

    await expect(page).toHaveURL(/\/farmer\/farms/, { timeout: 20_000 });
    await expect(page.getByText(/e2e farmer|ramesh kumar|farm-/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("create and verify proof from farmer proof page", async ({ page }) => {
    await loginAsFarmer(page);

    await page.getByRole("link", { name: /^proof$/i }).click();
    await expect(page).toHaveURL(/\/farmer\/proof/);

    const createBtn = page.getByRole("button", { name: /post \/api\/proof\/create/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await expect(page.getByText(/proof created/i)).toBeVisible({ timeout: 15_000 });
    }

    await expect(page.getByText(/proof verification/i).first()).toBeVisible();
  });
});
