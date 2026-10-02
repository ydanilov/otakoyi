# 003 — React Three Fiber + GLSL for generative works

**Status:** Accepted · 2026-10-02

**Decision.** Generative works are fragment shaders rendered by R3F. Every work goes through one component with a fixed contract:

```tsx
<GenerativeWork work="signal-field" seed={7} palette="dark" density={0.35} animate />
```

- Colors come from token palette `gen-1..gen-4` (`tokens.json → tokens.generated.ts`).
- three.js is lazy-loaded (`next/dynamic`, `ssr: false`) and only mounts when the work scrolls into view; offscreen works pause.
- Fallbacks: CSS poster until ready / without WebGL; `prefers-reduced-motion` freezes time.
- New work = shader in `shaders.ts` + entry in `registry.ts` + story.

**Consequences.** Strong visuals and one engine for site, Storybook and tests. Performance must be guarded (JS budget sensor; TODO: FPS sensor).
