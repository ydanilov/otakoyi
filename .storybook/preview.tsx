import type { Preview } from "@storybook/nextjs-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import { fontMono, fontSans } from "../src/fonts"
import { assertLayout } from "../src/test/layout"
import "../src/app/globals.css"

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Harness sensor: a11y violations fail the Storybook test run.
    a11y: { test: "error" },
    nextjs: { appDirectory: true },
  },
  // Harness sensor: every story is checked for horizontal overflow, overlapping
  // interactive elements and clipped text. Opt out with parameters.layoutCheck = false.
  afterEach: async ({ canvasElement, parameters }) => {
    if (parameters.layoutCheck === false) return
    assertLayout(canvasElement)
  },
  decorators: [
    withThemeByClassName({ themes: { dark: "dark", light: "" }, defaultTheme: "dark" }),
    (Story) => (
      <div
        className={`${fontSans.variable} ${fontMono.variable} bg-background font-sans text-foreground`}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
