import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.PORT ?? 3100)
const executablePath = process.env.PW_CHROMIUM_PATH || undefined

/**
 * Harness sensors that run against the production build:
 *  - tests/e2e     → navigation, behaviour, accessibility (axe)
 *  - tests/visual  → screenshot regression (baselines live in git)
 *
 * Visual baselines are environment-specific: generate them in CI with the
 * "Update visual baselines" workflow, never on a laptop.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  snapshotPathTemplate: "{testDir}/visual/__screenshots__/{projectName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Site motion off (ADR-006) freezes every generative work and scroll scene → deterministic frames.
    storageState: {
      cookies: [],
      origins: [
        { origin: `http://localhost:${PORT}`, localStorage: [{ name: "motion", value: "off" }] },
      ],
    },
    trace: "on-first-retry",
    launchOptions: {
      executablePath,
      args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 834, height: 1112 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
