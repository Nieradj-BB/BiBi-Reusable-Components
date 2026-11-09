"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        "group/radio-group flex min-w-0 flex-col gap-2 aria-[orientation=horizontal]:flex-row aria-[orientation=horizontal]:flex-wrap aria-[orientation=horizontal]:gap-x-5",
        className
      )}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  id,
  label,
  description,
  "aria-describedby": ariaDescribedBy,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** Visible label next to the circle; renders the item as a labelled row. */
  label?: React.ReactNode
  /** Help text under the label, linked with aria-describedby. */
  description?: React.ReactNode
}) {
  const generatedId = React.useId()
  const isField = label !== undefined || description !== undefined
  const controlId = id ?? (isField ? generatedId : undefined)
  const descriptionId = `${controlId}-description`

  const control = (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      id={controlId}
      aria-describedby={
        [description ? descriptionId : undefined, ariaDescribedBy]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={cn(
        "peer relative size-4 shrink-0 cursor-pointer rounded-full border border-muted-foreground bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed data-[state=checked]:border-brand-cyan",
        "group-aria-invalid/radio-group:border-destructive aria-invalid:border-destructive",
        isField ? "col-start-1 row-start-1 mt-0.5" : "disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="absolute inset-0 grid place-content-center"
      >
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-brand-cyan"
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (!isField) return control

  return (
    <div
      data-slot="radio-group-field"
      className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-2 py-0.5 text-sm text-foreground has-disabled:opacity-50"
    >
      {control}
      {label !== undefined && (
        <label
          data-slot="radio-group-label"
          htmlFor={controlId}
          className="col-start-2 cursor-pointer peer-disabled:cursor-not-allowed"
        >
          {label}
        </label>
      )}
      {description !== undefined && (
        <p
          data-slot="radio-group-description"
          id={descriptionId}
          className="col-start-2 text-xs text-muted-foreground"
        >
          {description}
        </p>
      )}
    </div>
  )
}

export { RadioGroup, RadioGroupItem }
