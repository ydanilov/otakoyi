import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { faqItems } from "@/components/sections/faq"
import { site } from "@/config/site"
import { getIndexableCases } from "@/content/cases"
import { solutions } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import { absoluteUrl, seoDescription } from "@/lib/seo"

/** MDX body as plain markdown: JSX components (live previews) are dropped. */
async function caseBody(slug: string) {
  const raw = await readFile(join(process.cwd(), "src/content/cases", `${slug}.mdx`), "utf8")
  return raw
    .split("\n")
    .filter((l) => !/^\s*<[A-Z]/.test(l) && !/^\s*import /.test(l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const header = () => `# ${site.name}

> ${seoDescription}

${site.name} is a generative design studio. We sell custom interactive installations, delivered turnkey: concept and live prototype in about a week, hardware, on-site build and operation. One generative engine re-shapes itself to every screen, wall and floor in a venue and reacts to people and live data, so the content never loops and never needs re-rendering.

- Contact: ${site.email}
- Get a proposal: ${absoluteUrl("/")}#proposal
`

/** llms.txt — a short, linked map of the site for AI answer engines (llmstxt.org). */
export function llmsIndex() {
  return `${header()}
## Solutions

${solutions.map((s) => `- [${s.label} installations](${absoluteUrl(`/solutions/${s.slug}`)}): ${s.promise}`).join("\n")}

## Installations

${getIndexableCases()
  .map(
    (c) =>
      `- [${c.title}](${absoluteUrl(`/works/${c.slug}`)}) (${c.status}, ${c.formats.join(", ")}): ${c.summary}`,
  )
  .join("\n")}

## Studio

- [About the studio](${absoluteUrl("/studio")}): who we are, how we work and what is included
- [All installations](${absoluteUrl("/works")})
- [All solutions](${absoluteUrl("/solutions")})

## Optional

- [Full text for language models](${absoluteUrl("/llms-full.txt")})
`
}

/** llms-full.txt — the same content with every page's text inline. */
export async function llmsFull() {
  const cases = await Promise.all(
    getIndexableCases().map(
      async (c) => `### ${c.title}

URL: ${absoluteUrl(`/works/${c.slug}`)}
Status: ${c.status} · Year: ${c.year} · Formats: ${c.formats.join(", ")} · Venue: ${c.location}
Surface: ${c.facts.surface} · Timeline: ${c.facts.timeline}

${c.summary}

${await caseBody(c.slug)}
`,
    ),
  )

  return `${header()}
## Solutions

${solutions
  .map(
    (s) => `### ${s.label} installations — ${s.title}

URL: ${absoluteUrl(`/solutions/${s.slug}`)}

${s.description}

Where it goes: ${s.surfaces.join("; ")}

${s.outcomes.map((o) => `- **${o.title}**: ${o.body}`).join("\n")}

${s.faq.map((f) => `**${f.q}** ${f.a}`).join("\n\n")}
`,
  )
  .join("\n")}
## Surfaces and inputs we work with

${technologies.map((t) => `- **${t.name}** (${t.kind}): ${t.line}. Typically: ${t.where.join(", ")}`).join("\n")}

## Installations

${cases.join("\n")}
## FAQ

${faqItems.map((f) => `**${f.q}** ${f.a}`).join("\n\n")}
`
}
