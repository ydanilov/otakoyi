# Design system — offline copy

A snapshot of the Figma design system, kept next to the code so agents and reviewers can see it
without Figma access. Figma stays the place where design changes; code (`tokens/tokens.json`,
`src/components/ui`) stays the source of truth for what ships.

- **Figma file:** [otakoyi](https://www.figma.com/design/IS3HHVFfnJ6b4BC8jf9TNS/otakoyi)
  (owner: yura.danilov.official@gmail.com)
- **Tokens:** `tokens/tokens.json` → `pnpm tokens`; Figma side: `tokens/figma.json`
  (`pnpm tokens:figma:pull` / `tokens:figma:check`)
- **Components:** shadcn/ui primitives in `src/components/ui`, sections in
  `src/components/sections`; Figma ↔ code map in `figma/components.json` (Code Connect)

| File                | What it shows                                                |
| ------------------- | ------------------------------------------------------------ |
| `tokens-dark.webp`  | Theme variables, Dark mode (Figma _Tokens_ page, frame 5:41) |
| `tokens-light.webp` | Theme variables, Light mode (frame 5:116)                    |
| `components.webp`   | Component library (Figma _Components_ page, section 9:85)    |

Refresh after a Figma change: export the frames above at 1× (Figma → Export, or the Figma
Console MCP `figma_get_component_image`) and replace the files.
