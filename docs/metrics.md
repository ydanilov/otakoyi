# Metrics

Measured on 2026-10-16 on `main` + this branch (production build,
`VERCEL_ENV=production`, served locally with `next start`). Re-run with the commands below.

## Sensors

| Sensor                                              | Result                                                | Command                         |
| --------------------------------------------------- | ----------------------------------------------------- | ------------------------------- |
| Tokens generated in sync                            | ✓ 24 tokens × 2 modes                                 | `pnpm tokens:check`             |
| Tokens match Figma                                  | ✓ 24 / 24 (ΔE ≤ 1, alpha ±0.02)                       | `pnpm tokens:figma:check`       |
| Code Connect                                        | ✓ 46 connected + 35 inline = 81 / 81 Figma components | `pnpm figma:check`, `pnpm test` |
| Lint (incl. 5 harness rules)                        | ✓ 0 errors                                            | `pnpm lint`                     |
| Types (strict, route types)                         | ✓                                                     | `pnpm typecheck`                |
| Story coverage                                      | ✓ every section / site / works file                   | `pnpm check:stories`            |
| Unit + contract tests                               | ✓ 35 / 35                                             | `pnpm test`                     |
| Storybook interaction + a11y                        | ✓ 60 / 60 (axe in `error` mode)                       | `pnpm test:stories`             |
| E2E + axe WCAG 2.2 AA + best practices, 3 viewports | ✓ 61 passed, 2 skipped                                | `pnpm test:e2e`                 |
| Initial JS budget (≤ 230 KB gzip)                   | ✓ max 227.4 KB (`/`), three.js lazy                   | `pnpm check:budget`             |

## Lighthouse 12

Three runs per page and device; ranges show run-to-run variance of Lighthouse's simulated throttling.

| Page                     | Device  | Performance | Accessibility | Best practices\* | SEO | LCP       | CLS | TBT        |
| ------------------------ | ------- | ----------- | ------------- | ---------------- | --- | --------- | --- | ---------- |
| `/`                      | Desktop | 99–100      | 100           | 96               | 100 | 0.8 s     | 0   | 0 ms       |
| `/`                      | Mobile  | 87–99       | 100           | 96               | 100 | 1.6–4.0 s | 0   | 120–130 ms |
| `/works/pump-the-market` | Desktop | 100         | 100           | 96               | 100 | 0.7–0.8 s | 0   | 0 ms       |
| `/works/pump-the-market` | Mobile  | 88–96       | 100           | 96               | 100 | 2.1–3.6 s | 0   | 80–210 ms  |
| `/solutions/conferences` | Desktop | 100         | 100           | 96               | 100 | 0.7–0.8 s | 0   | 0 ms       |
| `/solutions/conferences` | Mobile  | 94–96       | 100           | 96               | 100 | 2.6–3.0 s | 0   | 100–130 ms |

\* Locally the Vercel Analytics scripts (`/_vercel/*`) return 404, which Lighthouse counts as
console errors; on Vercel they load.

Mobile runs use Lighthouse's simulated slow 4G + 4× CPU throttling.

### What moved the numbers (2026-10-16)

- **Heading order** — solution and works pages jumped from `h1` to `h3`; added the missing `h2`s
  (visually hidden). axe now also runs its `best-practice` rules on every route, so the skip can't
  come back. Accessibility 98 → 100.
- **Fonts** — Geist and Geist Mono subset to Latin plus the punctuation, arrows and € the site
  uses (70 KB → 34 KB each); Geist Mono no longer preloaded (small labels only). Home mobile
  LCP 3.8 s → 1.6–4.0 s, performance 85 → 87–99 (simulated throttling is noisy; the observed LCP is under 0.3 s).

## Initial JS per route (gzip)

| Route                    | KB    |
| ------------------------ | ----- |
| `/`                      | 227.4 |
| `/works`                 | 220.2 |
| `/solutions/[slug]` (×6) | 218.7 |
| `/works/[slug]` (×6)     | 211.7 |
| `/solutions`             | 209.2 |
| `/studio`                | 208.2 |

## Delivery

- 32 PRs merged in the first 15 days (repo started 2026-10-02), each with a Vercel preview.
- 10 ADRs, 11 hard rules in `AGENTS.md`, 13 CI sensors.
- 24 tokens, 23 UI primitives, 36 section / site / works components, all with stories.

## How to reproduce

```bash
pnpm verify:full
VERCEL_ENV=production pnpm build && pnpm start
npx lighthouse@12 http://localhost:3000/ --preset=desktop
npx lighthouse@12 http://localhost:3000/   # mobile
```
