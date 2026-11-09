import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type InputProps = Omit<React.ComponentProps<"input">, "prefix"> & {
  /** Decorative lucide icon shown 12px from the left edge. */
  leadingIcon?: LucideIcon
  /** Short unit text before the value, such as `€`. Read out as description. */
  prefix?: React.ReactNode
  /** Short unit text after the value, such as `uur` or `%`. */
  suffix?: React.ReactNode
}

const affixClassName =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-muted-foreground"

function Input({
  className,
  type,
  id,
  leadingIcon: LeadingIcon,
  prefix,
  suffix,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const hasPrefix = prefix !== undefined && prefix !== null
  const hasSuffix = suffix !== undefined && suffix !== null
  const affixId = id ?? generatedId
  const prefixId = `${affixId}-prefix`
  const suffixId = `${affixId}-suffix`
  // Muted text is too light on the read-only fill: affixes turn dark there.
  const affixTone = props.readOnly && "text-foreground"

  const input = (
    <input
      type={type}
      id={id}
      data-slot="input"
      aria-describedby={
        [
          hasPrefix ? prefixId : undefined,
          hasSuffix ? suffixId : undefined,
          ariaDescribedBy,
        ]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={cn(
        "block h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-tile transition-colors selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        "not-disabled:not-[[readonly]]:hover:border-border-strong aria-invalid:border-destructive",
        "[[readonly]]:bg-muted [[readonly]]:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60",
        (type === "date" || hasPrefix || hasSuffix) && "tabular-nums",
        LeadingIcon && "pl-9",
        hasPrefix && "pl-7",
        hasSuffix && "pr-11",
        className
      )}
      {...props}
    />
  )

  if (!LeadingIcon && !hasPrefix && !hasSuffix) return input

  return (
    <div data-slot="input-wrapper" className="relative w-full min-w-0">
      {LeadingIcon && (
        <LeadingIcon
          data-slot="input-icon"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      )}
      {hasPrefix && (
        <span
          data-slot="input-prefix"
          id={prefixId}
          className={cn(affixClassName, "left-3", affixTone)}
        >
          {prefix}
        </span>
      )}
      {input}
      {hasSuffix && (
        <span
          data-slot="input-suffix"
          id={suffixId}
          className={cn(affixClassName, "right-3", affixTone)}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}

export { Input }
