import { Separator } from "@/components/ui/separator"
import { site } from "@/config/site"
import { Logo } from "./logo"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{site.tagline}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">New projects</p>
          <a href={`mailto:${site.email}`} className="text-lg underline-offset-4 hover:underline">
            {site.email}
          </a>
        </div>
        <ul className="space-y-2 text-sm md:justify-self-end">
          {site.social.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="text-muted-foreground hover:text-foreground">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} {site.name}. Every image on this site is generated.
      </p>
    </footer>
  )
}
