# 004 — MDX in the repo for case studies

**Status:** Accepted · 2026-10-02

**Decision.** Case metadata in `src/content/cases.ts` validated by zod; bodies in `src/content/cases/<slug>.mdx` (`@next/mdx`). MDX can embed `<GenerativeWork />` directly.

**Consequences.** Content goes through the same PRs and sensors as code; agents can write and edit cases. Non-technical editing needs GitHub; revisit a headless CMS if the team grows — keep the schema CMS-portable.
