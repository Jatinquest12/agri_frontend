import { test, expect } from "@playwright/test";

const DEMO_PHONE = "9898989898";
const DEMO_OTP = "123456";

test.describe("Farmer auth E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/farmer/login");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
  });

  test("farmer can login with demo OTP and reach dashboard", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /sign in with mobile otp/i }),
    ).toBeVisible();

    const phoneInput = page.getByPlaceholder(DEMO_PHONE);
    await expect(phoneInput).toHaveValue(DEMO_PHONE);

    await page.getByRole("button", { name: /send otp/i }).click();
    await expect(page.getByText(/otp sent to/i)).toBeVisible({ timeout: 15_000 });

    const otpInput = page.getByRole("textbox").nth(1);
    await otpInput.fill(DEMO_OTP);

    await page.getByRole("button", { name: /verify & continue/i }).click();

    await expect(page).toHaveURL(/\/farmer\/?$/, { timeout: 15_000 });
    await expect(page.getByText(/farmer workspace/i)).toBeVisible();
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test("invalid OTP shows error", async ({ page }) => {
    await page.getByRole("button", { name: /send otp/i }).click();
    await expect(page.getByText(/otp sent to/i)).toBeVisible({ timeout: 15_000 });

    await page.getByRole("textbox").nth(1).fill("000000");
    await page.getByRole("button", { name: /verify & continue/i }).click();

    await expect(page.getByText(/invalid otp/i)).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/farmer\/login/);
  });
});
