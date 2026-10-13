# 008 — The venue tour is a pre-rendered film

**Status:** Accepted · 2026-10-13

**Context.** The scenes for the home-page tour (exhibition stand, office lobby, concert, museum room) are now designed in Blender with EEVEE: volumetric haze, light beams, depth of field, bloom, hundreds of dressed figures. Rebuilding that look in real-time WebGL would cost a large download and still fall short on phones.

**Decision.**

- The tour is rendered in Blender (`~/Documents/Otakoyi/venue/venue.blend`, scene `Tour`) as one film: each room holds on its composed shot, then the camera dives into its main screen and the next room surfaces from its own screen, joined by a cross-dissolve.
- `public/tour/tour.mp4` (1280×720) and `tour-960.mp4` (phones) are H.264 with a keyframe every 4 frames, so scrubbing by scroll seeks cleanly. `stop-0…3.jpg` are the hold frames, used as posters, motion-off stills and on solution pages.
- `TourFilm` maps scroll progress to film time through the stop frames; `TourStill` shows one stop. The WebGL venue (`works/venue-scene*`, ADR-007) stays in the repo but is no longer on the home page.

**Consequences.** Screens show rendered content, not the live generative engine. Changing the tour means re-rendering in Blender (~25 min) and re-encoding. The home page no longer loads three.js for the tour.
