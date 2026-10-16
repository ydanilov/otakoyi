# Figma ↔ code

File: **otakoyi** — https://www.figma.com/design/IS3HHVFfnJ6b4BC8jf9TNS/otakoyi

| Figma page | Purpose                                                                | Code counterpart                        |
| ---------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Tokens     | Variables collection _Theme_ (modes Dark / Light)                      | `tokens/tokens.json`                    |
| Components | Button, Badge, Card, ToggleGroup, Accordion, Header, Footer, WorkCard… | `src/components/ui`, `sections`, `site` |
| Pages      | Home, Works, Case study, Studio (desktop 1440 + mobile 390)            | `src/app/**/page.tsx`                   |

Rules:

- Variable names = token names (`background`, `muted-foreground`, `signal`, `gen-1`…).
- Component names = React component names; variant props = React prop names.
- Generative imagery in Figma is a placeholder fill (screenshots of `GenerativeWork` at a fixed seed); the real thing lives in code.
- Code Connect: every library component is listed in `figma/components.json`; connected ones have a
  template in `figma/<name>.figma.ts` (ADR-010). New Figma component → add a template (or mark it
  `inline`) or `pnpm test` fails.
- Token swatches on the _Tokens_ page are part of the contract: frames `Tokens — Dark` (5:41) and
  `Tokens — Light` (5:116) hold one swatch per token named `<group>/<token>`, filled with the bound
  Theme variable. `pnpm tokens:figma:pull` reads them; don't rename them.

## Sync loop

```
Figma Variables ──bound swatches──▶ tokens/figma.json ──tokens:figma:check──▶ tokens/tokens.json
       ▲                                                                          │
       └──────── tokens:figma:plan → Figma plugin bridge (MCP) ◀──────────────────┘
```

- Design changed in Figma → weekly `Figma token sync` PR (or `pnpm tokens:figma:pull` locally)
  → the check names the drifted tokens → update `tokens.json`, `pnpm tokens`.
- Code changed → `pnpm tokens:figma:plan` → apply `tokens/figma-push.json` with the Figma Console
  MCP (`figma_batch_update_variables`) → `pnpm tokens:figma:pull`.
