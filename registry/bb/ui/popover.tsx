"use client"

import * as React from "react"
import { InfoIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 flex max-w-xs flex-col gap-2 rounded-xl border border-border bg-card p-3 text-sm/relaxed text-foreground shadow-panel focus:outline-none",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-footer"
      className={cn("flex justify-end gap-2", className)}
      {...props}
    />
  )
}

/** Bold navy term at the start of an explanation line. */
function PopoverTerm({ className, ...props }: React.ComponentProps<"strong">) {
  return (
    <strong
      data-slot="popover-term"
      className={cn("font-semibold text-primary", className)}
      {...props}
    />
  )
}

/** Round info button that opens a short explanation (toggletip). */
function InfoPopover({
  topic,
  children,
  align = "end",
  side,
  sideOffset,
  className,
  contentClassName,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  /** Names the trigger and the panel: "Uitleg bij <topic>". */
  topic: string
  align?: React.ComponentProps<typeof PopoverPrimitive.Content>["align"]
  side?: React.ComponentProps<typeof PopoverPrimitive.Content>["side"]
  sideOffset?: number
  className?: string
  contentClassName?: string
}) {
  const label = `Uitleg bij ${topic}`

  return (
    <Popover {...props}>
      <PopoverTrigger
        data-slot="info-popover-trigger"
        aria-label={label}
        className={cn(
          "inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-transparent p-0 text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4",
          className
        )}
      >
        <InfoIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent
        aria-label={label}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export {
  InfoPopover,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverFooter,
  PopoverTerm,
  PopoverTrigger,
}
