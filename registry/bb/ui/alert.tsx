import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-md border px-4 py-3 text-sm text-foreground has-[>svg]:grid-cols-[--spacing(4)_1fr] has-[>svg]:gap-x-3 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "border-border bg-muted [&>svg]:text-muted-foreground",
        success: "border-success [&>svg]:text-success",
        warning: "border-warning [&>svg]:text-warning",
        // Card fill: red text fails 4.5:1 on the page background.
        destructive: "border-destructive/40 bg-card text-destructive",
      },
      size: {
        default: "",
        compact: "px-3 py-2 has-[>svg]:gap-x-2",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
    },
  }
)

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>

// Only errors interrupt; warnings and results are polite, info is a note.
const alertRoles: Record<AlertVariant, React.AriaRole> = {
  info: "note",
  success: "status",
  warning: "status",
  destructive: "alert",
}

function Alert({
  className,
  variant = "info",
  size = "default",
  role,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const resolvedVariant = variant ?? "info"

  return (
    <div
      data-slot="alert"
      data-variant={resolvedVariant}
      data-size={size}
      role={role ?? alertRoles[resolvedVariant]}
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 font-semibold", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 min-w-0 wrap-break-word [&_p]:not-last:mb-1",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("col-start-2 mt-2 flex flex-wrap gap-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants }
