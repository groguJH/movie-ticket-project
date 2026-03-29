import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {

    trace: 'on-first-retry',
  },
  webServer: {
    command: "yarn dev",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "test-secret",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      PLAYWRIGHT_BASE_URL:
        process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
      MONGODB_URI:
        process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/mymovieticket",
      KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID ?? "test-kakao-client-id",
      KAKAO_CLIENT_SECRET:
        process.env.KAKAO_CLIENT_SECRET ?? "test-kakao-client-secret",
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID ?? "test-naver-client-id",
      NAVER_CLIENT_SECRET:
        process.env.NAVER_CLIENT_SECRET ?? "test-naver-client-secret",
      SOCIAL_PEPPER_HMAC_SECRET:
        process.env.SOCIAL_PEPPER_HMAC_SECRET ?? "test-social-pepper",
      ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? "admin1@google.com",
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
