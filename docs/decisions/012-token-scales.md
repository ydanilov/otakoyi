# 012 — Token scales: type, motion, glass, layout

**Status:** Accepted · 2026-11-16 · extends 005

**Context.** `tokens/tokens.json` held colours and one radius. Everything else was decided per
usage: 13 font sizes plus five arbitrary `text-[clamp(…)]` / `text-[7.5rem]` values, line-heights
`leading-[0.95]` / `leading-[0.85]` copied across heroes, durations 200–1000 ms picked by hand,
five glass surfaces with their own tint and blur, and `mx-auto max-w-7xl px-4 md:px-8` repeated 27
times. Figma had no counterpart for any of it, so drift could not be checked.

**Decision.**

- `tokens.json` gets four scale groups. `pnpm tokens` writes them as `--<group>-<sub>-<name>`
  variables in `src/app/tokens.css`.
  - `type.size` — xs…9xl (Tailwind's default values) plus named display sizes:
    `display-fluid`, `display-outline`, `display-outline-fluid`, `logo`, `logo-md`.
    `type.leading` — `display` (0.95), `display-tight` (0.85). `type.tracking` — `eyebrow` (0.3em).
  - `motion.duration` — fast 200 · base 300 · slow 500 · slower 700 · slowest 1000 ms.
    `motion.ease` — out / in / in-out (Tailwind's curves).
  - `glass` — `bar` (header), `panel` (venue copy), `pill` (venue switcher), `chip`,
    `chip-strong` (badges over imagery): background tint, blur, saturation.
  - `layout` — container 80rem, gutter 1rem, gutter-md 2rem.
- `globals.css` maps them onto Tailwind's theme (`text-*`, `leading-*`, `tracking-*`,
  `duration-*`, `delay-*`, `ease-*`) and two utilities, `glass-<name>` and `page-container`.
  `cn()` (tailwind-merge) is taught the new names, so `text-logo` is a size, not a colour, and
  `glass-chip` replaces a component's own background.
- ESLint rejects arbitrary `text-[…]`, `leading-[…]`, `tracking-[…]`, `duration-…` and `delay-…`
  numbers outside `ui/`. A new step is added to `tokens.json`, not inlined.
- Values were taken from what the site already rendered, so this changed no pixels; the visual
  regression suite is the proof.

**Consequences.** Changing a scale step changes it everywhere. The glass surfaces are kept as
five because the site uses five; merging them is a design decision for the owner, now a one-line
change. `tokens:figma:check` still covers colours only — the scales are mirrored as Figma
variables (collection _Scale_) and text styles by hand until a sensor reads them.
