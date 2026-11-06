"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircleIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium whitespace-nowrap no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[loading=true]:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-brand-cyan text-brand-cyan-foreground not-disabled:hover:bg-brand-cyan/90",
        navy: "bg-primary text-primary-foreground not-disabled:hover:bg-primary/90",
        outline:
          "border-border bg-card text-foreground not-disabled:hover:bg-accent",
        ghost: "bg-transparent text-foreground not-disabled:hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground not-disabled:hover:bg-destructive/90",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  // Loading keeps the button enabled so it keeps focus; repeat clicks are ignored.
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant, size }),
        loading && "[&>svg:not([data-slot=button-spinner])]:hidden",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <LoaderCircleIcon
          data-slot="button-spinner"
          aria-hidden="true"
          className="motion-safe:animate-spin"
        />
      )}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
