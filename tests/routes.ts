import { getCases } from "../src/content/cases"
import { solutions } from "../src/content/solutions"

export const routes = [
  { name: "home", path: "/" },
  { name: "works", path: "/works" },
  { name: "studio", path: "/studio" },
  { name: "solutions", path: "/solutions" },
  ...solutions.map((s) => ({ name: `solution-${s.slug}`, path: `/solutions/${s.slug}` })),
  ...getCases().map((c) => ({ name: `case-${c.slug}`, path: `/works/${c.slug}` })),
]
