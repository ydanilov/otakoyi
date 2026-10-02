import type { StorybookConfig } from "@storybook/nextjs-vite"

const config: StorybookConfig = {
  // Case MDX in src/content is site content, not Storybook docs.
  stories: ["../src/docs/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    // Exposes stories to coding agents over MCP (component docs + props).
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
}
export default config
