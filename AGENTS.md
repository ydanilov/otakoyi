<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Studio Portfolio — agent guide

Sales site for a generative design studio that **sells custom installations** for conferences, events,
offices and exhibition venues. Positioning and copy rules: `docs/brief.md` — read it before writing any copy.
This file is the **harness**: read it before every task.
Humans own direction and approval; agents do the work between checkpoints.

## Stack (decided — see `docs/decisions/`)

| Layer          | Choice                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| Framework      | Next.js 16 App Router, TypeScript strict, pnpm                              |
| UI             | shadcn/ui (new-york, source in `src/components/ui`) + Tailwind v4           |
| Tokens         | `tokens/tokens.json` → `pnpm tokens` → CSS vars + TS                        |
| Generative     | React Three Fiber + GLSL in `src/components/works`                          |
| Content        | MDX in `src/content/cases/*.mdx`, metadata in `src/content/cases.ts` (zod)  |
| Component docs | Storybook 10 (`@storybook/nextjs-vite`) — the component contract            |
| Tests          | Vitest (unit + Storybook interaction/a11y), Playwright (e2e, axe, visual)   |
| Design         | Figma file "Draft" (Variables mirror `tokens.json`); references from Mobbin |
| Hosting        | GitHub (private) → Vercel (preview per PR, prod on `main`)                  |

## Live

- Site: https://studio-portfolio-navy.vercel.app
- Storybook: https://studio-portfolio-storybook.vercel.app
- Figma: https://www.figma.com/design/7fyYBxvBHHEK4IKO6ZTkXN/Draft

## Commands

```bash
pnpm dev                 # Next dev server
pnpm storybook           # component workshop on :6006 (also an MCP server at /mcp)
pnpm tokens              # regenerate CSS/TS from tokens/tokens.json
pnpm verify              # fast sensors: tokens, lint, format, types, story coverage, unit + Storybook (interaction, a11y, layout)
pnpm verify:full         # + build, JS budget, Playwright e2e/a11y + layout contract
pnpm check:deadcode      # knip: unused files, exports, deps
pnpm test:lighthouse     # Lighthouse CI budgets (needs a build)
pnpm test:visual         # screenshot regression (baselines are generated in CI only)
```

Agent shortcuts (Claude Code): `/task`, `/verify`, `/ship`, `/sweep`, `/figma-sync`; subagents
`reviewer`, `a11y-auditor`, `design-parity`; skills `new-component`, `new-case`. See `docs/workflow.md`.

Hooks run automatically: every edit is formatted + linted (`scripts/agent-hooks/post-edit.mjs`);
before you finish, tokens / story coverage / types must be green (`stop.mjs`). Git hooks (lefthook)
lint staged files, enforce conventional commits and run `pnpm verify` before push.

## Hard rules (enforced by sensors — the error message tells you the fix)

1. **Tokens only.** No raw colors (`#fff`, `rgb()`, `oklch()`) and no Tailwind palette colors (`bg-red-500`) in `src/`. Use semantic classes (`bg-background`, `text-muted-foreground`, `bg-signal`) or `var(--token)`. New color → add it to `tokens/tokens.json`, run `pnpm tokens`, map it in `globals.css`.
2. **Design system first.** Compose pages from `@/components/ui/*` and `@/components/sections/*`. Never import `radix-ui` outside `src/components/ui`. Need a new primitive? Copy it from shadcn, don't hand-roll it.
3. **WebGL is quarantined.** `three` / `@react-three/*` only inside `src/components/works`. Everywhere else use `<GenerativeWork work seed palette density />`.
4. **No story, no component.** Every file in `ui/`, `sections/`, `site/`, `works/` needs a story next to it (`pnpm check:stories`). Add `play` functions for interactive behaviour. Every story is also checked for overflow, overlapping controls and clipped text — opt out only with `parameters.layoutCheck = false` and a comment why.
5. **Accessibility is a test, not a review comment.** Storybook a11y runs in `error` mode; Playwright runs axe (WCAG 2.2 AA) on every route.
6. **Content contract.** Each case = entry in `src/content/cases.ts` + `src/content/cases/<slug>.mdx`. Schema is zod; tests fail on orphans or missing bodies.
7. **Budget.** Initial JS ≤ 230 KB gzip per route and three.js must be lazy (`pnpm check:budget`).
8. **Determinism.** Generative works must render identically for the same `seed` under `prefers-reduced-motion: reduce` (used by visual tests). Never use `Math.random()` in shaders or render paths — derive from `seed`.
9. **Page outline.** One `h1` per page, no skipped heading levels (`SectionHeading as="h1"`, `WorkCard headingLevel`). Every page ends with a proposal CTA — enforced by `pnpm test:layout`.
10. Use the `@/` alias, never `../` imports.

## Workflow per task (full version: `docs/workflow.md`)

1. Read the issue and its acceptance criteria. If ambiguous, **ask** — do not guess.
2. Reference: check `docs/research/` (Mobbin findings). Add new references there.
3. Design: if a Figma frame exists, read it via Figma MCP (`get_design_context`) and map it to existing components.
4. Build on a branch `feat/<slug>` / `fix/<slug>`; conventional commits.
5. Story + tests for every new or changed component.
6. `pnpm verify:full` green locally.
7. Open a PR with the template; attach the Vercel preview and Storybook link.
8. **Never push to `main`, deploy to production, or update visual baselines** without explicit human approval.

## Human checkpoints

1. Brief & acceptance criteria · 2. Direction after research · 3. PR review (preview + Storybook) · 4. Production release.

## Where things live

```
AGENTS.md                ← you are here (CLAUDE.md imports it)
docs/brief.md            ← positioning, audience, messaging, copy rules
docs/workflow.md         ← the harness loop: guides, sensors, constraints, cleanup
docs/decisions/          ← ADRs. Don't relitigate — propose a new ADR instead
docs/research/           ← Mobbin / reference findings
docs/figma.md            ← Figma file structure and code ↔ design mapping
tokens/tokens.json       ← design tokens source of truth
src/app/                 ← routes (/, /works, /works/[slug], /studio)
src/components/ui/       ← shadcn primitives (+ `signal` button variant)
src/components/sections/ ← page sections composed from ui
src/components/site/     ← header, footer, theme
src/components/works/    ← generative engine (R3F + GLSL) and registry
src/content/             ← case metadata (zod) + MDX bodies
tests/                   ← Playwright e2e, a11y, visual
scripts/                 ← token build, story coverage, JS budget
```
