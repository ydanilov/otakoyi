# Architecture decision records

Short, numbered, immutable. To change a decision, add a new ADR that supersedes the old one.

| #                                     | Decision                                           | Status                                             |
| ------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| [001](001-nextjs.md)                  | Next.js App Router                                 | Accepted                                           |
| [002](002-playwright-visual-tests.md) | Playwright screenshots for visual regression       | Partly superseded by 006, partly superseded by 011 |
| [003](003-r3f-shaders.md)             | React Three Fiber + GLSL for generative works      | Partly superseded by 006, partly superseded by 011 |
| [004](004-mdx-content.md)             | MDX in the repo for case studies                   | Accepted                                           |
| [005](005-tokens-source-of-truth.md)  | `tokens/tokens.json` as token source of truth      | Partly superseded by 011                           |
| [006](006-motion-policy.md)           | Motion on for everyone, with a site toggle         | Accepted                                           |
| [007](007-baked-venue.md)             | Blender-built venue with baked lighting            | Accepted                                           |
| [008](008-tour-film.md)               | Venue tour as a pre-rendered film                  | Superseded by 009                                  |
| [009](009-venue-stills.md)            | Venue tour as stills with live screens (MVP)       | Accepted                                           |
| [010](010-figma-code-contract.md)     | Figma ↔ code contract: token sensor + Code Connect | Partly superseded by 011                           |
| [011](011-dark-only.md)               | Dark only: one theme, one value per token          | Accepted                                           |
