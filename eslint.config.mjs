import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import storybook from "eslint-plugin-storybook"

// ─── Harness constraints ────────────────────────────────────────────────────
// These rules encode the design-system contract so that humans *and* agents
// get immediate, mechanical feedback. Messages explain the fix.

const RAW_COLOR = String.raw`(#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(|\boklab\()`
const TW_PALETTE = String.raw`\b(bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-\d{2,3})?\b`

const noRawColors = {
  "no-restricted-syntax": [
    "error",
    {
      selector: `Literal[value=/${RAW_COLOR}/]`,
      message: "Raw color value. Use a design token (tokens/tokens.json → bg-*, text-*, var(--*)).",
    },
    {
      selector: `TemplateElement[value.raw=/${RAW_COLOR}/]`,
      message: "Raw color value. Use a design token (tokens/tokens.json → bg-*, text-*, var(--*)).",
    },
    {
      selector: `Literal[value=/${TW_PALETTE}/]`,
      message:
        "Tailwind palette color. Use semantic tokens (bg-background, text-muted-foreground, bg-signal…).",
    },
  ],
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...storybook.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/tokens.generated.ts", "src/content/brand-presets.ts"],
    rules: {
      ...noRawColors,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "radix-ui",
              message: "Import primitives via the design system: @/components/ui/*",
            },
          ],
          patterns: [
            {
              group: ["three", "three/*", "@react-three/*"],
              message: "3D/WebGL lives in src/components/works. Use <GenerativeWork />.",
            },
            {
              group: ["../*"],
              message: "Use the @/ alias instead of parent-relative imports.",
            },
          ],
        },
      ],
    },
  },
  // Design-system internals (upstream shadcn) may use primitives directly and
  // keep upstream overlay/destructive colors (bg-black/50, text-white) to ease updates.
  {
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-syntax": ["error", ...noRawColors["no-restricted-syntax"].slice(1, 3)],
    },
  },
  // The generative engine is the only place allowed to touch three / R3F.
  {
    files: ["src/components/works/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "storybook-static/**",
    "playwright-report/**",
    "test-results/**",
  ]),
])

export default eslintConfig
