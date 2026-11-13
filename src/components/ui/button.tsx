import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * shadcn/ui Button (new-york), restyled for Otakoyi. Variant and size names stay shadcn's so the
 * API, Storybook and Code Connect match upstream; only the look is ours:
 * - pill shape, tighter type, press feedback (scale) and a smooth hover;
 * - `signal` glows in the brand colour — the one action per view;
 * - a trailing icon marked `data-icon="inline-end"` (shadcn convention) nudges forward on hover.
 * Colours come from tokens only (`--signal`, `--foreground`, …), never raw values.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium tracking-tight whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,box-shadow,transform,filter] duration-200 ease-out active:scale-[0.97]",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "[&_svg[data-icon=inline-end]]:transition-transform [&_svg[data-icon=inline-end]]:duration-200 hover:[&_svg[data-icon=inline-end]]:translate-x-0.5",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--primary-foreground)_18%,transparent)]",
        ],
        signal: [
          "bg-signal text-signal-foreground hover:-translate-y-px hover:brightness-110 active:translate-y-0",
          "shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--signal-foreground)_15%,transparent),0_10px_30px_-12px_color-mix(in_oklch,var(--signal)_70%,transparent)]",
          "hover:shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--signal-foreground)_15%,transparent),0_14px_40px_-10px_color-mix(in_oklch,var(--signal)_90%,transparent)]",
        ],
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-foreground/15 bg-background/40 text-foreground hover:border-foreground/40 hover:bg-foreground/[0.06]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "text-foreground hover:bg-foreground/[0.07]",
        link: "rounded-none text-foreground underline decoration-signal decoration-2 underline-offset-[6px] hover:decoration-foreground active:scale-100",
      },
      size: {
        default: "h-10 px-5 text-sm has-[>svg]:px-4",
        xs: "h-7 gap-1 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3.5 text-sm has-[>svg]:px-3",
        lg: "h-12 px-7 text-base has-[>svg]:px-6",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    compoundVariants: [{ variant: "link", class: "h-auto px-0 has-[>svg]:px-0" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
