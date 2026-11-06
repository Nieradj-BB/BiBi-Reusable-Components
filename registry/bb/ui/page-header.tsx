import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function PageHeader({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  actions,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: React.ReactNode
  /** Rendered above the title, e.g. `<PageHeaderBreadcrumbs>`. */
  breadcrumbs?: React.ReactNode
  /** Buttons for the page's main commands. */
  actions?: React.ReactNode
}) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "shrink-0 border-b border-border bg-background p-6 lg:px-8",
        className
      )}
      {...props}
    >
      {breadcrumbs && (
        <div data-slot="page-header-breadcrumbs-slot" className="mb-3 -ml-1">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p
              data-slot="page-header-eyebrow"
              className="mb-1 text-xs font-bold tracking-widest text-brand-cyan uppercase"
            >
              {eyebrow}
            </p>
          )}
          <h1 data-slot="page-header-title" className="text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p
              data-slot="page-header-subtitle"
              className="mt-1 text-base text-muted-foreground"
            >
              {subtitle}
            </p>
          )}
          <span
            data-slot="page-header-stripe"
            aria-hidden="true"
            className="mt-4 block h-1 w-16 rounded-full bg-brand-cyan"
          />
        </div>
        {actions && (
          <div
            data-slot="page-header-actions"
            className="flex shrink-0 flex-wrap gap-2"
          >
            {actions}
          </div>
        )}
      </div>
      {children && (
        <div data-slot="page-header-slot" className="mt-5">
          {children}
        </div>
      )}
    </div>
  )
}

function PageHeaderBreadcrumbs({
  className,
  children,
  "aria-label": ariaLabel = "Kruimelpad",
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="page-header-breadcrumbs"
      aria-label={ariaLabel}
      className={cn("min-w-0", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm">{children}</ol>
    </nav>
  )
}

function PageHeaderBreadcrumbItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="page-header-breadcrumb-item"
      className={cn("group/crumb flex min-w-0 items-center gap-1", className)}
      {...props}
    >
      <ChevronRightIcon
        aria-hidden="true"
        className="size-3.5 shrink-0 text-muted-foreground group-first/crumb:hidden"
      />
      {children}
    </li>
  )
}

const crumbClassName = "block min-h-6 max-w-56 truncate rounded-md px-1 py-0.5"

function PageHeaderBreadcrumbLink({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="page-header-breadcrumb-link"
      className={cn(
        crumbClassName,
        "text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderBreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="page-header-breadcrumb-page"
      aria-current="page"
      className={cn(crumbClassName, "font-semibold text-foreground", className)}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderBreadcrumbs,
  PageHeaderBreadcrumbItem,
  PageHeaderBreadcrumbLink,
  PageHeaderBreadcrumbPage,
}
