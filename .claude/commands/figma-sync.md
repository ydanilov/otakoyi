---
description: Sync tokens/components between code and the Figma Draft file
argument-hint: <tokens | components | page name>
---

Scope: $ARGUMENTS

- Tokens: read Figma Variables (Theme · Dark/Light) via Figma MCP, diff against `tokens/tokens.json`. Code wins unless the user says otherwise. Apply, run `pnpm tokens`, and update Figma variables to match.
- Components: for each component in `src/components/{ui,sections}`, check a same-named Figma component exists with matching variant props. Report gaps; build missing ones with the figma-generate-library skill.
- Pages: rebuild the named page frame from library instances (figma-generate-design skill).

Figma file: https://www.figma.com/design/7fyYBxvBHHEK4IKO6ZTkXN/Draft
