"use client"

import * as React from "react"
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  metaHelper,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type OnChangeFn,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { SearchIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  TableSortButton,
  type TableDensity,
} from "@/components/data-table/table"

type DataTableColumnMeta = {
  /** `end` right-aligns header and cells with tabular figures, for numbers. */
  align?: "start" | "end"
  /** Renders the cell as the row header (`th scope="row"`), for the identifying value. */
  rowHeader?: boolean
  /** Keeps cells on one line with tabular figures (dates). */
  nowrap?: boolean
  /** Muted text for secondary columns. */
  muted?: boolean
  /** Shrinks the column to its content (row actions). */
  shrink?: boolean
}

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowSelectionFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

type DataTableFeatures = typeof dataTableFeatures

/** Column helper typed for DataTable: `createDataTableColumnHelper<Invoice>()`. */
function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}

// Varied skeleton widths so loading rows read as text, not as a grid of bars.
const skeletonWidths = [
  ["60", "80", "60", "40", "40"],
  ["75", "60", "60", "60", "25"],
  ["60", "90", "60", "40", "40"],
  ["75", "75", "60", "60", "25"],
] as const

type EmptyStateProps = React.ComponentProps<typeof EmptyState>

// One table state slice, controlled when `value` is set and internal otherwise.
function useTableSlice<T>(
  value: T | undefined,
  defaultValue: T,
  onChange: OnChangeFn<T> | undefined
) {
  const [internal, setInternal] = React.useState(defaultValue)
  const update: OnChangeFn<T> = (updater) => {
    if (value === undefined) setInternal(updater)
    onChange?.(updater)
  }
  return [value ?? internal, update] as const
}

type DataTableProps<TData extends RowData> = {
  /** Column definitions from `createDataTableColumnHelper`. Sorting is off unless a column sets `enableSorting: true`. */
  columns: ReadonlyArray<ColumnDef<DataTableFeatures, TData>>
  data: ReadonlyArray<TData>
  /** Visually hidden table caption; also names the scroll frame when it is focusable. */
  caption: string
  getRowId?: (row: TData, index: number) => string
  density?: TableDensity
  /** Makes the scroll frame a focusable, labelled region. Use it when the table has no controls; on while loading. */
  focusable?: boolean
  className?: string

  sorting?: SortingState
  defaultSorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>

  /** Adds a checkbox column and the selection bar above the table. */
  selectable?: boolean
  rowSelection?: RowSelectionState
  defaultRowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  /**
   * Accessible name of a row checkbox, e.g. `Selecteer factuur 2026-041`.
   * `index` is the visible position of the row.
   */
  getRowSelectLabel?: (row: TData, index: number) => string
  /** Visually hidden header of the checkbox column. */
  selectColumnLabel?: string
  selectAllLabel?: string
  selectionCountLabel?: (selected: number, total: number) => string
  /** Buttons shown in the selection bar while rows are selected. */
  bulkActions?: (selectedRows: TData[]) => React.ReactNode

  /** Adds a search field that filters all text and number columns. */
  search?: { label: string; placeholder?: string }
  globalFilter?: string
  defaultGlobalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>
  /** Result count under the toolbar, e.g. `2 van 48 facturen`. */
  resultCountLabel?: (shown: number, total: number) => string
  /** Extra controls in the toolbar row, after the search field. */
  toolbar?: React.ReactNode

  /** Shows skeleton rows under the headers. */
  loading?: boolean
  /** Status text announced while loading. */
  loadingLabel?: string
  loadingRows?: number
  /** EmptyState (inset, spanning all columns) when there is no data. */
  empty?: EmptyStateProps
  /** EmptyState when the search leaves no rows; falls back to `empty`. */
  noResults?: EmptyStateProps
}

