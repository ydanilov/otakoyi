import { faqItems } from "@/components/sections/faq"
import { site } from "@/config/site"
import { getCases } from "@/content/cases"
import { solutions } from "@/content/solutions"
import { absoluteUrl } from "@/lib/seo"

export const dynamic = "force-static"

/**
 * /llms.txt (llmstxt.org): a plain-markdown brief of the studio for AI answer engines, built
 * from the same content as the pages so it never drifts.
 */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}.`,
    "",
    `${site.name} is a generative design studio. We sell custom real-time visual installations — projection, LED walls and interactive surfaces — for conferences, events and launches, offices and lobbies, music events, museums and exhibitions. Delivery is turnkey: concept, a live prototype in about a week, the engine built for your brand, hardware, installation, an on-site operator and remote support.`,
    "",
    `Contact: ${site.email} · Proposals: ${absoluteUrl("/#proposal")}`,
    "",
    "## Solutions",
    "",
    ...solutions.map((s) => `- [${s.label}](${absoluteUrl(`/solutions/${s.slug}`)}): ${s.promise}`),
    "",
    "## Installations",
    "",
    ...getCases().map(
      (c) =>
        `- [${c.title}](${absoluteUrl(`/works/${c.slug}`)}) (${c.status}, ${c.year}): ${c.summary}`,
    ),
    "",
    "## FAQ",
    "",
    ...faqItems.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Pages",
    "",
    `- [Studio](${absoluteUrl("/studio")}): team and what is included`,
    `- [All installations](${absoluteUrl("/works")})`,
    `- [All solutions](${absoluteUrl("/solutions")})`,
    "",
  ]
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
