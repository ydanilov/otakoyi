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

Two loops. Pick by what the change touches, not by its size in lines.

**Light loop** — copy, content, fixes and changes to existing components inside their current
design (no new section, no new pattern, no new token):

1. **Ask** — the owner's message is the brief; ambiguous → ask.
2. **Build** on `fix/<slug>` / `copy/<slug>`, story updated if a component changed.
3. **Sensors** — `pnpm verify`, then `pnpm verify:full` before the PR.
4. **PR → CI green → merge** (standing approval, see AGENTS.md › Merging). `main` deploys.

**Full loop** — a new section, page, pattern, component or token:

1. **Brief** — GitHub issue with acceptance criteria (template: _Task_). 🧑 checkpoint
2. **Reference** — 3–5 Mobbin references, what we take from each → `docs/research/<topic>.md`. 🧑 checkpoint on direction
3. **Design** — Figma frame in "otakoyi", built only from library components and Variables.
4. **Build** — agent reads the frame via Figma MCP, composes from `ui/` + `sections/`.
5. **Story** — every new/changed component: states (default, hover, empty, loading, mobile) + `play` tests.
6. **Local sensors** — `pnpm verify` (fast) → `pnpm verify:full`.
7. **Git** — branch `feat/<slug>`, conventional commits, PR with template.
8. **CI + Vercel** — GitHub Actions runs every sensor; Vercel builds a preview for the PR.
9. **Review** — compare preview with Figma. 🧑 checkpoint on the preview, then merge once CI is green.
10. **Release** — `main` auto-deploys to production on Vercel.

## Sensors — what runs where

| Sensor                          | Command                   | Local | CI         |
| ------------------------------- | ------------------------- | ----- | ---------- |
| Tokens in sync                  | `pnpm tokens:check`       | ✓     | ✓          |
| Tokens match Figma (snapshot)   | `pnpm tokens:figma:check` | ✓     | ✓          |
| Code Connect templates parse    | `pnpm figma:check`        | ✓     | ✓          |
| Lint + harness rules            | `pnpm lint`               | ✓     | ✓          |
| Format                          | `pnpm format:check`       | ✓     | ✓          |
| Types (incl. route types)       | `pnpm typecheck`          | ✓     | ✓          |
| Story coverage (rendered)       | `pnpm check:stories`      | ✓     | ✓          |
| Content + token contracts       | `pnpm test`               | ✓     | ✓          |
| Storybook interactions + a11y   | `pnpm test:stories`       | ✓     | ✓          |
| Build                           | `pnpm build`              | ✓     | ✓          |
| JS budget, lazy three.js        | `pnpm check:budget`       | ✓     | ✓          |
| E2E + axe (3 viewports)         | `pnpm test:e2e`           | ✓     | ✓          |
| Visual regression (3 viewports) | `pnpm test:visual`        | —     | ✓ (Docker) |
| Lighthouse (perf, LCP, CLS)     | `lighthouserc.json`       | —     | ✓          |

Visual baselines are environment-specific. They are created and updated **only** by the
"Update visual baselines" workflow (manual, human-triggered), which commits them to the branch.

## Garbage collection (weekly)

Every Monday, two workflows:

- **`Figma token sync`** pulls the Figma Variables and opens a PR when they changed;
  `scripts/code-connect.test.ts` catches components without Code Connect. Needs the
  `FIGMA_ACCESS_TOKEN` secret — without it the job only warns and checks nothing.
- **`Weekly sweep`** (`.github/workflows/sweep.yml`): unused files, exports and dependencies
  (`knip`, config in `knip.json`), unused tokens (`scripts/check-unused-tokens.mjs`) and outdated
  packages. Output: one open issue labelled `sweep`, updated each week.

By hand when the sweep issue is reviewed: shadcn upstream diffs in `src/components/ui`, stale
ADRs and research notes. Nothing is deleted without approval.
