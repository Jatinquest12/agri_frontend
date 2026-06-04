import { defineConfig, devices } from "@playwright/test";

const backendCwd = `${process.cwd()}/../../agri_backend`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run dev",
      url: "http://127.0.0.1:5000/health",
      cwd: backendCwd,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        FABRIC_ENABLED: "false",
        PORT: "5000",
        DEMO_PHONE: "9898989898",
        DEMO_OTP: "123456",
        ADMIN_PHONES: "",
        JWT_SECRET: "e2e-test-jwt-secret",
      },
    },
    {
      command: "npm run dev",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        NEXT_PUBLIC_BACKEND_API_BASE: "http://127.0.0.1:5000/api",
      },
    },
  ],
});
