# 007 — Blender-built venue with baked lighting

**Status:** Accepted · 2026-10-12

**Context.** The 3D venue tour was built from primitives in code and read as a prototype: flat light, no shadows, no scale.

**Decision.**

- The venue is modelled by a reproducible script, `scripts/blender/build-venue.py`, run with Blender as a Python module (`pip install bpy`) — no manual Blender session.
- Lighting (screens, LED strips, area lights, bounce) is baked with Cycles into two textures (`public/models/venue-bake.jpg`, `floor-bake.jpg`); the site renders them unlit, so it looks path-traced at the cost of a texture lookup.
- Screens stay separate meshes (`Screen_*`) and get the live generative shaders at runtime; their average colour is baked as glow.
- The GLB is meshopt-compressed with `@gltf-transform/cli` (decoder from three's examples, inside the lazy chunk).
- Runtime adds walking mannequins (instanced), visitor ripples on the interactive floor, bloom / grain / vignette, and quality tiers via `PerformanceMonitor`.

**Consequences.** Changing the venue means editing the script and re-baking (~5 min on 2 CPU cores). Assets add ~0.9 MB, loaded only when the tour scrolls into view.
