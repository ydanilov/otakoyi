# Metrics

Measured on 2026-10-16 on branch `feat/design-engineering` (production build,
`VERCEL_ENV=production`, served locally with `next start`). Re-run with the commands below.

## Sensors

| Sensor                             | Result                                               | Command                         |
| ---------------------------------- | ---------------------------------------------------- | ------------------------------- |
| Tokens generated in sync           | ✓ 24 tokens × 2 modes                                | `pnpm tokens:check`             |
| Tokens match Figma                 | ✓ 24 / 24 (ΔE ≤ 1, alpha ±0.02)                      | `pnpm tokens:figma:check`       |
| Code Connect                       | ✓ 20 connected + 5 inline = 25 / 25 Figma components | `pnpm figma:check`, `pnpm test` |
| Lint (incl. 5 harness rules)       | ✓ 0 errors                                           | `pnpm lint`                     |
| Types (strict, route types)        | ✓                                                    | `pnpm typecheck`                |
| Story coverage                     | ✓ every section / site / works file                  | `pnpm check:stories`            |
| Unit + contract tests              | ✓ 35 / 35                                            | `pnpm test`                     |
| Storybook interaction + a11y       | ✓ 60 / 60 (axe in `error` mode)                      | `pnpm test:stories`             |
| E2E + axe WCAG 2.2 AA, 3 viewports | ✓ 61 passed, 2 skipped                               | `pnpm test:e2e`                 |
| Initial JS budget (≤ 230 KB gzip)  | ✓ max 227.4 KB (`/`), three.js lazy                  | `pnpm check:budget`             |

## Lighthouse 12

| Page                     | Device  | Performance | Accessibility | Best practices\* | SEO | LCP   | CLS | TBT    |
| ------------------------ | ------- | ----------- | ------------- | ---------------- | --- | ----- | --- | ------ |
| `/`                      | Desktop | 99          | 100           | 96               | 100 | 0.8 s | 0   | 0 ms   |
| `/`                      | Mobile  | 85          | 100           | 96               | 100 | 3.8 s | 0   | 230 ms |
| `/works/pump-the-market` | Desktop | 100         | 100           | 96               | 100 | 0.7 s | 0   | 0 ms   |
| `/works/pump-the-market` | Mobile  | 93          | 100           | 96               | 100 | 3.0 s | 0   | 110 ms |
| `/solutions/conferences` | Desktop | 100         | 98            | 96               | 100 | 0.8 s | 0   | 0 ms   |
| `/solutions/conferences` | Mobile  | 91          | 98            | 96               | 100 | 3.4 s | 0   | 80 ms  |

\* Locally the Vercel Analytics scripts (`/_vercel/*`) return 404, which Lighthouse counts as
console errors; on Vercel they load. Accessibility 98 on solution pages: one heading-order skip
(`h1` → `h3`) — open item.

Mobile runs use Lighthouse's simulated slow 4G + 4× CPU throttling; the home page carries the
particle wordmark and the venue tour, the heaviest above-the-fold work on the site.

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

- 28 PRs merged in the first two weeks (repo started 2026-10-02), each with a Vercel preview.
- 10 ADRs, 11 hard rules in `AGENTS.md`, 13 CI sensors.
- 24 tokens, 23 UI primitives, 36 section / site / works components, all with stories.

## How to reproduce

```bash
pnpm verify:full
VERCEL_ENV=production pnpm build && pnpm start
npx lighthouse@12 http://localhost:3000/ --preset=desktop
npx lighthouse@12 http://localhost:3000/   # mobile
```
