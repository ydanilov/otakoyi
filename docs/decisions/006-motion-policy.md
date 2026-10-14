# 006 — Motion on for everyone, with a site toggle

**Status:** Accepted · 2026-10-12 · supersedes the reduced-motion parts of 002 and 003

**Context.** The site gated every animation, scroll scene and live work on `prefers-reduced-motion`. Many Windows machines report `reduce` because system animation effects are off (common on corporate laptops — our buyers), so they saw a static site. The owner decided the full experience is the default for all visitors.

**Decision.**

- The OS `prefers-reduced-motion` setting is not used. Motion is on by default.
- A header toggle (`MotionToggle`, Pause/Play) turns all motion off: `<html data-motion="off">`, persisted in `localStorage("motion")`, applied before paint by `motionScript` (`@/lib/init-scripts`). This keeps WCAG 2.2.2 (pause/stop/hide).
- Code reads the flag via `useMotion()` / `isMotionOn()` from `@/lib/motion`; Tailwind variants `motion-off:` / `motion-on:` replace `motion-reduce:` / `motion-safe:`.
- Visual and e2e tests run with motion off (Playwright `storageState` sets `motion=off`), which freezes every generative work at its fixed time — determinism from 002 is unchanged, only the switch moved.

**Consequences.** Visitors who rely on reduced motion must use the toggle once. The toggle must stay visible on every viewport. Revisit if analytics or feedback show motion sickness complaints.

## Update (2026-10-14)

The header toggle was removed at the owner's request. `data-motion="off"` and the stored
`localStorage("motion")` value still work (visual tests rely on them); there is just no UI for it.
