import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("motion-safe:animate-spin", {
  variants: {
    size: {
      sm: "size-3.5",
      default: "size-4",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Spinner({
  className,
  size = "default",
  label = "Laden",
  role,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof spinnerVariants> & { label?: string }) {
  // With visible status text nearby, the spinner is hidden and the text speaks.
  const hidden =
    props["aria-hidden"] === true || props["aria-hidden"] === "true"

  return (
    <span
      data-slot="spinner"
      data-size={size}
      role={role ?? (hidden ? undefined : "status")}
      className={cn(
        "inline-flex shrink-0 items-center justify-center align-middle",
        className
      )}
      {...props}
    >
      <Loader2Icon
        aria-hidden="true"
        focusable="false"
        className={spinnerVariants({ size })}
      />
      {!hidden && <span className="sr-only">{label}</span>}
    </span>
  )
}

export { Spinner, spinnerVariants }
