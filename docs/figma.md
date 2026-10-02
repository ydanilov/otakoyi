# Figma ↔ code

File: **Draft** — https://www.figma.com/design/7fyYBxvBHHEK4IKO6ZTkXN/Draft

| Figma page | Purpose                                                                | Code counterpart                        |
| ---------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Tokens     | Variables collection _Theme_ (modes Dark / Light)                      | `tokens/tokens.json`                    |
| Components | Button, Badge, Card, ToggleGroup, Accordion, Header, Footer, WorkCard… | `src/components/ui`, `sections`, `site` |
| Pages      | Home, Works, Case study, Studio (desktop 1440 + mobile 390)            | `src/app/**/page.tsx`                   |

Rules:

- Variable names = token names (`background`, `muted-foreground`, `signal`, `gen-1`…).
- Component names = React component names; variant props = React prop names.
- Generative imagery in Figma is a placeholder fill (screenshots of `GenerativeWork` at a fixed seed); the real thing lives in code.
- Code Connect mapping is planned once the library stabilises (`figma-code-connect`).
