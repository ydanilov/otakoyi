import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const faqItems = [
  {
    q: "Do you provide the hardware?",
    a: "Yes — projectors, LED, sensors and media servers, or we work with your venue's existing screens. We plan it during production",
  },
  {
    q: "How is it priced?",
    a: "Per event (rental), as a permanent installation (purchase + support), or as a yearly licence for multi-event programmes",
  },
  {
    q: "How much can be customised?",
    a: "Everything visible: palette, typography, shapes, data sources and interaction. The engine is built for your brand, not themed after the fact",
  },
  {
    q: "Can it run without us on site?",
    a: "Permanent installations run unattended with remote monitoring. For events we recommend an operator on site; we can train your team",
  },
  {
    q: "Who owns the content?",
    a: "You own every output and seed. The engine is licensed for your brand; exclusive licences are available",
  },
] as const

export function Faq({ items = faqItems }: { items?: readonly { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="max-w-3xl">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`faq-${i}`}>
          <AccordionTrigger className="text-lg">{f.q}</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
