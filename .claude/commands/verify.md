---
description: Run every sensor and summarise failures with the fix for each
---

Run, in order, stopping to fix anything red before moving on:

1. `pnpm verify` — tokens, lint, format, types, story coverage, unit + Storybook (interaction, a11y, layout)
2. `pnpm build && pnpm check:budget`
3. `pnpm test:e2e && pnpm test:layout`
4. `pnpm check:deadcode`

Report as a table: sensor · status · what failed · fix applied. Do not mark the task done while any sensor is red.
Visual regression (`pnpm test:visual`) runs in CI only; never update baselines yourself.
