import * as React from "react"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type TableDensity = "default" | "dense"

function Table({
  className,
  density = "default",
  containerProps,
  ...props
}: React.ComponentProps<"table"> & {
  /** `dense` uses 8px by 12px cells instead of 12px by 16px. */
  density?: TableDensity
  /** Props for the bordered scroll frame around the table. */
  containerProps?: React.ComponentProps<"div">
}) {
  const { className: containerClassName, ...frameProps } = containerProps ?? {}

  return (
    <div
      data-slot="table-container"
      data-density={density}
      className={cn(
        "group/table relative min-w-0 overflow-x-auto rounded-xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        containerClassName
      )}
      {...frameProps}
    >
      <table
        data-slot="table"
        className={cn(
          "w-full min-w-160 border-collapse text-sm text-foreground",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("sr-only", className)}
      {...props}
    />
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={className} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&>tr+tr]:border-t [&>tr+tr]:border-border", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border font-medium", className)}
      {...props}
    />
  )
}

function TableRow({
  className,
  interactive = true,
  ...props
}: React.ComponentProps<"tr"> & {
  /** Rows without data (loading, empty) set this to false: no hover fill. */
  interactive?: boolean
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        interactive && "transition-colors hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

const cellClassName =
  "px-4 py-3 text-left align-middle group-data-[density=dense]/table:px-3 group-data-[density=dense]/table:py-2"

type CellLayout = {
  /** `end` right-aligns the cell with tabular figures, for numbers. */
  align?: "start" | "end"
  /** Keeps the content on one line with tabular figures (dates). */
  nowrap?: boolean
  /** Shrinks the column to its content (checkboxes, row actions). */
  shrink?: boolean
}

function cellLayout({ align, nowrap, shrink }: CellLayout) {
  return cn(
    align === "end" && "text-right whitespace-nowrap tabular-nums",
    nowrap && "whitespace-nowrap tabular-nums",
    shrink && "w-[1%] whitespace-nowrap"
  )
}

function TableHead({
  className,
  align,
  nowrap,
  shrink,
  scope = "col",
  ...props
}: Omit<React.ComponentProps<"th">, "align"> & CellLayout) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn(
        cellClassName,
        "border-b border-border bg-card text-xs/4 font-semibold tracking-widest whitespace-nowrap text-muted-foreground uppercase",
        cellLayout({ align, nowrap, shrink }),
        className
      )}
      {...props}
    />
  )
}

function TableRowHeader({
  className,
  align,
  nowrap,
  shrink,
  ...props
}: Omit<React.ComponentProps<"th">, "align"> & CellLayout) {
  return (
    <th
      data-slot="table-row-header"
      scope="row"
      className={cn(
        cellClassName,
        "font-medium",
        cellLayout({ align, nowrap, shrink }),
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  align,
  nowrap,
  shrink,
  muted = false,
  ...props
}: Omit<React.ComponentProps<"td">, "align"> &
  CellLayout & {
    /** Muted text for secondary columns. */
    muted?: boolean
  }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        cellClassName,
        cellLayout({ align, nowrap, shrink }),
        muted && "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Second, muted line under a cell's main value (a date under an invoice number). */
function TableCellDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="table-cell-description"
      className={cn(
        "mt-0.5 block text-xs font-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Header button that sorts the column. Set `aria-sort` on the surrounding TableHead. */
function TableSortButton({
  className,
  direction = false,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  direction?: "ascending" | "descending" | false
}) {
  const Icon =
    direction === "ascending"
      ? ArrowUpIcon
      : direction === "descending"
        ? ArrowDownIcon
        : ChevronsUpDownIcon

  return (
    <button
      type="button"
      data-slot="table-sort-button"
      data-direction={direction || undefined}
      className={cn(
        "-mx-1.5 -my-1 inline-flex min-h-6 cursor-pointer items-center gap-1 rounded-md bg-transparent px-1.5 py-1 tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        direction ? "text-primary" : "hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
    </button>
  )
}

/** Right-aligned row of icon buttons in the last column. */
function TableRowActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-row-actions"
      className={cn("-my-1.5 flex justify-end gap-2", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCellDescription,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowActions,
  TableRowHeader,
  TableSortButton,
  type TableDensity,
}
