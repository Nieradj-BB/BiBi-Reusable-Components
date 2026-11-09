"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const numberFormat = new Intl.NumberFormat("nl-NL")

/** Page links and buttons: the ghost Button look, 36px (32px under `size="sm"`). */
const paginationLinkVariants = cva(
  [
    "inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-transparent bg-transparent text-sm font-medium text-foreground tabular-nums no-underline transition-colors select-none group-data-[size=sm]/pagination:h-8",
    "not-aria-[current=page]:not-aria-disabled:not-disabled:hover:bg-accent",
    "aria-[current=page]:cursor-default aria-[current=page]:border-brand-cyan aria-[current=page]:bg-brand-ice aria-[current=page]:font-semibold aria-[current=page]:text-brand-cyan",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      shape: {
        page: "min-w-9 px-2 group-data-[size=sm]/pagination:min-w-8",
        previous: "pr-3 pl-2",
        next: "pr-2 pl-3",
        icon: "w-9 px-0 group-data-[size=sm]/pagination:w-8",
      },
    },
    defaultVariants: { shape: "page" },
  }
)

type PaginationLinkShape = VariantProps<typeof paginationLinkVariants>

function Pagination({
  className,
  size = "default",
  "aria-label": ariaLabel = "Paginering",
  ...props
}: React.ComponentProps<"nav"> & {
  /** `sm` makes pages 32px instead of 36px, for under tables. */
  size?: "default" | "sm"
}) {
  return (
    <nav
      data-slot="pagination"
      data-size={size}
      aria-label={ariaLabel}
      className={cn(
        "group/pagination flex max-w-full justify-center",
        className
      )}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = React.ComponentProps<"a"> &
  PaginationLinkShape & {
    /** The current page: sets `aria-current="page"`. */
    isActive?: boolean
    /** Drops the `href` and sets `aria-disabled`, so the link stays in place. */
    disabled?: boolean
  }

function PaginationLink({
  className,
  shape,
  isActive = false,
  disabled = false,
  href,
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      data-slot="pagination-link"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      href={disabled ? undefined : href}
      role={disabled ? "link" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(paginationLinkVariants({ shape }), className)}
      {...props}
    >
      {children}
    </a>
  )
}

function PaginationPrevious({
  label = "Vorige",
  "aria-label": ariaLabel = "Ga naar vorige pagina",
  ...props
}: Omit<PaginationLinkProps, "shape" | "isActive" | "children"> & {
  /** Visible text next to the chevron. */
  label?: React.ReactNode
}) {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      shape="previous"
      aria-label={ariaLabel}
      {...props}
    >
      <ChevronLeftIcon aria-hidden="true" />
      <span>{label}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  label = "Volgende",
  "aria-label": ariaLabel = "Ga naar volgende pagina",
  ...props
}: Omit<PaginationLinkProps, "shape" | "isActive" | "children"> & {
  /** Visible text next to the chevron. */
  label?: React.ReactNode
}) {
  return (
    <PaginationLink
      data-slot="pagination-next"
      shape="next"
      aria-label={ariaLabel}
      {...props}
    >
      <span>{label}</span>
      <ChevronRightIcon aria-hidden="true" />
    </PaginationLink>
  )
}

/**
 * A page as a button, for client-side lists. `disabled` sets `aria-disabled`
 * and ignores clicks, so the button keeps focus on the first or last page.
 */
function PaginationButton({
  className,
  shape,
  isActive = false,
  disabled = false,
  type = "button",
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  PaginationLinkShape & {
    isActive?: boolean
  }) {
  return (
    <button
      data-slot="pagination-button"
      data-active={isActive || undefined}
      type={type}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(paginationLinkVariants({ shape }), className)}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...props}
    />
  )
}

function PaginationEllipsis({
  className,
  label = "Meer pagina's",
  ...props
}: React.ComponentProps<"span"> & {
  /** Visually hidden text for screen readers. */
  label?: string
}) {
  return (
    <>
      <span
        data-slot="pagination-ellipsis"
        aria-hidden="true"
        className={cn(
          "flex size-9 items-center justify-center text-muted-foreground group-data-[size=sm]/pagination:size-8",
          className
        )}
        {...props}
      >
        <MoreHorizontalIcon className="size-4" />
      </span>
      <span className="sr-only">{label}</span>
    </>
  )
}

