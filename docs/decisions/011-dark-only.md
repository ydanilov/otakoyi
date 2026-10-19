# 011 — Dark only

**Status:** Accepted · 2026-10-19 · supersedes the light mode in 005, the `palette` prop in 003, the dark/light matrix in 002 and the per-mode swatch frames in 010

**Context.** The site has shipped dark since launch: `<html class="dark">` is set by the layout and
the theme toggle is gone. The light values in `tokens/tokens.json`, the second Figma mode, the
`palette` prop on the generative engine and a second set of visual baselines were kept for a light
theme that the owner has decided will never exist. They doubled the token contract, the Figma
frames and the screenshots to review, for nothing a visitor can see.

**Decision.**

- **Tokens.** Each token in `tokens/tokens.json` has one value (the former dark value). `pnpm tokens`
  writes one `:root` block to `src/app/tokens.css`; `generativePalette` and `themeHex` in
  `src/lib/tokens.generated.ts` are flat objects. There is no `GenerativeMode`.
- **Figma.** The _Theme_ collection has one mode, `Default`; the _Tokens_ page has one swatch frame,
  `Tokens` (5:41). `tokens/figma.config.json`, `tokens/figma.json` and `scripts/figma-tokens.mjs`
  carry a single value per token.
- **Generative engine.** `GenerativeWork`, `VenueScene` and `ParticleWordmark` (and their canvases)
  have no `palette` prop; colours come from the token palette or `brandColors`. The particle
  wordmark always blends additively.
- **Visual regression.** One screenshot per route and viewport, named `<route>.png`.
- **Class.** `<html class="dark">` and `@custom-variant dark` stay, so the upstream shadcn `dark:`
  variants in `src/components/ui` keep applying exactly as before. Storybook sets the same class.

**Consequences.** One value per token in code and Figma, half the visual baselines, a smaller
engine contract: `<GenerativeWork work seed density />`. The dark rendering is unchanged. A light
theme, if ever wanted, would be a new ADR that reintroduces modes end to end.
