# SEO and GEO

How the site presents itself to search engines and AI answer engines (ChatGPT, Claude, Perplexity, Google AI).

| What                                                    | Where                                                                                                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical origin                                        | `src/lib/seo.ts` → `siteUrl` (`NEXT_PUBLIC_SITE_URL`, else Vercel production domain)                                                         |
| Per-page title, description, canonical, OG/Twitter text | `pageMetadata()` in `src/lib/seo.ts`, called by every route                                                                                  |
| Social cards (1200×630)                                 | `opengraph-image.tsx` per route, rendered by `src/lib/og.tsx`                                                                                |
| Card photos                                             | `src/assets/og/bg/*.jpg`, built by `python3 scripts/build-og-assets.py` (next/og cannot read WebP)                                           |
| Card fonts                                              | `src/assets/og/*.ttf` (static instances of the site fonts)                                                                                   |
| Structured data (schema.org JSON-LD)                    | `src/lib/json-ld.tsx`: Organization + WebSite (layout), FAQPage (home, solutions), Service (solutions), CreativeWork (cases), BreadcrumbList |
| Sitemap / robots                                        | `src/app/sitemap.ts`, `src/app/robots.ts` (AI crawlers explicitly allowed)                                                                   |
| AI-readable summary                                     | `/llms.txt` (map) and `/llms-full.txt` (full text), built from content in `src/lib/llms.ts`                                                  |

Rules

- Placeholder cases (`client` starts with "Placeholder") are `noindex` and stay out of the sitemap,
  llms.txt and ItemList JSON-LD, so invented clients are never presented as real work.
- Next replaces nested metadata objects instead of merging them: always go through `pageMetadata()`.
- After changing a page photo that a card uses, re-run `scripts/build-og-assets.py`.
- `tests/e2e/seo.spec.ts` checks robots, sitemap, llms.txt, canonicals, OG images and JSON-LD.

To do when a custom domain is live: set `NEXT_PUBLIC_SITE_URL`, submit the sitemap in Google
Search Console and Bing Webmaster Tools.
