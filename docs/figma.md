# Figma ↔ code

File: **otakoyi** — https://www.figma.com/design/IS3HHVFfnJ6b4BC8jf9TNS/otakoyi

| Figma page | Purpose                                                                                 | Code counterpart                  |
| ---------- | --------------------------------------------------------------------------------------- | --------------------------------- |
| Tokens     | Variables collection _Theme_ (modes Dark / Light)                                       | `tokens/tokens.json`              |
| shadcn/ui  | The shadcn primitives the site uses, 1:1 with the source, bound to Theme variables      | `src/components/ui`               |
| Components | Site building blocks (header, footer, CTA, icons…) and _Sections_ built from primitives | `src/components/sections`, `site` |
| Pages      | Every live route, desktop 1440 + mobile 390, built from library instances               | `src/app/**/page.tsx`             |

Node IDs: token frames 5:41 / 5:116; components are listed in `figma/components.json`.

**shadcn/ui page.** Button (all variants + `signal`), Badge, Toggle (ToggleGroupItem), Label, Input,
Textarea, Slider, Separator, Accordion, Card, Dialog and Sheet, drawn from the classes in
`src/components/ui` (new-york) and bound to the Theme variables, so our tokens are the shadcn theme.
Section components on the Components page are composed from instances of these primitives, never
from detached copies. A new primitive is copied from shadcn into code first, then drawn here.

**Pages page.** Section _Pages — editable_ holds one frame per route and breakpoint, named
`<Page> — Desktop 1440` / `<Page> — Mobile 390`, grouped into sub-sections: _01 · Core pages_ (Home,
Installations, Solutions, Studio), _02 · Cases — /works/[slug]_, _03 · Solutions — /solutions/[slug]_ and
_04 · Control app_ (`/control` plus the control-app additions to /studio and /solutions).
Desktop and mobile of one page sit side by side. Every frame is an auto-layout stack of instances of
the library (`SiteHeader`, `Hero`, `SectionHeading`, `WorkCard`, `Faq`, `Cta`, `SiteFooter`…) with the
production copy and images, so a layout is edited by changing instance properties, not pixels. Section
components with a responsive layout are component sets with a `breakpoint` variant (`desktop` | `mobile`).
Scroll-driven sections are drawn once, in their pinned state. Pages of one type are instances of one
page template on the Components page (_Page templates_): `CasePage` for `/works/[slug]` and
`SolutionPage` for `/solutions/[slug]`, each with a `breakpoint` variant. Edit the layout in the
template; each page only overrides content and hides the optional parts it does not use.
`SiteHeader` has `state=sticky` (the fixed bar) and `state=in-hero` (draft: before scrolling the bar
is part of the hero, without background or border, and sticks once it reaches the top).

Rules:

- Variable names = token names (`background`, `muted-foreground`, `signal`, `gen-1`…).
- Naming follows shadcn/ui and the code, not Figma habits:
  - **Components** are named like their React export (`Button`, `AccordionItem`, `DialogContent`,
    `StopCopy`). Parts without their own export use shadcn's Parent+Part style
    (`TechnologyBentoItem`, `WorksGridFilter`, `CaseQuickFact`); icon and mark sets use a slash
    group (`Icon/arrow-right`, `LogoMark/Lumen`).
  - **Layers** inside a primitive carry the shadcn slot names (`CardHeader`, `CardTitle`,
    `AccordionTrigger`, `DialogFooter`, `SheetDescription`).
  - **Properties** are the React prop names in camelCase: `variant`, `size`, `orientation`,
    `children` for slotted text, `title`/`description` etc. for named props, `showX` for optional
    parts, `icon` for instance swaps. Values are the code values (`outline`, `icon-sm`,
    `signal-field`).
  - **`state`** mirrors Radix `data-state` (`open`/`closed`, `on`/`off`) or, for fields, the CSS
    state being shown (`default`, `focus`, `invalid`, `disabled`). Code Connect ignores it.
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
