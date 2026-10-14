"use client"

import { useEffect, useState } from "react"
import { CheckIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { proposalForm, proposalHref, proposalMailto, site } from "@/config/site"

type Field = keyof typeof proposalForm.entries

/** Budget range in thousands of euros; the top of the scale means "or more". */
const BUDGET = { min: 10, max: 200, step: 5, initial: [30, 80] as [number, number] }
const formatBudget = ([lo, hi]: number[]) => `€${lo}k – €${hi}k${hi === BUDGET.max ? "+" : ""}`

const fields: { name: Field; label: string; type?: string; required?: boolean; wide?: boolean }[] =
  [
    { name: "name", label: "Name", required: true },
    { name: "email", label: "Work email", type: "email", required: true },
    { name: "company", label: "Company" },
    { name: "event", label: "Event or venue" },
    { name: "date", label: "Date" },
  ]

/** Sends the answers to the Google Form, or opens a pre-filled email while none is configured. */
async function send(data: Record<Field, string>) {
  if (!proposalForm.action) {
    const body = (Object.keys(data) as Field[])
      .filter((k) => data[k])
      .map((k) => `${k}: ${data[k]}`)
      .join("\n")
    window.open(`${proposalMailto}&body=${encodeURIComponent(body)}`, "_self")
    return
  }
  const form = new FormData()
  for (const k of Object.keys(data) as Field[]) {
    const id = proposalForm.entries[k]
    if (id && data[k]) form.append(id, data[k])
  }
  // Google Forms sends no CORS headers: the response is opaque, a network error still throws.
  await fetch(proposalForm.action, { method: "POST", mode: "no-cors", body: form })
}

/**
 * The "Get a proposal" form. Mounted once in the layout; opens whenever the URL hash is
 * `#proposal`, so every CTA stays a plain link (and still works before hydration).
 */
export function ProposalDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [budget, setBudget] = useState<number[]>(BUDGET.initial)
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === proposalHref) setOpen(true)
    }
    sync()
    window.addEventListener("hashchange", sync)
    // A second click on the same link doesn't change the hash, so catch clicks too.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.(`a[href="${proposalHref}"]`)
      if (!a) return
      e.preventDefault()
      setOpen(true)
    }
    document.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("hashchange", sync)
      document.removeEventListener("click", onClick)
    }
  }, [])

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) {
      if (window.location.hash === proposalHref)
        history.replaceState(null, "", window.location.pathname + window.location.search)
      if (state === "sent" || state === "error") setState("idle")
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(
      (Object.keys(proposalForm.entries) as Field[]).map((k) => [
        k,
        String(fd.get(k) ?? "").trim(),
      ]),
    ) as Record<Field, string>
    setState("sending")
    try {
      await send(data)
      setState("sent")
    } catch {
      setState("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-xl">
        {state === "sent" ? (
          <div className="space-y-4 py-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-signal text-signal-foreground">
              <CheckIcon />
            </span>
            <DialogTitle className="text-2xl">Thanks, we have it</DialogTitle>
            <DialogDescription>
              We reply within one working day with first ideas and the next step
            </DialogDescription>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{site.cta.label}</DialogTitle>
              <DialogDescription>
                Venue and date are enough to start. We reply within one working day
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className="grid gap-2">
                  <Label htmlFor={`proposal-${f.name}`}>
                    {f.label}
                    {f.required && <span className="text-signal">*</span>}
                  </Label>
                  <Input
                    id={`proposal-${f.name}`}
                    name={f.name}
                    type={f.type ?? "text"}
                    required={f.required}
                    autoComplete={
                      f.name === "name"
                        ? "name"
                        : f.name === "email"
                          ? "email"
                          : f.name === "company"
                            ? "organization"
                            : "off"
                    }
                  />
                </div>
              ))}
              <div className="grid gap-3 sm:col-span-2">
                <div className="flex items-baseline justify-between gap-4">
                  <Label id="proposal-budget-label">Budget</Label>
                  <output aria-live="polite" className="font-mono text-sm text-signal tabular-nums">
                    {formatBudget(budget)}
                  </output>
                </div>
                <Slider
                  aria-labelledby="proposal-budget-label"
                  thumbLabels={["Budget from, thousand euros", "Budget up to, thousand euros"]}
                  min={BUDGET.min}
                  max={BUDGET.max}
                  step={BUDGET.step}
                  minStepsBetweenThumbs={1}
                  value={budget}
                  onValueChange={setBudget}
                  className="py-2 [&_[data-slot=slider-range]]:bg-signal [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-signal"
                />
                <input type="hidden" name="budget" value={formatBudget(budget)} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="proposal-message">What do you have in mind</Label>
                <Textarea id="proposal-message" name="message" rows={4} />
              </div>
              {state === "error" && (
                <p role="alert" className="text-sm text-destructive sm:col-span-2">
                  Couldn&apos;t send. Try again or write to {site.email}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                variant="signal"
                disabled={state === "sending"}
                className="sm:col-span-2"
              >
                {state === "sending" ? "Sending" : "Send request"} <ArrowRightIcon />
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
