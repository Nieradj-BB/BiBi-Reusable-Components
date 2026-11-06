import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const emptyStateVariants = cva(
  "flex min-w-0 flex-col items-center rounded-xl border border-dashed border-border-strong text-center",
  {
    variants: {
      size: {
        default: "p-10",
        compact: "p-6",
        inline:
          "flex-row flex-wrap justify-between gap-x-4 gap-y-2 px-5 py-4 text-left",
      },
      inset: {
        true: "rounded-none border-0",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      inset: false,
    },
  }
)

function EmptyState({
  className,
  size = "default",
  inset = false,
  icon: Icon,
  title,
  description,
  action,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof emptyStateVariants> & {
    /** Decorative lucide icon in a cyan circle (default size only). */
    icon?: LucideIcon
    /** Short title (default size only). */
    title?: React.ReactNode
    /** What is missing and how items appear. */
    description: React.ReactNode
    /** A Button or link that fixes the empty state. */
    action?: React.ReactNode
  }) {
  const isDefault = size === "default" || size === null

  return (
    <div
      data-slot="empty-state"
      data-size={size}
      className={cn(emptyStateVariants({ size, inset }), className)}
      {...props}
    >
      {isDefault && Icon && (
        <span
          data-slot="empty-state-icon"
          aria-hidden="true"
          className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-ice text-brand-cyan"
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      {isDefault && title && (
        <p
          data-slot="empty-state-title"
          className="font-heading text-lg font-bold text-primary"
        >
          {title}
        </p>
      )}
      <p
        data-slot="empty-state-description"
        className={cn(
          "max-w-[48ch] text-sm text-muted-foreground",
          isDefault && "mt-1",
          size === "inline" && "max-w-none"
        )}
      >
        {description}
      </p>
      {action && (
        <div
          data-slot="empty-state-action"
          className={cn(
            "flex flex-wrap justify-center gap-2",
            isDefault && "mt-5",
            size === "compact" && "mt-3"
          )}
        >
          {action}
        </div>
      )}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
