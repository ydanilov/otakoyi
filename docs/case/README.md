# Case screenshots

Screenshots for the design-engineering case: from the Figma library to production. Captured on 2026-10-21.

The site is a draft: the studio is just launching, so cases and figures on the site are placeholders.

## Production site

[Live site](https://studio-portfolio-navy.vercel.app)

| Desktop                                    | Mobile                                   |
| ------------------------------------------ | ---------------------------------------- |
| ![Home, desktop](01-site-home-desktop.png) | ![Home, mobile](02-site-home-mobile.png) |

## Figma: tokens → components → sections → pages

[Figma file](https://www.figma.com/design/IS3HHVFfnJ6b4BC8jf9TNS/otakoyi)

**Tokens.** The same variables as [`tokens/tokens.json`](../../tokens/tokens.json).

![Figma tokens](03-figma-tokens.png)

**Components.** shadcn/ui primitives bound to the token variables, 1:1 with [`src/components/ui`](../../src/components/ui).

![Figma components](04-figma-components.png)

**Sections.** Site blocks built from component instances.

![Figma sections](05-figma-sections.png)

**Pages.** Every route, desktop and mobile, built from sections.

![Figma pages](06-figma-pages.png)

## Storybook: every component, every state, accessibility checked

[Storybook](https://studio-portfolio-storybook.vercel.app)

![Storybook with the accessibility panel](07-storybook-a11y.png)

## The checks that keep the agent inside the system

A throwaway component that breaks the rules, and what the checks answer. Every message says how to fix the problem.
Rules: [`AGENTS.md`](../../AGENTS.md) · lint rules: [`eslint.config.mjs`](../../eslint.config.mjs).

![Check error messages](08-check-error-message.png)

## CI on every change

[CI workflow](../../.github/workflows/ci.yml)

![Green CI run](09-github-ci-green.png)

## Lighthouse

![Lighthouse accessibility 100](10-lighthouse-accessibility.png)
