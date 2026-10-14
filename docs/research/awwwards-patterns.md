# Awwwards patterns for the home page

## Question

Which current Awwwards patterns (Sites of the Day / nominees, Oct 2026) make the site feel like a studio that builds installations people stop for — without breaking the harness (JS budget, determinism, a11y, tokens, WebGL quarantine)?

Current state: clean and on-brief, but every section is a static card grid. Nothing on the page behaves like an installation.

## References

| #   | Site                                                    | Award   | Pattern                                                                                                          | What we take                                                                                      | What we avoid                                                    |
| --- | ------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | [Studio Mirage](https://studiomirage.io/)               | Nominee | Fullscreen scroll reel of projects; shader distortion between projects; prev/next names in corners; "Visit" pill | Fullscreen installation reel with a shader transition; corner prev/next; one CTA pill per work    | Intro loader; text-less scroll that hides the business value     |
| 2   | [metic.](https://metic.studio/en)                       | Nominee | Pinned "The build" story: 8 steps, big progress % counter, step 01/08, "Skip the build", ends in "Your turn" CTA | Pinned process section with progress counter, step index, skip link and a CTA as the last step    | Easter-egg hunt ("0/15 found") — fun, but off-message for buyers |
| 3   | [metic.](https://metic.studio/en)                       | Nominee | Hold-to-X-ray lens that shows what lies beneath the page                                                         | A lens over the brand demo: inside the lens the work renders in the client's palette              | Making a core message depend on discovering a hidden gesture     |
| 4   | [Collective Pixels](https://www.collective-pixels.com/) | Nominee | Variable-font axes morph per letter on the headline                                                              | Hero headline weight/width responds to the pointer — "it reacts to people" in one line of type    | Click-to-enter gate                                              |
| 5   | [AUGE Experience](https://auge-xp.com/)                 | Nominee | Glyph-scramble word cycling under a heavy wordmark                                                               | Scramble-in for section eyebrows / the format list (Conferences → Events → Offices → Exhibitions) | Full-screen splash before content                                |
| 6   | [Riotters — Lidar Drone](https://drone.riotters.com/)   | SOTD    | Giant outline wordmark behind the hero object; live local clock in header; tech-demo framing                     | Outline wordmark / big number behind hero work; a "live" status chip ("Running at 3 venues")      | Loader counter                                                   |
| 7   | [Preymaker](https://preymaker.com/)                     | Nominee | Branded loader with % before entry                                                                               | —                                                                                                 | Loaders: cost first impression and LCP for no business gain      |

Common thread in this month's winners: **one big, reactive object per screen**, **scroll as the timeline**, **mono micro-labels with counters**, very little card chrome.

## Recommendation

Apply 1 + 2 + 4 first (biggest effect, all fit the existing `GenerativeWork` contract): a fullscreen installations reel, a pinned "brief → opening night" process with a progress counter that ends on `Get a proposal`, and a pointer-reactive hero headline. Lens (3) and scramble (5) are cheap follow-ups. Skip loaders (7).

Implementation guardrails: CSS scroll-driven animations + IntersectionObserver instead of GSAP (budget ≤ 230 KB); shader transition is a new uniform in `works/`; everything static under `prefers-reduced-motion` so visual tests stay deterministic; reel and process must stay keyboard-navigable and readable by screen readers.
