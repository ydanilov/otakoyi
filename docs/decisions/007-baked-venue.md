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

**Update 2026-10-12 — visitors and four stops.** The tour now covers exhibitions → offices → music events → museums. Walking capsules were replaced by standing visitors built in `scripts/blender/people.py`: MakeHuman bodies (CC0 assets, generated with MPFB 2 as a build tool) posed from Mixamo-rigged characters in the three.js examples, exported as one mesh (`public/models/people.glb`) and rendered as glossy oil-black sculpture. Their shadows are part of the bake.

**Update 2026-10-12 — arc layout and shot-based camera.** The four rooms no longer sit in a row: each is modelled around its own origin and placed on an arc around an empty, dark floor, turned to face its centre (`ZONES` in `build-venue.py`, written to `venue-people.json`). The camera is no longer one spline: each stop is a composed shot in its room's coordinates (subject on the right third, copy panel on the left, lens per room), and each move between stops has its own character — crane out and sweep, low tracking shot, rise over the stage — with a hold at every stop, eased flight, a lens that widens in flight and a slight bank into the turn. All visitors share one lean-back pose (`people._lean_dirs`).

**Update 2026-10-13 — floating platforms.** The arc became a zigzag of floating platforms stepping down through a dark void (stand → lobby → stage → museum), each room on its own slab with a light line on the front edge; platform tops share one floor bake. Visitors are satin rather than glossy, and get runtime contact shadows (one instanced, alpha-mapped ellipse each, from foot and lean data in `venue-people.json`), because most of them stand on live screens the bake can't darken.
