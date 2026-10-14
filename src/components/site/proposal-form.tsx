"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"

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
import { proposalForm, proposalMailto, site } from "@/config/site"

type Field = keyof typeof proposalForm.entries

/** Budget stops in thousands of euros (finer at the low end); the last one means "or more". */
const BUDGET_STOPS = [2, 3, 5, 7.5, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200]
const BUDGET_INITIAL: [number, number] = [4, 9] // €10k – €50k
const formatBudget = ([lo, hi]: number[]) => {
  const k = (i: number) => `€${BUDGET_STOPS[i]}k`
  return `${k(lo!)} – ${k(hi!)}${hi === BUDGET_STOPS.length - 1 ? "+" : ""}`
}

const fields: { name: Field; label: string; type?: string; required?: boolean; wide?: boolean }[] =
  [
    { name: "email", label: "Work email", type: "email", required: true },
    { name: "event", label: "Event name", required: true },
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

/** The proposal form inside its dialog. Loaded lazily by `ProposalDialog` on first open. */
export default function ProposalForm({
  open,
  onOpenChange: setOpen,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [budget, setBudget] = useState<number[]>(BUDGET_INITIAL)
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v && (state === "sent" || state === "error")) setState("idle")
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
                An email and the event are enough to start. We reply within one working day
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
                  thumbLabels={["Budget from", "Budget up to"]}
                  thumbValueTexts={budget.map((i) => `€${BUDGET_STOPS[i]} thousand`)}
                  min={0}
                  max={BUDGET_STOPS.length - 1}
                  step={1}
                  minStepsBetweenThumbs={1}
                  value={budget}
                  onValueChange={setBudget}
                  className="py-2 [&_[data-slot=slider-range]]:bg-signal [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-signal"
                />
                <input type="hidden" name="budget" value={formatBudget(budget)} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="proposal-message">What do you have in mind</Label>
                <Textarea id="proposal-message" name="message" rows={8} className="min-h-40" />
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
                {state === "sending" ? "Sending" : "Send request"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
