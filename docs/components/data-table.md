# DataTable

A bordered table for records, with sortable headers, row selection, row actions, status badges and right-aligned numbers. Built on `@tanstack/react-table` v9 and a set of styled table primitives.

## When to use

- Records people compare, sort or act on.
- Admin overviews with row actions or bulk actions.
- Numbers that must line up in columns.

## When not to use

- Two columns or nothing to compare: use a list.
- Items with images or long text: use cards.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/data-table#v0.1.0
```

This adds `components/data-table/data-table.tsx` (the `DataTable` component) and `components/data-table/table.tsx` (the table primitives), plus Checkbox, Input, Label, Skeleton and EmptyState. Add Button and Badge yourself for row actions, bulk actions and status cells.

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

For a table without TanStack (a static summary, a hand-built layout), use the primitives from `table.tsx` directly: `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableRowHeader`, `TableCell`, `TableCellDescription`, `TableSortButton` and `TableRowActions`.

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
| `loadingRows`          | `number`                                                  | `4`                    | Number of skeleton rows.                                                                                                                          |
| `empty`                | `EmptyState` props                                        |                        | Shown inset (no dashed border) across all columns when there is no data.                                                                          |
| `noResults`            | `EmptyState` props                                        | `empty`                | Shown when the search leaves no rows.                                                                                                             |
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

| Part                   | Element          | Notes                                                                                             |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `Table`                | `div` > `table`  | `density`, `containerProps` (props for the bordered scroll frame). Table is at least 640px wide.  |
| `TableCaption`         | `caption`        | Visually hidden.                                                                                  |
| `TableHeader`          | `thead`          | Holds the header row.                                                                             |
| `TableBody`            | `tbody`          | 1px dividers between rows.                                                                        |
| `TableFooter`          | `tfoot`          | Top border, medium weight; for totals.                                                            |
| `TableHead`            | `th scope="col"` | `align`, `nowrap`, `shrink`. Uppercase 12px muted header text.                                    |
| `TableRowHeader`       | `th scope="row"` | `align`, `nowrap`, `shrink`.                                                                      |
| `TableCell`            | `td`             | `align`, `nowrap`, `shrink`, `muted`.                                                             |
| `TableRow`             | `tr`             | `interactive` (default `true`) adds the hover fill; set `false` for loading and empty rows.       |
| `TableCellDescription` | `span`           | Second, muted 12px line under a value.                                                            |
| `TableSortButton`      | `button`         | `direction`: `"ascending" \| "descending" \| false`. Set `aria-sort` on the `TableHead` yourself. |
| `TableRowActions`      | `div`            | Right-aligned row of `icon-sm` ghost buttons; keeps the row 44px high.                            |

The block also exports `dataTableFeatures` (the registered TanStack features), `DataTableFeatures`, `DataTableColumnMeta` and `DataTableProps`.

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

## Accessibility

- Every table has a caption (visually hidden), `th scope="col"` headers and one `th scope="row"` per row (`meta.rowHeader`). Give the action column a visually hidden header (`<span className="sr-only">Acties</span>`).
- Sorting is a button inside the header; the header carries `aria-sort` and the arrow icon is `aria-hidden`.
- Name every row checkbox and icon button with the action and the record (`Selecteer factuur 2026-041`, `Bewerken: factuur 2026-041`). Checkboxes sit in a 24px target; row action buttons are 32px.
- The result count and the selection count are persistent `role="status"` regions, so changes are announced. While loading, a visually hidden status announces `loadingLabel`, the table has `aria-busy` and the skeleton rows are hidden from screen readers.
- The table scrolls inside its own frame on narrow screens. When the table has no controls, set `focusable` so keyboard users can scroll it: the frame becomes a focusable `region` named by the caption (on automatically while loading).
- Every control shows the 2px focus ring with a 2px offset.
