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
  social: [
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://linkedin.com", label: "LinkedIn" },
    { href: "https://vimeo.com", label: "Vimeo" },
  ],
} as const

/** Every "Get a proposal" link points here; `ProposalDialog` (mounted in the layout) opens on it. */
export const proposalHref = "#proposal"

export const proposalMailto = `mailto:${site.email}?subject=${encodeURIComponent(site.cta.subject)}`

/**
 * Google Form that receives proposals. `action` is the form's `…/formResponse` URL; `entries`
 * maps each field to its `entry.<id>`. While `action` is empty the dialog falls back to a
 * pre-filled email.
 */
export const proposalForm = {
  action: "",
  entries: {
    name: "",
    email: "",
    company: "",
    event: "",
    date: "",
    budget: "",
    message: "",
  },
} as const
