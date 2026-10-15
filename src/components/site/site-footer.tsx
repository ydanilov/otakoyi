import { site } from "@/config/site"
import { Logo } from "./logo"
import { socialIcons } from "./social-icons"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* The one thing to do here: write to us. */}
        <div className="border-b py-16 md:py-24">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">
            Have a space in mind?
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-4xl font-medium tracking-tighter break-all underline-offset-8 transition-colors hover:text-signal md:text-7xl"
          >
            {site.email}
          </a>
          <p className="mt-4 max-w-md text-pretty text-muted-foreground">
            Tell us the venue, the date or just the idea. We reply within one working day
          </p>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-pretty text-muted-foreground">{site.tagline}</p>
          </div>
          <ul className="flex gap-2">
            {site.social.map((s) => {
              const Icon = socialIcons[s.label]
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="flex size-11 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-signal hover:text-signal"
                  >
                    {Icon ? <Icon className="size-5" aria-hidden /> : s.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </footer>
  )
}
