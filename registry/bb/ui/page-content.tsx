import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Same padding as PageHeader, so the content lines up with the page title.
const pageContentVariants = cva("flex flex-col gap-8 p-6 lg:px-8", {
  variants: {
    width: {
      full: "",
      // The column inside the padding is at most 768px wide.
      readable: "box-content max-w-3xl",
    },
  },
  defaultVariants: {
    width: "full",
  },
})

function PageContent({
  className,
  width = "full",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageContentVariants>) {
  return (
    <div
      data-slot="page-content"
      data-width={width}
      className={cn(pageContentVariants({ width }), className)}
      {...props}
    />
  )
}

function PageSection({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="page-section"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

// A container: the action sits top right when the header is at least 448px
// wide and wraps below the title when it is narrower. The title column never
// gets narrower than its longest word; the action's buttons wrap first.
// A container has no width of its own, so it always takes the full width,
// also in a section with `items-start`.
function PageSectionHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-section-header"
      className={cn(
        "@container/page-section-header grid w-full items-start has-data-[slot=page-section-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function PageSectionTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h2"

  return (
    <Comp
      data-slot="page-section-title"
      className={cn("col-start-1 text-xl", className)}
      {...props}
    />
  )
}

function PageSectionDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-section-description"
      className={cn(
        "col-start-1 mt-1 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PageSectionAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-section-action"
      className={cn(
        "col-start-1 mt-4 flex flex-wrap gap-2 @md/page-section-header:col-start-2 @md/page-section-header:row-span-2 @md/page-section-header:row-start-1 @md/page-section-header:mt-0 @md/page-section-header:ml-4",
        className
      )}
      {...props}
    />
  )
}

export {
  PageContent,
  PageSection,
  PageSectionHeader,
  PageSectionTitle,
  PageSectionDescription,
  PageSectionAction,
  pageContentVariants,
}
