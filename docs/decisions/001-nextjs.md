# 001 — Next.js App Router

**Status:** Accepted · 2026-10-02

**Context.** Portfolio with SEO-relevant case pages, hosted on Vercel, React + shadcn + Storybook.

**Decision.** Next.js 16 App Router. Case pages are statically generated (`generateStaticParams`, `dynamicParams = false`). Storybook uses `@storybook/nextjs-vite`.

**Consequences.** Best Vercel integration (previews, image optimisation). Next 16 has breaking changes vs. older docs — agents must read `node_modules/next/dist/docs/` (see AGENTS.md).
