# 009 — Venue tour as stills with live screens (MVP)

**Status:** Accepted · 2026-10-14 · supersedes the film in ADR-008 for now

**Context.** The scroll-scrubbed film (ADR-008) and an AI re-render in Kling were both slow to iterate on: every change meant a 25-minute render, re-encoding and re-checking transitions, and the screens showed baked footage instead of our engine. The owner chose to ship an MVP: finished, fast to build, simple to change.

**Decision.**

- Each venue is one Blender still (`public/venues/scene-N.webp`, 1920×1080) at the old hold frame.
- A second layer (`scene-N-front.webp`) is the same still with the main screen cut out. Its alpha comes from a clean holdout render without haze. A live `GenerativeWork` sits between the two layers, warped onto the screen with a CSS `matrix3d` from the screen's corner points (`src/content/venues.ts`, projected in Blender). People standing in front of the screen stay in front.
- Screen palettes match each scene's light (`venuePalettes`, content, not tokens).
- Scroll is split into four equal parts and venues crossfade. With motion off only the stills render, with their baked screens.
- The film files and `tour-film.tsx` are removed. Blender scenes, Tour sequence and the Kling package stay in `~/Documents/Otakoyi/venue/` for a later film.

**Consequences.** The page loads ~420 KB of images instead of ~25 MB of video. The screens run the real engine. There is no camera move between venues. Re-rendering a venue means one still and one mask, plus new corners if the camera moved.

## Update 2026-10-14 — every screen live, one field per venue, cursor

- Every screen surface is live: stand wall, totems and floor; lobby wall; stage backdrop and side columns; museum walls and floor. All of them are cut out of the front layer. The stand's lit bezel is gone, and so is a lobby walker whose pose was broken.
- Each screen has a `domain`: its place in a field shared by the whole venue. Walls are unfolded around the room (floor toward the camera), so the museum reads as one 360° projection instead of separate planes (`uDomOn/uDomO/uDomU/uDomV` in the shader contract).
- The cursor bends the field (`uPointer`, `uPointerAmt`). The page maps it from screen space into field coordinates through the inverse of each screen's homography, so a swirl near a wall edge carries over onto the next wall.
- Only the venue on show mounts WebGL, so the page holds at most four canvases. Each canvas renders at about its on-screen size.
