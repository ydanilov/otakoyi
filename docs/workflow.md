# Harness workflow

> Agent = Model + Harness. The harness is everything around the agent that makes good work the
> default: the repo as system of record, rules it reads before acting, and sensors that tell it —
> mechanically, fast — when it went wrong.

## The four layers

| Layer                     | Purpose                               | In this repo                                                                                                                                                              |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Guides** (feed-forward) | What the agent knows before it starts | `AGENTS.md`, `docs/`, `tokens/tokens.json`, Storybook docs (also exposed via `@storybook/addon-mcp`), Figma via MCP, Mobbin via MCP                                       |
| **Sensors** (feedback)    | What tells the agent it is wrong      | `tsc`, ESLint harness rules, Prettier, `tokens:check`, `check:stories`, Vitest unit, Storybook play + a11y, Playwright e2e + axe + visual, `check:budget`, Vercel preview |
| **Constraints**           | What the agent may not do             | Branch protection on `main`, PR-only, design-system-only imports, tokens-only colors, WebGL quarantine                                                                    |
| **Garbage collection**    | Keeping entropy down                  | Weekly sweep (below)                                                                                                                                                      |

## Sources of truth

```
Mobbin  ──references──▶  docs/research/
Figma Variables  ◀──mirror──▶  tokens/tokens.json  ──pnpm tokens──▶  CSS vars + TS
Figma Variables ──tokens:figma:pull──▶  tokens/figma.json  ──tokens:figma:check──▶  tokens.json
Figma components ◀──Code Connect (figma/*.figma.ts)──▶  src/components/ui + sections
Code (git) is the final truth. Storybook is the living contract for every component.
```

## Loop per task

1. **Brief** — GitHub issue with acceptance criteria (template: _Task_). 🧑 checkpoint
2. **Reference** — 3–5 Mobbin references, what we take from each → `docs/research/<topic>.md`. 🧑 checkpoint on direction
3. **Design** — Figma frame in "Draft", built only from library components and Variables.
4. **Build** — agent reads the frame via Figma MCP, composes from `ui/` + `sections/`.
5. **Story** — every new/changed component: states (default, hover, empty, loading, mobile) + `play` tests.
6. **Local sensors** — `pnpm verify` (fast) → `pnpm verify:full`.
7. **Git** — branch `feat/<slug>`, conventional commits, PR with template.
8. **CI + Vercel** — GitHub Actions runs every sensor; Vercel builds a preview for the PR.
9. **Review** — compare preview with Figma; merge. 🧑 checkpoint
10. **Release** — `main` auto-deploys to production on Vercel. 🧑 checkpoint

## Sensors — what runs where

| Sensor                                       | Command                   | Local | CI         |
| -------------------------------------------- | ------------------------- | ----- | ---------- |
| Tokens in sync                               | `pnpm tokens:check`       | ✓     | ✓          |
| Tokens match Figma (snapshot)                | `pnpm tokens:figma:check` | ✓     | ✓          |
| Code Connect templates parse                 | `pnpm figma:check`        | ✓     | ✓          |
| Lint + harness rules                         | `pnpm lint`               | ✓     | ✓          |
| Format                                       | `pnpm format:check`       | ✓     | ✓          |
| Types (incl. route types)                    | `pnpm typecheck`          | ✓     | ✓          |
| Story coverage                               | `pnpm check:stories`      | ✓     | ✓          |
| Content + token contracts                    | `pnpm test`               | ✓     | ✓          |
| Storybook interactions + a11y                | `pnpm test:stories`       | ✓     | ✓          |
| Build                                        | `pnpm build`              | ✓     | ✓          |
| JS budget, lazy three.js                     | `pnpm check:budget`       | ✓     | ✓          |
| E2E + axe (3 viewports)                      | `pnpm test:e2e`           | ✓     | ✓          |
| Visual regression (3 viewports × dark/light) | `pnpm test:visual`        | —     | ✓ (Docker) |

Visual baselines are environment-specific. They are created and updated **only** by the
"Update visual baselines" workflow (manual, human-triggered), which commits them to the branch.

## Garbage collection (weekly)

- Figma ↔ code drift: the `Figma token sync` workflow pulls Figma every Monday and opens a PR on change; `scripts/code-connect.test.ts` catches components without Code Connect.
- Unused components / stories, unused tokens.
- Outdated dependencies (shadcn upstream diffs in `src/components/ui`).
- Stale ADRs and research notes.

Output: a single PR titled `chore: weekly sweep` with findings; nothing is deleted without approval.
