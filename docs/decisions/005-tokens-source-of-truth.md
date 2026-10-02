# 005 — `tokens/tokens.json` as token source of truth

**Status:** Accepted · 2026-10-02

**Decision.** One JSON file with `dark`/`light` values per token (OKLCH). `pnpm tokens` generates `src/app/tokens.css` (shadcn CSS variables) and `src/lib/tokens.generated.ts` (hex palette for WebGL). Figma Variables (collection _Theme_, modes Dark/Light) mirror the same names. CI fails if generated files are stale.

Brand accent is `signal` (lime). shadcn's own `accent` stays a neutral hover surface so upstream components behave as designed.

**Consequences.** Dark-first: `<html class="dark">` by default; light mode via toggle (stored in `localStorage`).
