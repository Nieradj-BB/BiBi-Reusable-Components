import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "block h-4 w-full rounded-md bg-muted motion-safe:animate-pulse",
  {
    variants: {
      shape: {
        text: "",
        sm: "h-3.5",
        title: "h-5",
        value: "h-9",
        row: "h-12 rounded-xl",
        circle: "size-10 flex-none rounded-full",
      },
      width: {
        full: "w-full",
        "90": "w-9/10",
        "80": "w-4/5",
        "75": "w-3/4",
        "60": "w-3/5",
        "40": "w-2/5",
        "25": "w-1/4",
      },
    },
    defaultVariants: {
      shape: "text",
    },
  }
)

function Skeleton({
  className,
  shape = "text",
  width,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      data-shape={shape}
      aria-hidden="true"
      className={cn(skeletonVariants({ shape, width }), className)}
      {...props}
    />
  )
}

// One loading area: a visually hidden status text plus the hidden shapes.
function SkeletonGroup({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label: string }) {
  return (
    <div
      data-slot="skeleton-group"
      className={cn("relative", className)}
      {...props}
    >
      <span role="status" className="sr-only">
        {label}
      </span>
      {children}
    </div>
  )
}

export { Skeleton, SkeletonGroup, skeletonVariants }
