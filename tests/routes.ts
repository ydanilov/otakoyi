import { getCases } from "../src/content/cases"

export const routes = [
  { name: "home", path: "/" },
  { name: "works", path: "/works" },
  { name: "studio", path: "/studio" },
  ...getCases().map((c) => ({ name: `case-${c.slug}`, path: `/works/${c.slug}` })),
]