function DataTable<TData extends RowData>({
  columns,
  data,
  caption,
  getRowId,
  density = "default",
  focusable,
  className,
  sorting,
  defaultSorting = [],
  onSortingChange,
  selectable = false,
  rowSelection,
  defaultRowSelection = {},
  onRowSelectionChange,
  getRowSelectLabel = (_row, index) => `Selecteer rij ${index + 1}`,
  selectColumnLabel = "Selecteren",
  selectAllLabel = "Alles selecteren",
  selectionCountLabel = (selected, total) =>
    `${selected} van ${total} geselecteerd`,
  bulkActions,
  search,
  globalFilter,
  defaultGlobalFilter = "",
  onGlobalFilterChange,
  resultCountLabel = (shown, total) => `${shown} van ${total}`,
  toolbar,
  loading = false,
  loadingLabel = "Laden…",
  loadingRows = 4,
  empty,
  noResults,
}: DataTableProps<TData>) {
  const captionId = React.useId()
  const searchId = React.useId()

  const [sortingState, setSorting] = useTableSlice(
    sorting,
    defaultSorting,
    onSortingChange
  )
  const [selectionState, setRowSelection] = useTableSlice(
    rowSelection,
    defaultRowSelection,
    onRowSelectionChange
  )
  const [filterValue, setGlobalFilter] = useTableSlice(
    globalFilter,
    defaultGlobalFilter,
    onGlobalFilterChange
  )

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    ...(getRowId && { getRowId }),
    defaultColumn: { enableSorting: false },
    sortDescFirst: false,
    enableSortingRemoval: false,
    enableRowSelection: selectable,
    globalFilterFn: "includesString",
    state: {
      sorting: sortingState,
      rowSelection: selectionState,
      globalFilter: filterValue,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
  })

  const rows = table.getRowModel().rows
  const totalCount = table.getCoreRowModel().rows.length
  const selectedRows = table.getSelectedRowModel().rows
  const leafColumns = table.getAllLeafColumns()
  const columnCount = leafColumns.length + (selectable ? 1 : 0)
  const allSelected = table.getIsAllRowsSelected()
  const someSelected = table.getIsSomeRowsSelected()
  const emptyState = totalCount > 0 ? (noResults ?? empty) : empty
  const isFocusable = focusable ?? loading

  const tableElement = (
    <Table
      density={density}
      aria-busy={loading || undefined}
      containerProps={
        isFocusable
          ? { tabIndex: 0, role: "region", "aria-labelledby": captionId }
          : undefined
      }
    >
      <TableCaption id={captionId}>{caption}</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {selectable && (
              <TableHead shrink>
                <span className="sr-only">{selectColumnLabel}</span>
              </TableHead>
            )}
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta
              const sorted = header.column.getIsSorted()
              const direction =
                sorted === "asc"
                  ? "ascending"
                  : sorted === "desc"
                    ? "descending"
                    : false
              const canSort =
                header.column.getCanSort() && !loading && rows.length > 0

              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan > 1 ? header.colSpan : undefined}
                  align={meta?.align}
                  shrink={meta?.shrink}
                  aria-sort={canSort && direction ? direction : undefined}
                >
                  {header.isPlaceholder ? null : canSort ? (
                    <TableSortButton
                      direction={direction}
                      onClick={() =>
                        header.column.toggleSorting(
                          sorted === "asc"
                            ? true
                            : sorted === "desc"
                              ? false
                              : undefined
                        )
                      }
                    >
                      <table.FlexRender header={header} />
                    </TableSortButton>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              )
            })}
          </tr>
        ))}
      </TableHeader>
      {loading ? (
        <TableBody aria-hidden="true">
          {Array.from({ length: loadingRows }, (_, rowIndex) => (
            <TableRow key={rowIndex} interactive={false}>
              {selectable && <TableCell shrink />}
              {leafColumns.map((column, columnIndex) => {
                const meta = column.columnDef.meta
                const width =
                  skeletonWidths[rowIndex % skeletonWidths.length][
                    columnIndex % 5
                  ]

                return (
                  <TableCell key={column.id} align={meta?.align}>
                    <Skeleton
                      width={width}
                      className={cn(
                        "my-0.5",
                        meta?.align === "end" && "ml-auto"
                      )}
                    />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      ) : rows.length === 0 ? (
        <TableBody>
          <TableRow interactive={false}>
            <TableCell colSpan={columnCount}>
              {emptyState && <EmptyState {...emptyState} inset />}
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {selectable && (
                <TableCell shrink>
                  {/* The whole 24px square is the click target; its hidden
                      text names the checkbox. */}
                  <label className="relative inline-flex size-6 cursor-pointer items-center justify-center rounded-md align-middle has-disabled:cursor-not-allowed">
                    <Checkbox
                      checked={row.getIsSelected()}
                      disabled={!row.getCanSelect()}
                      onCheckedChange={(checked) =>
                        row.toggleSelected(checked === true)
                      }
                    />
                    <span className="sr-only">
                      {getRowSelectLabel(row.original, rowIndex)}
                    </span>
                  </label>
                </TableCell>
              )}
              {row.getAllCells().map((cell) => {
                const meta = cell.column.columnDef.meta
                const layout = {
                  align: meta?.align,
                  nowrap: meta?.nowrap,
                  shrink: meta?.shrink,
                }

                return meta?.rowHeader ? (
                  <TableRowHeader key={cell.id} {...layout}>
                    <table.FlexRender cell={cell} />
                  </TableRowHeader>
                ) : (
                  <TableCell key={cell.id} {...layout} muted={meta?.muted}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  )

  const hasToolbar = search !== undefined || toolbar !== undefined
  const showSelectionBar = selectable && !loading && totalCount > 0

  // One wrapper in every state, so toggling `loading` never remounts the
  // table (scroll position and focus stay).
  return (
    <div
      data-slot="data-table"
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      {hasToolbar && (
        <div
          data-slot="data-table-toolbar"
          className="flex flex-wrap items-start gap-4"
        >
          {search && (
            <div
              data-slot="data-table-search"
              className="flex max-w-md flex-[1_1_15rem] flex-col gap-2"
            >
              <Label htmlFor={searchId}>{search.label}</Label>
              <Input
                id={searchId}
                type="search"
                leadingIcon={SearchIcon}
                autoComplete="off"
                spellCheck={false}
                placeholder={search.placeholder}
                value={filterValue}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
              />
            </div>
          )}
          {toolbar}
        </div>
      )}
      {search && (
        <p
          data-slot="data-table-count"
          role="status"
          className="text-sm text-muted-foreground tabular-nums"
        >
          {resultCountLabel(
            loading ? 0 : table.getFilteredRowModel().rows.length,
            totalCount
          )}
        </p>
      )}
      {showSelectionBar && (
        <div
          data-slot="data-table-selection-bar"
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <label className="inline-flex min-h-6 cursor-pointer items-center gap-2 text-sm font-semibold text-primary">
            <Checkbox
              checked={
                allSelected ? true : someSelected ? "indeterminate" : false
              }
              onCheckedChange={(checked) =>
                table.toggleAllRowsSelected(checked === true)
              }
            />
            {selectAllLabel}
          </label>
          <p
            data-slot="data-table-selection-count"
            role="status"
            className="text-sm text-muted-foreground tabular-nums"
          >
            {selectionCountLabel(selectedRows.length, totalCount)}
          </p>
          {bulkActions && selectedRows.length > 0 && (
            <div
              data-slot="data-table-bulk-actions"
              className="flex flex-wrap gap-2"
            >
              {bulkActions(selectedRows.map((row) => row.original))}
            </div>
          )}
        </div>
      )}
      {/* Persistent live region: only its text changes. */}
      <p data-slot="data-table-loading" role="status" className="sr-only">
        {loading ? loadingLabel : ""}
      </p>
      {tableElement}
    </div>
  )
}

export {
  DataTable,
  createDataTableColumnHelper,
  dataTableFeatures,
  type DataTableColumnMeta,
  type DataTableFeatures,
  type DataTableProps,
}
