import type { Preview } from "@storybook/nextjs-vite"

import { GenerativeWork } from "@/components/works/generative-work"
import { fontLogo, fontMono, fontSans } from "../src/fonts"
import "../src/app/globals.css"

// Dark only (ADR-011): `dark` stays on <html>, as in the app, so shadcn's `dark:` variants (and
// portalled content such as dialogs) render exactly as on the site.
if (typeof document !== "undefined") document.documentElement.classList.add("dark")

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Harness sensor: a11y violations fail the Storybook test run.
    a11y: { test: "error" },
    nextjs: { appDirectory: true },
    // Case bodies (src/content/cases/*.mdx) use <GenerativeWork /> without importing it —
    // on the site it comes from src/mdx-components.tsx; Storybook docs need the same mapping.
    docs: { components: { GenerativeWork } },
  },
  decorators: [
    (Story) => (
      <div
        className={`${fontSans.variable} ${fontMono.variable} ${fontLogo.variable} bg-background font-sans text-foreground`}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
