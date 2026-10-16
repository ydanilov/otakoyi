type SocialLink = { label: "Instagram" | "LinkedIn" | "Vimeo"; href: string | null }

/** Studio profiles. A link shows in the footer (and in structured data) only once it has a real URL. */
const social: SocialLink[] = [
  { label: "Instagram", href: null },
  { label: "LinkedIn", href: null },
  { label: "Vimeo", href: null },
]

/**
 * Absolute origin for canonical URLs, sitemap, Open Graph and structured data.
 * `NEXT_PUBLIC_SITE_URL` wins; otherwise Vercel's production domain (it switches to the custom
 * domain on its own once one is attached), then localhost.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
)

/** Only the production deployment may be indexed; previews and local builds stay out of search. */
export const indexable = process.env.VERCEL_ENV === "production"

export const site = {
  name: "Otakoyi",
  tagline: "Generative installations for conferences, events, offices and exhibitions",
  description:
    "We design, build and install generative visual installations that stop people in their tracks — customised to your brand, driven by your data, delivered turnkey",
  email: "hello@otakoyi.team",
  cta: { label: "Get a proposal", subject: "Installation proposal" },
  nav: [
    { href: "/works", label: "Installations" },
    { href: "/solutions", label: "Solutions" },
    { href: "/studio", label: "Studio" },
  ],
  social,
} as const

/** Every "Get a proposal" link points here; `ProposalDialog` (mounted in the layout) opens on it. */
export const proposalHref = "#proposal"

export const proposalMailto = `mailto:${site.email}?subject=${encodeURIComponent(site.cta.subject)}`

/**
 * Google Form "Otakoyi — Get a proposal" (owner's Drive) that receives proposals; answers land in
 * its Responses tab. `action` is the form's `…/formResponse` URL; `entries`
 * maps each field to its `entry.<id>`. While `action` is empty the dialog falls back to a
 * pre-filled email.
 */
export const proposalForm = {
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSc1pLS-rDA0LYqPFHl6QVqXfo4RR1kYM5caOl41Lcucz1yF_w/formResponse",
  entries: {
    name: "entry.788382960",
    email: "entry.1554585824",
    company: "entry.1927853941",
    event: "entry.762845243",
    date: "entry.101883593",
    budget: "entry.443381102",
    message: "entry.195374643",
  },
} as const
