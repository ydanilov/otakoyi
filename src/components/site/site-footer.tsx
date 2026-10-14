import { site } from "@/config/site"
import { Logo } from "./logo"
import { socialIcons } from "./social-icons"

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
        <ul className="flex gap-2 md:justify-self-end">
          {site.social.map((s) => {
            const Icon = socialIcons[s.label]
            return (
              <li key={s.href}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  {Icon ? <Icon className="size-5" aria-hidden /> : s.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
