---
description: Garbage collection — find drift and dead weight, propose a cleanup PR
---

1. `pnpm check:deadcode` — unused files, exports, dependencies.
2. Figma ↔ code drift: compare Figma Variables (collection _Theme_) with `tokens/tokens.json` via Figma MCP; list mismatches.
3. Components without a Figma counterpart, and Figma components without code (see `docs/figma.md`).
4. `pnpm outdated` — note majors separately; never bump majors in a sweep.
5. Stale docs: ADRs or research notes that contradict the code.

Output one PR `chore(harness): weekly sweep` with safe fixes, and list everything that needs a human decision in the PR body. Delete nothing without approval.
