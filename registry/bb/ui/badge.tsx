import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 align-middle text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
        success:
          "border-success bg-transparent text-foreground [&>svg]:text-success",
        destructive: "border-destructive/40 bg-transparent text-destructive",
        brand: "bg-brand-ice text-brand-cyan",
      },
      count: {
        true: "tabular-nums",
        false: "",
      },
    },
    defaultVariants: {
      variant: "secondary",
      count: false,
    },
  }
)

function Badge({
  className,
  variant = "secondary",
  count = false,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, count }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
