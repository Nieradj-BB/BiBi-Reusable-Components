"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  id,
  label,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** Visible label after the switch; renders it as a labelled row. */
  label?: React.ReactNode
}) {
  const generatedId = React.useId()
  const isField = label !== undefined
  const controlId = id ?? (isField ? generatedId : undefined)

  const control = (
    <SwitchPrimitive.Root
      data-slot="switch"
      id={controlId}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-muted-foreground p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed data-[state=checked]:bg-brand-cyan motion-reduce:transition-none",
        !isField && "disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-card shadow-tile data-[state=checked]:translate-x-5 motion-safe:transition-transform"
      />
    </SwitchPrimitive.Root>
  )

  if (!isField) return control

  return (
    <div
      data-slot="switch-field"
      className="inline-flex items-center gap-2 text-sm text-foreground has-disabled:opacity-50"
    >
      {control}
      <label
        data-slot="switch-label"
        htmlFor={controlId}
        className="cursor-pointer peer-disabled:cursor-not-allowed"
      >
        {label}
      </label>
    </div>
  )
}

export { Switch }
