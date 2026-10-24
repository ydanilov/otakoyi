# 002 — Playwright screenshots for visual regression

**Status:** Accepted · 2026-10-02 · the determinism switch is superseded by ADR-006 (site motion off, not `reducedMotion`) · the dark/light matrix is superseded by ADR-011 (dark only)

**Decision.** Playwright `toHaveScreenshot` on every route × 3 viewports (desktop 1440, tablet 834, mobile Pixel 7) × dark/light. Baselines live in git under `tests/visual/__screenshots__/`.

**Determinism.** Tests run with site motion off (`data-motion="off"`, ADR-006; originally `reducedMotion: "reduce"`), which freezes every `GenerativeWork` at a fixed time; WebGL renders through SwiftShader; tests wait for `data-state="ready"` on each work.

**Consequences.** Free and fully under our control, no review UI. Baselines must be produced in the CI Docker image (`mcr.microsoft.com/playwright`) via the manual "Update visual baselines" workflow — never on a laptop. Revisit Chromatic if review UX becomes a bottleneck.
