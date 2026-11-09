# DataTable

A bordered table for records, with sortable headers, row selection, row actions, status badges, right-aligned numbers, filters, pagination (client side or from the server) and rows that open a detail page or panel. Built on `@tanstack/react-table` v9 and a set of styled table primitives.

## When to use

- Records people compare, sort or act on.
- Admin overviews with row actions or bulk actions.
- Numbers that must line up in columns.

## When not to use

- Two columns or nothing to compare: use a list.
- Items with images or long text: use cards.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/data-table#v0.2.0
```

This adds `components/data-table/data-table.tsx` (the `DataTable` component) and `components/data-table/table.tsx` (the table primitives), plus Button, Checkbox, Input, Label, Pagination, Select, Skeleton and EmptyState. Add Badge yourself for status cells, DropdownMenu for a row actions menu and Sheet for a detail panel.

## Usage

```tsx
import { PencilIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  createDataTableColumnHelper,
} from "@/components/data-table/data-table"
import {
  TableCellDescription,
  TableRowActions,
} from "@/components/data-table/table"

type Invoice = {
  number: string
  issued: string
  client: string
  amount: number
  paid: boolean
}

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
})

// Keep columns at module scope (or memoised) so the table does not rebuild every render.
const helper = createDataTableColumnHelper<Invoice>()
const columns = helper.columns([
  helper.accessor("number", {
    header: "Factuur",
    meta: { rowHeader: true },
    cell: ({ row }) => (
      <>
        {row.original.number}
        <TableCellDescription>{row.original.issued}</TableCellDescription>
      </>
    ),
  }),
  helper.accessor("client", { header: "Klant", enableSorting: true }),
  helper.accessor("amount", {
    header: "Bedrag",
    enableSorting: true,
    meta: { align: "end" },
    cell: ({ row }) => euro.format(row.original.amount),
  }),
  helper.accessor("paid", {
    header: "Status",
    cell: ({ row }) =>
      row.original.paid ? (
        <Badge variant="success">Betaald</Badge>
      ) : (
        <Badge>Verzonden</Badge>
      ),
  }),
  helper.display({
    id: "actions",
    header: () => <span className="sr-only">Acties</span>,
    meta: { shrink: true },
    cell: ({ row }) => (
      <TableRowActions>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Bewerken: factuur ${row.original.number}`}
        >
          <PencilIcon aria-hidden="true" />
        </Button>
      </TableRowActions>
    ),
  }),
])

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <DataTable
      caption="Facturen, gesorteerd op klant"
      columns={columns}
      data={invoices}
      getRowId={(invoice) => invoice.number}
      defaultSorting={[{ id: "client", desc: false }]}
      search={{ label: "Zoek een factuur" }}
      resultCountLabel={(shown, total) => `${shown} van ${total} facturen`}
      selectable
      getRowSelectLabel={(invoice) => `Selecteer factuur ${invoice.number}`}
      bulkActions={(selected) => (
        <Button size="sm">Markeer als betaald ({selected.length})</Button>
      )}
      empty={{
        title: "Nog geen facturen",
        description: "Facturen die je aanmaakt, komen hier te staan.",
      }}
    />
  )
}
```

### Pagination

Client side: `paginated` adds the bar under the table (range text, page size, size `sm` page buttons). Page size options default to 10, 25 and 50.

```tsx
<DataTable
  caption="Facturen"
  columns={columns}
  data={invoices}
  paginated
  paginationLabel="Paginering facturen"
/>
```

Server mode: `data` is the current page, `rowCount` the total from the server, and `onPaginationChange` loads the next page. While it loads, set `loading`: the pager already shows the new page and skeleton rows keep the table height.

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const { data, isLoading } = useInvoicePage(pagination) // your data hook

<DataTable
  caption={`Facturen, pagina ${pagination.pageIndex + 1}`}
  columns={columns}
  data={data?.rows ?? []}
  paginated
  manualPagination
  rowCount={data?.total ?? 0}
  pagination={pagination}
  onPaginationChange={setPagination}
  loading={isLoading}
  loadingLabel={`Pagina ${pagination.pageIndex + 1} laden…`}
/>
```

Set `manualSorting` and `manualFiltering` too when the server also sorts and searches. With `manualFiltering`, pass the filtered total as `rowCount` and the unfiltered total as `totalRowCount`: the result count reads `3 van 1284`. A new search or filter goes back to the first page (TanStack only does that itself in client mode), so `onPaginationChange` is called with `pageIndex` 0. Selection covers the loaded rows only: in server mode, select-all and the selection count apply to the current page.

### Toolbar filters

`filters` puts the search field (label visually hidden, 32px), your filter controls and a "Filters wissen" button (only while a filter is active) in one row. `DataTableSelectFilter` binds a size `sm` Select to one column; give that column `filterFn: "equals"`.

```tsx
import {
  DataTable,
  DataTableSelectFilter,
} from "@/components/data-table/data-table"

const columns = helper.columns([
  // ...
  helper.accessor("status", { header: "Status", filterFn: "equals" }),
])

<DataTable
  caption="Facturen"
  columns={columns}
  data={invoices}
  search={{ label: "Zoek een factuur", placeholder: "Zoek op factuur of klant" }}
  filters={(table) => (
    <DataTableSelectFilter
      column={table.getColumn("status")}
      label="Status"
      options={[
        { value: "overdue", label: "Te laat" },
        { value: "paid", label: "Betaald" },
      ]}
    />
  )}
  resultCountLabel={(shown, total) => `${shown} van ${total} facturen`}
/>
```

### Row opens a detail page

Put a `TableLink` in the row header cell. It is the only tab stop in the row.

```tsx
helper.accessor("number", {
  header: "Factuur",
  meta: { rowHeader: true, nowrap: true },
  cell: ({ row }) => (
    <TableLink href={`/facturen/${row.original.number}`}>
      {row.original.number}
    </TableLink>
  ),
})
```

With a client-side router, give `TableLink` the route as `href` and navigate in `onClick` (prevent the default first), so the link still works when opened in a new tab.

### Row opens a Sheet

`onRowClick` makes the whole row a mouse shortcut and `activeRowId` tints the open row brand-ice. Keep a real `TableLinkButton` in the row header for keyboard users, with `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` pointing at the Sheet. Cells that depend on the open record should read it from context, so the columns stay stable. Without a `SheetTrigger`, return focus to the row's button yourself in `onCloseAutoFocus`.

```tsx
const [openId, setOpenId] = useState<string>()

<DataTable
  caption="Facturen; klik op een rij voor de details"
  columns={columns}
  data={invoices}
  getRowId={(invoice) => invoice.number}
  onRowClick={(invoice) => setOpenId(invoice.number)}
  activeRowId={openId}
/>
<Sheet open={openId !== undefined} onOpenChange={(open) => !open && setOpenId(undefined)}>
  <SheetContent id={sheetId} onCloseAutoFocus={returnFocusToRowButton}>
    <SheetHeader>
      <SheetTitle>Factuur {openId}</SheetTitle>
    </SheetHeader>
    <SheetBody aria-busy={loading || undefined}>
      <p role="status" className="sr-only">{loading ? "Factuur laden…" : ""}</p>
      {loading ? <Skeleton width="60" /> : <InvoiceDetails id={openId} />}
    </SheetBody>
  </SheetContent>
</Sheet>
```

### Row actions menu

A ghost `icon-sm` button with `EllipsisIcon` opens a DropdownMenu aligned to its end edge. Use `modal={false}` in tables, so the other rows' buttons are not left focusable inside a hidden page while the menu is open.

```tsx
helper.display({
  id: "actions",
  header: () => <span className="sr-only">Acties</span>,
  meta: { shrink: true },
  cell: ({ row }) => (
    <TableRowActions>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Acties: factuur ${row.original.number}`}
          >
            <EllipsisIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Factuur {row.original.number}</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilIcon aria-hidden="true" />
            Bewerken
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Verwijderen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableRowActions>
  ),
})
```

For a table without TanStack (a static summary, a hand-built layout), use the primitives from `table.tsx` directly: `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableRowHeader`, `TableCell`, `TableCellDescription`, `TableSortButton`, `TableRowActions`, `TableLink` and `TableLinkButton`.

## Props

### DataTable

| Prop                   | Type                                                      | Default                | Notes                                                                                                                                             |
| ---------------------- | --------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`              | `ColumnDef[]` from `createDataTableColumnHelper<TData>()` | required               | Sorting is off unless a column sets `enableSorting: true`. Column options go in `meta` (below).                                                   |
| `data`                 | `TData[]`                                                 | required               | Keep the array stable between renders.                                                                                                            |
| `caption`              | `string`                                                  | required               | Visually hidden caption. Also names the frame when it is focusable.                                                                               |
| `getRowId`             | `(row, index) => string`                                  | row index              | Use a stable id; selection is stored by id.                                                                                                       |
| `density`              | `"default" \| "dense"`                                    | `"default"`            | Dense cells are 8px by 12px instead of 12px by 16px.                                                                                              |
| `focusable`            | `boolean`                                                 | `true` while `loading` | Makes the scroll frame a focusable region (`tabIndex=0`, `role="region"`, named by the caption).                                                  |
| `sorting`              | `SortingState`                                            |                        | Controlled sorting, with `onSortingChange`.                                                                                                       |
| `defaultSorting`       | `SortingState`                                            | `[]`                   | Initial sorting, e.g. `[{ id: "client", desc: false }]`.                                                                                          |
| `onSortingChange`      | `OnChangeFn<SortingState>`                                |                        | Called with the TanStack updater.                                                                                                                 |
| `selectable`           | `boolean`                                                 | `false`                | Adds a checkbox column and the selection bar.                                                                                                     |
| `rowSelection`         | `RowSelectionState`                                       |                        | Controlled selection (`{ [rowId]: true }`), with `onRowSelectionChange`.                                                                          |
| `defaultRowSelection`  | `RowSelectionState`                                       | `{}`                   | Initial selection.                                                                                                                                |
| `onRowSelectionChange` | `OnChangeFn<RowSelectionState>`                           |                        |                                                                                                                                                   |
| `getRowSelectLabel`    | `(row, index) => string`                                  | `Selecteer rij n`      | Accessible name of each row checkbox; `index` is the visible position after sorting and filtering. Name the record: `Selecteer factuur 2026-041`. |
| `selectColumnLabel`    | `string`                                                  | `"Selecteren"`         | Visually hidden header of the checkbox column.                                                                                                    |
| `selectAllLabel`       | `string`                                                  | `"Alles selecteren"`   | Label of the select-all checkbox in the selection bar.                                                                                            |
| `selectionCountLabel`  | `(selected, total) => string`                             | `n van m geselecteerd` | Text of the selection status.                                                                                                                     |
| `bulkActions`          | `(selectedRows: TData[]) => ReactNode`                    |                        | Buttons (`size="sm"`) shown in the selection bar while rows are selected.                                                                         |
| `search`               | `{ label: string; placeholder?: string }`                 |                        | Adds a search field that filters all text and number columns, and the result count.                                                               |
| `globalFilter`         | `string`                                                  |                        | Controlled search text, with `onGlobalFilterChange`.                                                                                              |
| `defaultGlobalFilter`  | `string`                                                  | `""`                   | Initial search text.                                                                                                                              |
| `onGlobalFilterChange` | `OnChangeFn<string>`                                      |                        |                                                                                                                                                   |
| `resultCountLabel`     | `(shown, total) => string`                                | `n van m`              | Result count under the toolbar: `2 van 48 facturen`.                                                                                              |
| `toolbar`              | `ReactNode`                                               |                        | Extra controls in the toolbar row, after the search field (filters, a primary button).                                                            |
| `loading`              | `boolean`                                                 | `false`                | Shows skeleton rows under the headers.                                                                                                            |
| `loadingLabel`         | `string`                                                  | `"Laden…"`             | Announced through a visually hidden `role="status"` while loading.                                                                                |
| `loadingRows`          | `number`                                                  | page size or `4`       | Number of skeleton rows: the page size when paginated, otherwise 4.                                                                               |
| `empty`                | `EmptyState` props                                        |                        | Shown inset (no dashed border) across all columns when there is no data.                                                                          |
| `noResults`            | `EmptyState` props                                        | `empty`                | Shown when the search leaves no rows.                                                                                                             |
| `filters`              | `(table) => ReactNode`                                    |                        | Filter controls in one 32px row with the search field (label visually hidden) and "Filters wissen" while a filter is active.                      |
| `resetFiltersLabel`    | `string`                                                  | `"Filters wissen"`     | Clears the search and every column filter, then focuses the search (or first filter).                                                             |
| `columnFilters`        | `ColumnFiltersState`                                      |                        | Controlled column filters, with `onColumnFiltersChange`.                                                                                          |
| `defaultColumnFilters` | `ColumnFiltersState`                                      | `[]`                   | Initial column filters, e.g. `[{ id: "status", value: "overdue" }]`.                                                                              |
| `paginated`            | `boolean`                                                 | `false`                | Adds the pagination bar under the table.                                                                                                          |
| `pagination`           | `{ pageIndex, pageSize }`                                 |                        | Controlled page (`pageIndex` starts at 0), with `onPaginationChange`.                                                                             |
| `defaultPagination`    | `{ pageIndex, pageSize }`                                 | first page             | Initial page; the page size defaults to the first of `pageSizeOptions`.                                                                           |
| `onPaginationChange`   | `OnChangeFn<PaginationState>`                             |                        | Called with the TanStack updater. In server mode, load the page here.                                                                             |
| `pageSizeOptions`      | `number[]`                                                | `[10, 25, 50]`         | Options of the page-size select. Changing the size keeps the first visible row on screen.                                                         |
| `manualPagination`     | `boolean`                                                 | `false`                | Server mode: `data` is the current page.                                                                                                          |
| `rowCount`             | `number`                                                  |                        | Total rows on the server after search and filters, in server mode. Drives the pager and the result count.                                         |
| `totalRowCount`        | `number`                                                  | `rowCount`             | Server mode with `manualFiltering`: the total without search and filters, for the result count (`3 van 1284`).                                    |
| `manualSorting`        | `boolean`                                                 | `false`                | The server sorts; sorting only updates the state.                                                                                                 |
| `manualFiltering`      | `boolean`                                                 | `false`                | The server filters; search and filters only update the state. In server mode they also go back to the first page.                                 |
| `paginationLabel`      | `string`                                                  | `"Paginering"`         | Name of the page navigation; name it after the table (`Paginering facturen`).                                                                     |
| `pageSizeLabel`        | `string`                                                  | `"Rijen per pagina"`   | Label of the page-size select.                                                                                                                    |
| `rangeLabel`           | `(from, to, total) => string`                             | `21–30 van 248`        | Range text, a status region.                                                                                                                      |
| `onRowClick`           | `(row: TData) => void`                                    |                        | Makes rows clickable (pointer cursor). Clicks on links, buttons, fields and menus in the row are ignored. A mouse shortcut only.                  |
| `activeRowId`          | `string`                                                  |                        | Row whose details are open: tinted brand-ice, no hover fill.                                                                                      |
| `className`            | `string`                                                  |                        | On the outer wrapper.                                                                                                                             |

### Column `meta`

| Key         | Type               | Notes                                                               |
| ----------- | ------------------ | ------------------------------------------------------------------- |
| `align`     | `"start" \| "end"` | `end` right-aligns header and cells with tabular figures (numbers). |
| `rowHeader` | `boolean`          | Renders the cell as `th scope="row"` (medium weight). One per row.  |
| `nowrap`    | `boolean`          | One line with tabular figures (dates).                              |
| `muted`     | `boolean`          | Muted text for secondary columns.                                   |
| `shrink`    | `boolean`          | Shrinks the column to its content (row actions).                    |

### Table primitives

| Part                   | Element          | Notes                                                                                                                         |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Table`                | `div` > `table`  | `density`, `containerProps` (props for the bordered scroll frame). Table is at least 640px wide.                              |
| `TableCaption`         | `caption`        | Visually hidden.                                                                                                              |
| `TableHeader`          | `thead`          | Holds the header row.                                                                                                         |
| `TableBody`            | `tbody`          | 1px dividers between rows.                                                                                                    |
| `TableFooter`          | `tfoot`          | Top border, medium weight; for totals.                                                                                        |
| `TableHead`            | `th scope="col"` | `align`, `nowrap`, `shrink`. Uppercase 12px muted header text.                                                                |
| `TableRowHeader`       | `th scope="row"` | `align`, `nowrap`, `shrink`.                                                                                                  |
| `TableCell`            | `td`             | `align`, `nowrap`, `shrink`, `muted`.                                                                                         |
| `TableRow`             | `tr`             | `interactive` (default `true`) adds the hover fill; set `false` for loading and empty rows. `active` tints the row brand-ice. |
| `TableLink`            | `a`              | Brand-cyan medium text, underline on hover (4px offset). For the row header link to a detail page.                            |
| `TableLinkButton`      | `button`         | The same look as a button, for a row header that opens a Sheet or Dialog.                                                     |
| `TableCellDescription` | `span`           | Second, muted 12px line under a value.                                                                                        |
| `TableSortButton`      | `button`         | `direction`: `"ascending" \| "descending" \| false`. Set `aria-sort` on the `TableHead` yourself.                             |
| `TableRowActions`      | `div`            | Right-aligned row of `icon-sm` ghost buttons; keeps the row 44px high.                                                        |

The block also exports `dataTableFeatures` (the registered TanStack features), `DataTableFeatures`, `DataTableColumnMeta`, `DataTableProps`, `DataTableInstance` (the table passed to `filters`), `DataTableSelectFilter` and `DataTableSelectFilterProps`.

### DataTableSelectFilter

| Prop        | Type                                 | Default  | Notes                                                               |
| ----------- | ------------------------------------ | -------- | ------------------------------------------------------------------- |
| `column`    | `Column \| undefined`                | required | `table.getColumn("status")`; the column needs `filterFn: "equals"`. |
| `label`     | `string`                             | required | Visible label before the select, muted 14px.                        |
| `options`   | `{ value: string; label: string }[]` | required |                                                                     |
| `allLabel`  | `string`                             | `"Alle"` | First option; clears the filter.                                    |
| `className` | `string`                             |          |                                                                     |

## Variants and states

- **Default:** card surface, 1px border, 12px corners. Header row: 12px semibold uppercase muted text with wide tracking and a bottom border. Body: 14px text, 12px by 16px cells, 1px row dividers, 44px rows.
- **Dense:** 8px by 12px cells, for numeric overviews.
- **Sortable header:** a button with the header text and a 14px icon (up-down when unsorted, an arrow when sorted). The sorted column is navy and its `th` carries `aria-sort`. Hover turns the text dark. Sorting cycles ascending, descending.
- **Row hover:** the `accent` fill. Loading and empty rows have no hover.
- **Numbers:** right-aligned, tabular figures, no wrapping.
- **Status:** Badge in a cell (`success` Betaald, `secondary` Verzonden, `destructive` Te laat, `outline` Concept).
- **Row actions:** `ghost` `icon-sm` buttons (32px), right-aligned, 8px apart.
- **Toolbar:** search field (label above, 36px input with a search icon, at most 448px wide), then the result count on its own line, then the table; 16px apart.
- **Selected rows:** rows stay white; the checkbox and the selection bar show the selection. The bar holds the select-all checkbox (indeterminate when some rows are selected), the count, and the bulk actions while anything is selected.
- **Loading:** headers stay, sort buttons and the selection bar are hidden, 4 rows of varied skeleton bars keep the 44px row height.
- **Empty:** EmptyState without its dashed border, spanning all columns; sort buttons are hidden.
- **Pagination:** the Pagination bar under the table, 16px below it: range text left; page size (32px select) and size `sm` page buttons right. Previous is disabled on the first page, next on the last.
- **Server pagination:** while a page loads, the pager already shows the new page and as many skeleton rows as the page size keep the table height.
- **Toolbar filters:** search (32px, at most 320px wide), inline-labelled Select size `sm`, and a ghost `sm` "Filters wissen" button with an X icon, 12px apart in one wrapping row; the count below.
- **Row link:** the record number in the row header as brand-cyan medium text, underlined on hover, with the focus ring.
- **Row opens a Sheet:** pointer cursor on the rows; the open row is tinted brand-ice.
- **Row actions menu:** a ghost `icon-sm` button with three dots that keeps its `accent` fill while the menu is open; the menu opens 4px below, aligned to the button's end edge.

## Accessibility

- Every table has a caption (visually hidden), `th scope="col"` headers and one `th scope="row"` per row (`meta.rowHeader`). Give the action column a visually hidden header (`<span className="sr-only">Acties</span>`).
- Sorting is a button inside the header; the header carries `aria-sort` and the arrow icon is `aria-hidden`.
- Name every row checkbox and icon button with the action and the record (`Selecteer factuur 2026-041`, `Bewerken: factuur 2026-041`). Checkboxes sit in a 24px target; row action buttons are 32px.
- The result count and the selection count are persistent `role="status"` regions, so changes are announced. While loading, a visually hidden status announces `loadingLabel`, the table has `aria-busy` and the skeleton rows are hidden from screen readers.
- The table scrolls inside its own frame on narrow screens. When the table has no controls, set `focusable` so keyboard users can scroll it: the frame becomes a focusable `region` named by the caption (on automatically while loading).
- Pagination follows the Pagination component: a `nav` named after the table (`paginationLabel`), `aria-current="page"` on the current page and named previous and next buttons that stay focusable when disabled. The range text is a status region. In server mode the table has `aria-busy` and `loadingLabel` is announced while a page loads.
- With `filters`, the search label is visually hidden but still names the field; every filter Select has a visible label. "Filters wissen" moves focus to the search field (or, without one, the first filter) when it disappears.
- A row link lives in the row header cell. A row that opens a Sheet keeps a real button there (`aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`); the row click is a mouse shortcut only. While the Sheet loads, set `aria-busy` on its body and announce the loading text.
- The row actions button is named with the record (`Acties: factuur 2026-044`) and gets `aria-haspopup="menu"` and `aria-expanded` from DropdownMenu.
- Every control shows the 2px focus ring with a 2px offset.
