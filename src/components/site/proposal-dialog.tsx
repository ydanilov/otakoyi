"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { proposalHref } from "@/config/site"

// The form (dialog, inputs, slider) is only downloaded once someone asks for a proposal.
const ProposalForm = dynamic(() => import("@/components/site/proposal-form"), { ssr: false })

/**
 * Mounted once in the layout. Opens the "Get a proposal" form whenever the URL hash is
 * `#proposal`, so every CTA stays a plain link (and still works before hydration).
 */
export function ProposalDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [loaded, setLoaded] = useState(defaultOpen)

  useEffect(() => {
    const show = () => {
      setLoaded(true)
      setOpen(true)
    }
    const sync = () => {
      if (window.location.hash === proposalHref) show()
    }
    sync()
    window.addEventListener("hashchange", sync)
    // A second click on the same link doesn't change the hash, so catch clicks too.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.(`a[href="${proposalHref}"]`)
      if (!a) return
      e.preventDefault()
      show()
    }
    document.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("hashchange", sync)
      document.removeEventListener("click", onClick)
    }
  }, [])

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v && window.location.hash === proposalHref)
      history.replaceState(null, "", window.location.pathname + window.location.search)
  }

  return loaded ? <ProposalForm open={open} onOpenChange={onOpenChange} /> : null
}
