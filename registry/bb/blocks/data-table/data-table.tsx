"use client"

import * as React from "react"
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_includesString,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaginationBar } from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  filterFns: {
    equals: filterFn_equals,
    includesString: filterFn_includesString,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

type DataTableFeatures = typeof dataTableFeatures

/** The TanStack table instance, as passed to `filters`. */
type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>

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

// Clicks on these inside a clickable row do their own thing.
const interactiveSelector =
  "a, button, input, label, select, textarea, [role=button], [role=checkbox], [role=combobox], [role=menuitem]"

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

const allFilterValue = "__all__"

type DataTableSelectFilterProps<TData extends RowData> = {
  /** `table.getColumn("status")`; give that column `filterFn: "equals"`. */
  column: Column<DataTableFeatures, TData> | undefined
  /** Visible label before the select, e.g. `Status`. */
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  /** First option, which clears the filter. */
  allLabel?: string
  className?: string
}

/** A label and a size `sm` Select that filters one column on one value. */
function DataTableSelectFilter<TData extends RowData>({
  column,
  label,
  options,
  allLabel = "Alle",
  className,
}: DataTableSelectFilterProps<TData>) {
  const id = React.useId()
  const filterValue = column?.getFilterValue()
  const value = typeof filterValue === "string" ? filterValue : allFilterValue

  return (
    <div
      data-slot="data-table-select-filter"
      className={cn("flex items-center gap-2", className)}
    >
      <label
        htmlFor={id}
        className="text-sm whitespace-nowrap text-muted-foreground"
      >
        {label}
      </label>
      <Select
        value={value}
        disabled={!column}
        onValueChange={(next) =>
          column?.setFilterValue(next === allFilterValue ? undefined : next)
        }
      >
        <SelectTrigger id={id} size="sm" className="w-auto min-w-18">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allFilterValue}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
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

  /**
   * Filter controls (`DataTableSelectFilter`) in one 32px row with the search
   * field (label visually hidden) and "Filters wissen" while a filter is active.
   */
  filters?: (table: DataTableInstance<TData>) => React.ReactNode
  resetFiltersLabel?: string
  columnFilters?: ColumnFiltersState
  defaultColumnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>

  /** Adds the pagination bar under the table: range text, page size and pages. */
  paginated?: boolean
  pagination?: PaginationState
  /** Initial page; `pageSize` defaults to the first of `pageSizeOptions`. */
  defaultPagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageSizeOptions?: ReadonlyArray<number>
  /** Server mode: `data` is the current page and `rowCount` the total. */
  manualPagination?: boolean
  /** Total number of rows on the server after search and filters, in server mode. */
  rowCount?: number
  /**
   * Server mode with `manualFiltering`: the total without search and filters,
   * for the result count (`3 van 1284`). Defaults to `rowCount`.
   */
  totalRowCount?: number
  /** The server sorts: sorting only updates the state. */
  manualSorting?: boolean
  /**
   * The server filters: search and filters only update the state. In server
   * mode a search or filter change goes back to the first page.
   */
  manualFiltering?: boolean
  /** Accessible name of the page navigation, e.g. `Paginering facturen`. */
  paginationLabel?: string
  pageSizeLabel?: string
  /** Range text, e.g. `21–30 van 248`. */
  rangeLabel?: (from: number, to: number, total: number) => string

  /**
   * Makes rows clickable as a mouse shortcut (to open a Sheet). Clicks on
   * links, buttons and fields in the row are ignored; keep a real button in
   * the row header for keyboard users.
   */
  onRowClick?: (row: TData) => void
  /** Row id of the record whose details are open: tinted brand-ice. */
  activeRowId?: string

  /** Shows skeleton rows under the headers. */
  loading?: boolean
  /** Status text announced while loading. */
  loadingLabel?: string
  /** Number of skeleton rows; the page size when paginated, otherwise 4. */
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
  filters,
  resetFiltersLabel = "Filters wissen",
  columnFilters,
  defaultColumnFilters = [],
  onColumnFiltersChange,
  paginated = false,
  pagination,
  defaultPagination,
  onPaginationChange,
  pageSizeOptions = [10, 25, 50],
  manualPagination = false,
  rowCount,
  totalRowCount,
  manualSorting = false,
  manualFiltering = false,
  paginationLabel,
  pageSizeLabel,
  rangeLabel,
  onRowClick,
  activeRowId,
  loading = false,
  loadingLabel = "Laden…",
  loadingRows,
  empty,
  noResults,
}: DataTableProps<TData>) {
  const captionId = React.useId()
  const searchId = React.useId()
  const searchRef = React.useRef<HTMLInputElement>(null)
  const filtersRef = React.useRef<HTMLDivElement>(null)

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
  const [filterValue, setFilterValue] = useTableSlice(
    globalFilter,
    defaultGlobalFilter,
    onGlobalFilterChange
  )
  const [columnFiltersState, setColumnFiltersState] = useTableSlice(
    columnFilters,
    defaultColumnFilters,
    onColumnFiltersChange
  )
  const [paginationState, setPagination] = useTableSlice(
    pagination,
    defaultPagination ?? { pageIndex: 0, pageSize: pageSizeOptions[0] ?? 10 },
    onPaginationChange
  )

  // TanStack only resets the page itself in client mode: in server mode a
  // new search or filter starts on the first page too.
  const isServerPaged = paginated && manualPagination
  function toFirstPage() {
    if (isServerPaged && paginationState.pageIndex !== 0) {
      setPagination((current) => ({ ...current, pageIndex: 0 }))
    }
  }
  const setGlobalFilter: OnChangeFn<string> = (updater) => {
    setFilterValue(updater)
    toFirstPage()
  }
  const setColumnFilters: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFiltersState(updater)
    toFirstPage()
  }

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
    // Without the bar, the pagination feature passes every row through.
    manualPagination: !paginated || manualPagination,
    ...(manualPagination && rowCount !== undefined && { rowCount }),
    manualSorting,
    manualFiltering,
    state: {
      sorting: sortingState,
      rowSelection: selectionState,
      globalFilter: filterValue,
      columnFilters: columnFiltersState,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  })

  const rows = table.getRowModel().rows
  // Rows loaded in the browser: all rows, or the current page in server mode.
  const loadedCount = table.getCoreRowModel().rows.length
  // In server mode the counts come from the server, not from the loaded page.
  const serverCount = isServerPaged ? rowCount : undefined
  const hasServerCount = serverCount !== undefined
  const totalCount =
    serverCount === undefined
      ? loadedCount
      : manualFiltering
        ? (totalRowCount ?? serverCount)
        : serverCount
  const shownCount =
    serverCount !== undefined && manualFiltering
      ? serverCount
      : table.getFilteredRowModel().rows.length
  const selectedRows = table.getSelectedRowModel().rows
  const leafColumns = table.getAllLeafColumns()
  const columnCount = leafColumns.length + (selectable ? 1 : 0)
  const allSelected = table.getIsAllRowsSelected()
  const someSelected = table.getIsSomeRowsSelected()
  const isFocusable = focusable ?? loading
  const skeletonRows = loadingRows ?? (paginated ? paginationState.pageSize : 4)
  const hasActiveFilter = filterValue !== "" || columnFiltersState.length > 0
  const emptyState =
    totalCount > 0 || (hasServerCount && hasActiveFilter)
      ? (noResults ?? empty)
      : empty
  const pagedRowCount = table.getRowCount()

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
          {Array.from({ length: skeletonRows }, (_, rowIndex) => (
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
              active={activeRowId !== undefined && row.id === activeRowId}
              className={cn(onRowClick && "cursor-pointer")}
              onClick={
                onRowClick &&
                ((event) => {
                  const target = event.target
                  // Ignore controls in the row and clicks inside portals.
                  if (
                    !(target instanceof Element) ||
                    !event.currentTarget.contains(target) ||
                    target.closest(interactiveSelector)
                  ) {
                    return
                  }
                  onRowClick(row.original)
                })
              }
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
  const showSelectionBar = selectable && !loading && loadedCount > 0
  const showPagination = paginated && (loading || pagedRowCount > 0)

  // The reset button disappears: focus the search field, or else the first
  // control in the filter row.
  function resetFilters() {
    table.setGlobalFilter("")
    table.setColumnFilters([])
    const target =
      searchRef.current ??
      filtersRef.current?.querySelector<HTMLElement>(
        "button:not([data-slot=data-table-reset-filters]), input"
      )
    target?.focus()
  }

  function renderSearchInput(inputClassName?: string) {
    return (
      <Input
        ref={searchRef}
        id={searchId}
        type="search"
        leadingIcon={SearchIcon}
        autoComplete="off"
        spellCheck={false}
        placeholder={search?.placeholder}
        value={filterValue}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className={inputClassName}
      />
    )
  }

  // One wrapper in every state, so toggling `loading` never remounts the
  // table (scroll position and focus stay).
  return (
    <div
      data-slot="data-table"
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      {filters ? (
        <div
          ref={filtersRef}
          data-slot="data-table-filters"
          className="flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          {search && (
            <div
              data-slot="data-table-search"
              className="max-w-80 min-w-0 flex-[1_1_12.5rem]"
            >
              <label htmlFor={searchId} className="sr-only">
                {search.label}
              </label>
              {renderSearchInput("h-8")}
            </div>
          )}
          {filters(table)}
          {hasActiveFilter && (
            <Button
              data-slot="data-table-reset-filters"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              <XIcon aria-hidden="true" />
              {resetFiltersLabel}
            </Button>
          )}
          {toolbar}
        </div>
      ) : (
        hasToolbar && (
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
                {renderSearchInput()}
              </div>
            )}
            {toolbar}
          </div>
        )
      )}
      {(search || filters) && (
        <p
          data-slot="data-table-count"
          role="status"
          className="text-sm text-muted-foreground tabular-nums"
        >
          {resultCountLabel(loading ? 0 : shownCount, totalCount)}
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
            {/* Selection covers the loaded rows: the current page in server mode. */}
            {selectionCountLabel(selectedRows.length, loadedCount)}
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
      {showPagination && (
        <PaginationBar
          data-slot="data-table-pagination"
          page={paginationState.pageIndex + 1}
          pageSize={paginationState.pageSize}
          totalCount={pagedRowCount}
          pageSizeOptions={pageSizeOptions}
          label={paginationLabel}
          pageSizeLabel={pageSizeLabel}
          rangeLabel={rangeLabel}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(pageSize) =>
            // Keep the first visible row on the new page.
            table.setPagination((current) => ({
              pageIndex: Math.floor(
                (current.pageIndex * current.pageSize) / pageSize
              ),
              pageSize,
            }))
          }
        />
      )}
    </div>
  )
}

export {
  DataTable,
  DataTableSelectFilter,
  createDataTableColumnHelper,
  dataTableFeatures,
  type DataTableColumnMeta,
  type DataTableFeatures,
  type DataTableInstance,
  type DataTableProps,
  type DataTableSelectFilterProps,
}
