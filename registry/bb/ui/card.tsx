import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative flex w-full min-w-0 flex-col rounded-xl border border-border bg-card text-card-foreground has-[[data-slot=card-link]:focus-visible]:outline-2 has-[[data-slot=card-link]:focus-visible]:outline-offset-2 has-[[data-slot=card-link]:focus-visible]:outline-ring has-[[data-slot=card-link][aria-current=true]]:border-brand-cyan has-[[data-slot=card-link][aria-current=true]]:ring-1 has-[[data-slot=card-link][aria-current=true]]:ring-brand-cyan",
  {
    variants: {
      variant: {
        flat: "",
        elevated: "shadow-card",
        interactive:
          "shadow-card transition-[box-shadow,border-color] duration-200 hover:shadow-tile-hover",
      },
    },
    defaultVariants: {
      variant: "flat",
    },
  }
)

function Card({
  className,
  variant = "flat",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "relative grid aspect-square place-items-center overflow-hidden rounded-t-xl bg-brand-ice text-primary/45 *:data-[slot=badge]:absolute *:data-[slot=badge]:top-3 *:data-[slot=badge]:left-3 [&>svg]:size-10 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function CardMediaInitials({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="card-media-initials"
      className={cn("font-heading text-5xl/none font-extrabold", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1.5 p-5 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h3"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h3"

  return (
    <Comp
      data-slot="card-title"
      className={cn("text-base", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardLink({
  className,
  selected = false,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { selected?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="card-link"
      aria-current={selected ? "true" : undefined}
      className={cn(
        "after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "flex-1 p-5 text-sm [[data-slot=card-header]+&]:pt-0",
        className
      )}
      {...props}
    />
  )
}

function CardMeta({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="card-meta"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function CardMetaItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="card-meta-item"
      className={cn(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-brand-cyan",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex flex-wrap items-center gap-2 p-5 [[data-slot=card-content]+&]:pt-0 [[data-slot=card-header]+&]:pt-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardMedia,
  CardMediaInitials,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardLink,
  CardContent,
  CardMeta,
  CardMetaItem,
  CardFooter,
  cardVariants,
}
