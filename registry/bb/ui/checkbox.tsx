"use client"

import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  id,
  label,
  description,
  "aria-describedby": ariaDescribedBy,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  /** Visible label next to the box; renders the checkbox as a labelled row. */
  label?: React.ReactNode
  /** Help text under the label, linked with aria-describedby. */
  description?: React.ReactNode
}) {
  const generatedId = React.useId()
  const isField = label !== undefined || description !== undefined
  const controlId = id ?? (isField ? generatedId : undefined)
  const descriptionId = `${controlId}-description`

  const control = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={controlId}
      aria-describedby={
        [description ? descriptionId : undefined, ariaDescribedBy]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={cn(
        "peer group/checkbox relative size-4 shrink-0 cursor-pointer rounded-md border border-muted-foreground bg-card text-brand-cyan-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed data-[state=checked]:border-brand-cyan data-[state=checked]:bg-brand-cyan data-[state=indeterminate]:border-brand-cyan data-[state=indeterminate]:bg-brand-cyan",
        isField ? "col-start-1 row-start-1 mt-0.5" : "disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon
          aria-hidden="true"
          className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden"
        />
        <MinusIcon
          aria-hidden="true"
          className="hidden size-3.5 group-data-[state=indeterminate]/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!isField) return control

  return (
    <div
      data-slot="checkbox-field"
      className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-2 py-0.5 text-sm text-foreground has-disabled:opacity-50"
    >
      {control}
      {label !== undefined && (
        <label
          data-slot="checkbox-label"
          htmlFor={controlId}
          className="col-start-2 cursor-pointer peer-disabled:cursor-not-allowed"
        >
          {label}
        </label>
      )}
      {description !== undefined && (
        <p
          data-slot="checkbox-description"
          id={descriptionId}
          className="col-start-2 text-xs text-muted-foreground"
        >
          {description}
        </p>
      )}
    </div>
  )
}

export { Checkbox }
