# 010 — Figma ↔ code contract: token snapshot sensor + Code Connect

**Status:** Accepted · 2026-10-16 · completes the "planned" parts of ADR-005 and docs/figma.md

**Context.** Tokens and components exist twice: Figma Variables / library components in the
Figma file, and `tokens/tokens.json` / `src/components` in code. Nothing checked that the two
stayed the same, so drift was only caught by eye. Two platform limits shape the solution:
the Figma Variables REST API is Enterprise-only, and Code Connect publishing needs a plan with
Dev Mode + Code Connect. The studio's Figma is on Pro.

> Amended 2026-10-17: Code Connect publishing works on Professional with a Full seat (one
> framework); it is not limited to Organization or Enterprise. Only the publishing token is missing.

**Decision.**

- **Tokens.** Every Theme variable is bound to a swatch on the Figma _Tokens_ page (one mode
  frame per mode, swatch named `<group>/<token>`). `pnpm tokens:figma:pull` reads those frames
  through the REST _nodes_ endpoint, which works on any plan and returns the bound, resolved value
  per mode, and writes `tokens/figma.json` (hex, alpha, variable id). `pnpm tokens:figma:check`
  compares that snapshot with `tokens.json` (CIEDE2000 ΔE ≤ 1, alpha ±0.02) and runs offline in
  `pnpm verify` and CI. The weekly `Figma token sync` workflow pulls with the
  `FIGMA_ACCESS_TOKEN` secret and opens a PR when Figma changed. `pnpm tokens:figma:plan` writes
  the variable updates that bring Figma in line with code; they are applied through the Figma
  plugin bridge (Figma Console MCP), not the REST API.
- **Components.** `figma/components.json` lists every Figma library component as `connected`
  (has a Code Connect template in `figma/*.figma.ts`) or `inline` (a Figma-only part rendered
  inside a section). `scripts/code-connect.test.ts` fails on a missing template, a wrong node,
  an orphan template, or an import that does not exist in code. `pnpm figma:check` parses all
  templates in CI. The `Publish Code Connect` workflow publishes on `main` once the token and plan
  allow it; until then templates are validated but not published.

**Consequences.** Drift in either direction fails a sensor with a message that names the token
and the fix. Code is still the final truth (ADR-005): when Figma changes, the sync PR shows the
diff and the author updates `tokens.json`. Renaming a swatch frame in Figma breaks the pull —
the frame names are part of the contract. Revisit the swatch approach if the file moves to an
Enterprise plan (read `/variables/local` directly).
