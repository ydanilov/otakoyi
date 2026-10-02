---
name: new-component
description: Scaffold a new section/site component the harness way — component, story with play test, Figma counterpart. Use whenever adding a component under src/components.
---

1. Check Storybook MCP / `src/components` — reuse or extend before creating.
2. Need a primitive? `pnpm dlx shadcn@latest add <name>` into `src/components/ui` (never hand-roll).
3. Create `src/components/<area>/<kebab-name>.tsx`:
   - Named export in PascalCase, props typed, `className` passthrough via `cn()`.
   - Semantic tokens only; responsive with Tailwind breakpoints; heading level configurable if it renders a heading.
4. Create/extend `<area>/*.stories.tsx` with: default, edge cases (long copy, empty), mobile, and a `play` asserting behaviour. The global layout sensor (overflow / overlap / clipped text) and a11y run automatically.
5. `pnpm check:stories && pnpm test:stories`.
6. Add the Figma counterpart (figma-generate-library skill) with matching name and props; add the code path to its description.
