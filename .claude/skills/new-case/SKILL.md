---
name: new-case
description: Add a new installation case study (metadata + MDX + verification). Use when the user provides a new project to showcase.
---

1. Collect from the user: title, client (or "Confidential"), year, location/venue, formats, what was customised for the brand, **verified** results (value + label), hero work + seed. Never invent results — leave a TODO and ask.
2. Add an entry to `src/content/cases.ts` (zod validates it).
3. Create `src/content/cases/<slug>.mdx` with sections: The challenge · The installation · Built around their brand · What it delivered. Embed `<GenerativeWork />` where useful.
4. Copy rules: `docs/brief.md` — business outcome first, concrete numbers, short sentences.
5. `pnpm test` (content contract), `pnpm build`, `pnpm test:layout -g case-<slug>`.
6. Visual baselines will change — note it in the PR; a human runs the baseline workflow.
