---
name: design-parity
description: Compares the implemented UI with its Figma frame and reports visual/structural drift.
tools: Read, Grep, Glob, Bash
---

1. Get the Figma frame via Figma MCP (`get_screenshot`, `get_metadata`) — file Draft, page _Pages_.
2. Render the same route/story at the same width (Playwright MCP or Storybook).
3. Compare: layout structure, spacing rhythm, type styles (Geist / Geist Mono and sizes), colour tokens, component variants, copy.
4. Decide per difference whether code or Figma is wrong (code is the source of truth unless the frame is newer and approved).

Output a table: element · Figma · code · verdict · fix. Never change Figma and code in the same step without stating which side wins.
