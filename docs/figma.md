# Figma ↔ code

File: **otakoyi** — https://www.figma.com/design/IS3HHVFfnJ6b4BC8jf9TNS/otakoyi

| Figma page | Purpose                                                                                 | Code counterpart                  |
| ---------- | --------------------------------------------------------------------------------------- | --------------------------------- |
| Tokens     | Variables collection _Theme_ (modes Dark / Light)                                       | `tokens/tokens.json`              |
| shadcn/ui  | The shadcn primitives the site uses, 1:1 with the source, bound to Theme variables      | `src/components/ui`               |
| Components | Site building blocks (header, footer, CTA, icons…) and _Sections_ built from primitives | `src/components/sections`, `site` |
| Pages      | Every live route, desktop 1440 + mobile 390 (captured from production)                  | `src/app/**/page.tsx`             |

The file "otakoyi" (account yura.danilov.official) replaced "Draft" on 2026-10-16. It is a recovered
copy, so node IDs are unchanged (token frames 5:41/5:116, components in `figma/components.json`).

**shadcn/ui page.** Button (all variants + `signal`), Badge, Toggle (ToggleGroupItem), Label, Input,
Textarea, Slider, Separator, Accordion, Card, Dialog and Sheet, drawn from the classes in
`src/components/ui` (new-york) and bound to the Theme variables, so our tokens are the shadcn theme.
Section components on the Components page are composed from instances of these primitives, never
from detached copies. A new primitive is copied from shadcn into code first, then drawn here.

**Pages page.** Section _Live site_ holds one frame per route and breakpoint, named
`<Page> — Desktop 1440` / `<Page> — Mobile 390`, filled with section-by-section captures of production
(scroll-driven sections are shown once, in their pinned state). They are a reference of what is live,
not editable layouts: rebuild a frame from library components before redesigning it. Older drafts sit in
the _Archive_ section.

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
