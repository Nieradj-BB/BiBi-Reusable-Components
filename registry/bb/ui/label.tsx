"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const labelClassName =
  "block text-sm font-semibold text-primary select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"

type LabelExtras = {
  /** Shows a red asterisk. The control itself carries `required`. */
  required?: boolean
  /** Shows the optional hint after the text. */
  optional?: boolean
  /** Text of the optional hint. */
  optionalHint?: React.ReactNode
}

function LabelMarks({
  required,
  optional,
  optionalHint = "(optioneel)",
}: LabelExtras) {
  return (
    <>
      {required && (
        <span
          data-slot="label-required"
          aria-hidden="true"
          className="ml-0.5 text-destructive"
        >
          *
        </span>
      )}
      {optional && (
        <span
          data-slot="label-hint"
          className="ml-1 inline-block font-normal text-muted-foreground"
        >
          {optionalHint}
        </span>
      )}
    </>
  )
}

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> &
  LabelExtras & {
    /** Renders a legend for a fieldset instead of a label. */
    as?: "label" | "legend"
  }

function Label({
  as = "label",
  className,
  children,
  required,
  optional,
  optionalHint,
  ...props
}: LabelProps) {
  const content = (
    <>
      {children}
      <LabelMarks
        required={required}
        optional={optional}
        optionalHint={optionalHint}
      />
    </>
  )

  if (as === "legend") {
    return (
      <legend
        data-slot="label"
        className={cn(labelClassName, "mb-2 p-0", className)}
        {...(props as React.ComponentProps<"legend">)}
      >
        {content}
      </legend>
    )
  }

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelClassName, className)}
      {...(props as React.ComponentProps<typeof LabelPrimitive.Root>)}
    >
      {content}
    </LabelPrimitive.Root>
  )
}

export { Label }
