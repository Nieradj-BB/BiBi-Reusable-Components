"use client"

import type * as React from "react"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type ToastClassNames = NonNullable<
  NonNullable<ToasterProps["toastOptions"]>["classNames"]
>

// sonner's own CSS is unlayered, so the few properties it also sets need `!`.
const toastClassNames: ToastClassNames = {
  toast: cn(
    "group/toast grid w-(--width) grid-cols-[auto_minmax(0,1fr)_auto] items-start rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground shadow-panel",
    "data-[type=error]:border-destructive/40",
    "focus-visible:outline-2! focus-visible:outline-offset-2 focus-visible:outline-ring!",
    "data-[mounted=false]:[--y:translateY(6px)]! motion-safe:duration-320! motion-safe:ease-enter! motion-reduce:transition-none!",
    "data-[expanded=false]:data-[front=false]:*:opacity-0"
  ),
  icon: "col-start-1 row-start-1 mt-0.5 mr-3 flex text-muted-foreground in-data-[type=error]:text-destructive in-data-[type=success]:text-success [&_svg:not([class*='size-'])]:size-4",
  content: "col-start-2 row-start-1 min-w-0",
  title: "font-semibold in-data-[type=error]:text-destructive",
  description: "mt-0.5 text-muted-foreground",
  actionButton: cn(
    buttonVariants({ variant: "outline", size: "sm" }),
    "col-start-2 row-start-2 mt-2 justify-self-start group-has-data-cancel/toast:justify-self-end"
  ),
  cancelButton: cn(
    buttonVariants({ variant: "ghost", size: "sm" }),
    "col-start-2 row-start-2 mt-2 justify-self-start"
  ),
  closeButton:
    "col-start-3 row-start-1 -my-1 -mr-2 ml-3 grid size-7 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4",
}

function mergeClassNames(extra: ToastClassNames | undefined): ToastClassNames {
  if (!extra) return toastClassNames
  const merged: ToastClassNames = { ...toastClassNames }
  for (const key of Object.keys(extra) as (keyof ToastClassNames)[]) {
    merged[key] = cn(toastClassNames[key], extra[key])
  }
  return merged
}

function Toaster({
  className,
  style,
  icons,
  toastOptions,
  ...props
}: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      expand
      closeButton
      gap={8}
      offset={16}
      mobileOffset={16}
      containerAriaLabel="Meldingen"
      className={className}
      style={{ "--width": "22rem", ...style } as React.CSSProperties}
      icons={{
        success: <CircleCheckIcon className="size-4" aria-hidden="true" />,
        info: <InfoIcon className="size-4" aria-hidden="true" />,
        warning: <TriangleAlertIcon className="size-4" aria-hidden="true" />,
        error: <CircleAlertIcon className="size-4" aria-hidden="true" />,
        loading: (
          <LoaderCircleIcon
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
        ),
        close: <XIcon aria-hidden="true" />,
        ...icons,
      }}
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: "Melding sluiten",
        ...toastOptions,
        classNames: mergeClassNames(toastOptions?.classNames),
      }}
      {...props}
    />
  )
}

export { Toaster }
