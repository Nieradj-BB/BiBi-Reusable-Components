import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  leadingIcon: LeadingIcon,
  ...props
}: React.ComponentProps<"input"> & {
  /** Decorative lucide icon shown 12px from the left edge. */
  leadingIcon?: LucideIcon
}) {
  const input = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "block h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-tile transition-colors selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        "not-disabled:hover:border-border-strong aria-invalid:border-destructive",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        LeadingIcon && "pl-9",
        className
      )}
      {...props}
    />
  )

  if (!LeadingIcon) return input

  return (
    <div data-slot="input-wrapper" className="relative w-full min-w-0">
      <LeadingIcon
        data-slot="input-icon"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      {input}
    </div>
  )
}

export { Input }
