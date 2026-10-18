# 008 — The venue tour is a pre-rendered film

**Status:** Superseded by ADR-009 · 2026-10-13

**Context.** The scenes for the home-page tour (exhibition stand, office lobby, concert, museum room) are now designed in Blender with EEVEE: volumetric haze, light beams, depth of field, bloom, hundreds of dressed figures. Rebuilding that look in real-time WebGL would cost a large download and still fall short on phones.

**Decision.**

- The tour is rendered in Blender (`~/Documents/Otakoyi/venue/venue.blend`, scene `Tour`) as one film: each room holds on its composed shot, then the camera dives into its main screen and the next room surfaces from its own screen, joined by a cross-dissolve.
- `public/tour/tour.mp4` (1280×720) and `tour-960.mp4` (phones) are H.264 with a keyframe every 4 frames, so scrubbing by scroll seeks cleanly. `stop-0…3.jpg` are the hold frames, used as posters, motion-off stills and on solution pages.
- `TourFilm` maps scroll progress to film time through the stop frames; `TourStill` shows one stop. The WebGL venue (`works/venue-scene*`, ADR-007) stays in the repo but is no longer on the home page.

**Consequences.** Screens show rendered content, not the live generative engine. Changing the tour means re-rendering in Blender (~25 min) and re-encoding. The home page no longer loads three.js for the tour.

## Update 2026-10-13 — timecoded scenes

- The film is cut into scenes with timecodes (`TOUR.scenes`, film frames). Scroll is split into equal parts, one per scene. Inside a scene, scroll scrubs the film and can stop on any frame.
- Transitions are never scrubbed. When scroll crosses into another scene, the film plays the transition through on its own, forward or backward, and the stop card changes when it lands. Skipping several scenes plays them one after another, faster (≤ 2.6 s total).
- Each scene is 196 frames: 20 inside the screen, a 30-frame pull-out, a ~96-frame animated hold (the scrubbed part; timecodes [1,146] [226,322] [402,498] [578,724]), a 30-frame dive, then 20 inside the next screen. During the dive the camera ends fully inside the screen, a compositor blur ramps up, and a 20-frame gamma cross blends the two blurred screens. No room edges are visible mid-blend.
- The concert hold is animated (crowd on the beat, moving heads, the DJ's arm via shape keys, denser fog). All cycles divide 96 frames.
- The concert has no lasers (tried twice, rejected). EEVEE motion blur is on for all scenes, so the dives read as real camera moves.
