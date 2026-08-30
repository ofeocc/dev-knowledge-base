import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ESM-friendly equivalent of __dirname (the project root that holds this config).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// When BASE_URL is provided (e.g. a static server you started yourself), the
// test runner connects to it and does not start its own web server.
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const shouldStartWebServer = !process.env.BASE_URL;

// The entry HTML file — vite preview serves dist/ and there is no index.html,
// so the health-check URL must include the actual filename.
const ENTRY_HTML = '/dev-knowledge-base.html';

/**
 * Playwright configuration for the developer knowledge base.
 *
 * The site is a static HTML page (dev-knowledge-base.html) whose assets are
 * referenced with relative paths, so it must be served from the project root.
 *
 * The webServer command builds the project first (`vite build`) and then
 * serves the production output via `vite preview`. This ensures the dist/
 * directory exists before the preview server starts. If you prefer to test
 * against a running dev server instead, set BASE_URL:
 *   BASE_URL=http://localhost:3000 npx playwright test
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retry once on CI, not locally.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Per-test timeout.
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [['list'], ['html']],

  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 15000,
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: shouldStartWebServer
    ? {
        command: 'npx vite build && npx vite preview --port 3000',
        url: `${baseURL}${ENTRY_HTML}`,
        reuseExistingServer: true,
        timeout: 120000,
        cwd: __dirname,
      }
    : undefined,
});