/** "Pagina 3 van 12" in the compact form; announced when it changes. */
function PaginationStatus({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-status"
      aria-live="polite"
      className={cn(
        "px-2 text-sm whitespace-nowrap text-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

type PaginationRangeItem = number | "ellipsis-start" | "ellipsis-end"

/**
 * Pages to show: the first, the last, and `siblingCount` pages on each side of
 * the current one (kept at full width near the edges). A gap of one page shows
 * that page instead of an ellipsis.
 */
function getPaginationRange({
  page,
  pageCount,
  siblingCount = 1,
}: {
  page: number
  pageCount: number
  siblingCount?: number
}): PaginationRangeItem[] {
  const count = Math.max(1, pageCount)
  const current = Math.min(Math.max(1, page), count)
  const windowSize = 2 * siblingCount + 1
  let start = Math.max(1, current - siblingCount)
  let end = Math.min(count, current + siblingCount)
  if (end - start + 1 < windowSize) {
    if (start === 1) end = Math.min(count, windowSize)
    else start = Math.max(1, end - windowSize + 1)
  }

  const items: PaginationRangeItem[] = []
  if (start > 1) {
    items.push(1)
    if (start > 3) items.push("ellipsis-start")
    else if (start === 3) items.push(2)
  }
  for (let p = start; p <= end; p++) items.push(p)
  if (end < count) {
    if (end < count - 2) items.push("ellipsis-end")
    else if (end === count - 2) items.push(count - 1)
    items.push(count)
  }
  return items
}

type PaginationBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Current page, starting at 1. */
  page: number
  pageSize: number
  /** Total number of rows or items, for the range text and the page count. */
  totalCount: number
  onPageChange: (page: number) => void
  /** Shows the page-size select when set. */
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: ReadonlyArray<number>
  siblingCount?: number
  /** Accessible name of the page navigation; name it after the list. */
  label?: string
  pageSizeLabel?: string
  previousLabel?: string
  nextLabel?: string
  /** Range text, e.g. `21–30 van 248`. */
  rangeLabel?: (from: number, to: number, total: number) => string
}

const defaultRangeLabel = (from: number, to: number, total: number) =>
  `${numberFormat.format(from)}–${numberFormat.format(to)} van ${numberFormat.format(total)}`

/** Range text, page size and size `sm` page buttons in one bar under a table. */
function PaginationBar({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  siblingCount = 1,
  label = "Paginering",
  pageSizeLabel = "Rijen per pagina",
  previousLabel = "Vorige pagina",
  nextLabel = "Volgende pagina",
  rangeLabel = defaultRangeLabel,
  className,
  ...props
}: PaginationBarProps) {
  const sizeId = React.useId()
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  const from = totalCount === 0 ? 0 : (current - 1) * pageSize + 1
  const to = Math.min(current * pageSize, totalCount)

  return (
    <div
      data-slot="pagination-bar"
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3",
        className
      )}
      {...props}
    >
      <p
        data-slot="pagination-range"
        role="status"
        className="text-sm whitespace-nowrap text-muted-foreground tabular-nums"
      >
        {rangeLabel(from, to, totalCount)}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {onPageSizeChange && (
          <div
            data-slot="pagination-page-size"
            className="flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground"
          >
            <label htmlFor={sizeId}>{pageSizeLabel}</label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger
                id={sizeId}
                size="sm"
                className="w-19 tabular-nums"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={String(option)}
                    className="tabular-nums"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Pagination size="sm" aria-label={label} className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationButton
                shape="icon"
                aria-label={previousLabel}
                disabled={current <= 1}
                onClick={() => onPageChange(current - 1)}
              >
                <ChevronLeftIcon aria-hidden="true" />
              </PaginationButton>
            </PaginationItem>
            {getPaginationRange({ page: current, pageCount, siblingCount }).map(
              (item) => (
                <PaginationItem key={item}>
                  {typeof item === "number" ? (
                    <PaginationButton
                      isActive={item === current}
                      onClick={() => {
                        if (item !== current) onPageChange(item)
                      }}
                    >
                      {numberFormat.format(item)}
                    </PaginationButton>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationButton
                shape="icon"
                aria-label={nextLabel}
                disabled={current >= pageCount}
                onClick={() => onPageChange(current + 1)}
              >
                <ChevronRightIcon aria-hidden="true" />
              </PaginationButton>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export {
  Pagination,
  PaginationBar,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationStatus,
  getPaginationRange,
  paginationLinkVariants,
  type PaginationBarProps,
  type PaginationRangeItem,
}
