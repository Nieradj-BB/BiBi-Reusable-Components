import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ColumnFiltersState } from "@tanstack/react-table"
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { expect, fn, waitFor, within } from "storybook/test"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DataTable,
  DataTableSelectFilter,
  createDataTableColumnHelper,
} from "@/components/data-table/data-table"
import {
  TableCellDescription,
  TableLink,
  TableLinkButton,
  TableRowActions,
} from "@/components/data-table/table"

const meta = {
  title: "Components/Data display/DataTable",
  component: DataTable,
} satisfies Meta

export default meta

// Stories render the table directly: DataTable is generic over the row type.
type Story = StoryObj

type InvoiceStatus = "paid" | "sent" | "overdue" | "draft"

type Invoice = {
  number: string
  issued: string
  client: string
  due: string
  amount: number
  status: InvoiceStatus
}

const months = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
]

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${months[month - 1]} ${year}`
}

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
})

const statusBadges: Record<
  InvoiceStatus,
  {
    label: string
    variant: "success" | "secondary" | "destructive" | "outline"
  }
> = {
  paid: { label: "Betaald", variant: "success" },
  sent: { label: "Verzonden", variant: "secondary" },
  overdue: { label: "Te laat", variant: "destructive" },
  draft: { label: "Concept", variant: "outline" },
}

const invoices: Invoice[] = [
  {
    number: "2026-041",
    issued: "2026-10-03",
    client: "Bakker Installatietechniek",
    due: "2026-11-02",
    amount: 4850,
    status: "paid",
  },
  {
    number: "2026-044",
    issued: "2026-10-09",
    client: "Dekker Logistiek",
    due: "2026-11-08",
    amount: 12300,
    status: "sent",
  },
  {
    number: "2026-038",
    issued: "2026-09-26",
    client: "Hofstede Advies",
    due: "2026-10-26",
    amount: 1275.5,
    status: "overdue",
  },
  {
    number: "2026-047",
    issued: "2026-10-21",
    client: "Jansen Bouw",
    due: "2026-11-20",
    amount: 9640,
    status: "draft",
  },
  {
    number: "2026-045",
    issued: "2026-10-14",
    client: "Kanaalzicht Zorg",
    due: "2026-11-13",
    amount: 3120,
    status: "paid",
  },
]

const otherClients = [
  "Brouwer Techniek",
  "Claassen Transport",
  "De Wit Interieur",
  "Evers Groep",
  "Franssen Metaal",
  "Groen Hoveniers",
  "Huisman Vastgoed",
  "IJzerman Elektra",
  "Koster Media",
  "Linden Zorg",
  "Meijer Bouw",
  "Nijland Catering",
  "Oosting Logistiek",
  "Peters Installaties",
  "Quist Architecten",
  "Roos Schilders",
  "Smit Techniek",
  "Timmer Dakwerken",
  "Uiterwijk Groep",
  "Veenstra Transport",
  "Willems Media",
]

const otherNumbers = [
  ...Array.from({ length: 37 }, (_, i) => i + 1),
  39,
  40,
  42,
  43,
  48,
]

const statusCycle: InvoiceStatus[] = ["paid", "sent", "paid", "draft"]

// 48 invoices in total; two clients match the search term "advies".
const manyInvoices: Invoice[] = [
  ...invoices,
  {
    number: "2026-046",
    issued: "2026-10-18",
    client: "Noorderlicht Advies",
    due: "2026-11-17",
    amount: 6400,
    status: "sent",
  },
  ...otherNumbers.map((n, i) => {
    const day = String((i % 27) + 1).padStart(2, "0")
    return {
      number: `2026-${String(n).padStart(3, "0")}`,
      issued: `2026-${n < 20 ? "08" : "09"}-${day}`,
      client: otherClients[i % otherClients.length],
      due: `2026-${n < 20 ? "09" : "10"}-${day}`,
      amount: 750 + ((i * 1375) % 11000),
      status: statusCycle[i % statusCycle.length],
    }
  }),
]

const helper = createDataTableColumnHelper<Invoice>()

const numberColumn = helper.accessor("number", {
  header: "Factuur",
  meta: { rowHeader: true },
  cell: ({ row }) => (
    <>
      {row.original.number}
      <TableCellDescription>
        <time dateTime={row.original.issued}>
          {formatDate(row.original.issued)}
        </time>
      </TableCellDescription>
    </>
  ),
})

const clientColumn = helper.accessor("client", {
  header: "Klant",
  enableSorting: true,
})

function dueColumn(sortable: boolean) {
  return helper.accessor("due", {
    header: "Vervaldatum",
    enableSorting: sortable,
    meta: { nowrap: true },
    cell: ({ row }) => (
      <time dateTime={row.original.due}>{formatDate(row.original.due)}</time>
    ),
  })
}

function amountColumn(sortable: boolean) {
  return helper.accessor("amount", {
    header: "Bedrag",
    enableSorting: sortable,
    meta: { align: "end" },
    cell: ({ row }) => euro.format(row.original.amount),
  })
}

const statusColumn = helper.accessor("status", {
  header: "Status",
  cell: ({ row }) => {
    const badge = statusBadges[row.original.status]
    return <Badge variant={badge.variant}>{badge.label}</Badge>
  },
})

const onEdit = fn()
const onDelete = fn()

const actionsColumn = helper.display({
  id: "actions",
  header: () => <span className="sr-only">Acties</span>,
  meta: { shrink: true },
  cell: ({ row }) => (
    <TableRowActions>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Bewerken: factuur ${row.original.number}`}
        onClick={() => onEdit(row.original.number)}
      >
        <PencilIcon aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Verwijderen: factuur ${row.original.number}`}
        onClick={() => onDelete(row.original.number)}
      >
        <Trash2Icon aria-hidden="true" />
      </Button>
    </TableRowActions>
  ),
})

const invoiceColumns = helper.columns([
  numberColumn,
  clientColumn,
  dueColumn(true),
  amountColumn(true),
  statusColumn,
  actionsColumn,
])

const selectableColumns = helper.columns([
  numberColumn,
  clientColumn,
  dueColumn(false),
  amountColumn(false),
  statusColumn,
])

const plainColumns = helper.columns([
  helper.accessor("number", { header: "Factuur" }),
  helper.accessor("client", { header: "Klant" }),
  helper.accessor("due", { header: "Vervaldatum" }),
  helper.accessor("amount", { header: "Bedrag", meta: { align: "end" } }),
  helper.accessor("status", { header: "Status" }),
])

const getInvoiceId = (invoice: Invoice) => invoice.number
const byClient = [{ id: "client", desc: false }]

function bodyRows(canvasElement: HTMLElement) {
  const [, ...rows] = within(canvasElement).getAllByRole("row")
  return rows
}

export const Default: Story = {
  render: () => (
    <DataTable
      caption="Facturen, gesorteerd op klant"
      columns={invoiceColumns}
      data={invoices}
      getRowId={getInvoiceId}
      defaultSorting={byClient}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const client = canvas.getByRole("columnheader", { name: "Klant" })
    const amount = canvas.getByRole("columnheader", { name: "Bedrag" })
    await expect(client).toHaveAttribute("aria-sort", "ascending")
    await expect(amount).not.toHaveAttribute("aria-sort")
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent(
      "Bakker Installatietechniek"
    )

    await userEvent.click(canvas.getByRole("button", { name: "Bedrag" }))
    await expect(amount).toHaveAttribute("aria-sort", "ascending")
    await expect(client).not.toHaveAttribute("aria-sort")
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent("1.275,50")

    await userEvent.click(canvas.getByRole("button", { name: "Bedrag" }))
    await expect(amount).toHaveAttribute("aria-sort", "descending")
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent("12.300,00")

    // Keyboard: Enter on the focused sort button sorts that column.
    const clientSort = canvas.getByRole("button", { name: "Klant" })
    clientSort.focus()
    await userEvent.keyboard("{Enter}")
    await expect(client).toHaveAttribute("aria-sort", "ascending")
    await expect(clientSort).toHaveFocus()
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent(
      "Bakker Installatietechniek"
    )
    await userEvent.keyboard(" ")
    await expect(client).toHaveAttribute("aria-sort", "descending")
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent(
      "Kanaalzicht Zorg"
    )
    await userEvent.keyboard("{Enter}")
    await expect(client).toHaveAttribute("aria-sort", "ascending")
    clientSort.blur()

    await userEvent.click(
      canvas.getByRole("button", { name: "Bewerken: factuur 2026-041" })
    )
    await expect(onEdit).toHaveBeenCalledWith("2026-041")
    canvas.getByRole("button", { name: "Bewerken: factuur 2026-041" }).blur()
  },
}

export const WithToolbar: Story = {
  name: "With toolbar",
  render: () => (
    <DataTable
      caption="Facturen die passen bij de zoekterm"
      columns={invoiceColumns}
      data={manyInvoices}
      getRowId={getInvoiceId}
      defaultSorting={byClient}
      search={{ label: "Zoek een factuur" }}
      defaultGlobalFilter="advies"
      resultCountLabel={(shown, total) => `${shown} van ${total} facturen`}
      noResults={{
        size: "compact",
        description: "Geen facturen die bij deze zoekterm passen.",
      }}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const search = canvas.getByRole("searchbox", { name: "Zoek een factuur" })
    // The first status is the count; the loading status follows it.
    const [count] = canvas.getAllByRole("status")
    await expect(search).toHaveValue("advies")
    await expect(count).toHaveTextContent("2 van 48 facturen")
    await expect(bodyRows(canvasElement)).toHaveLength(2)

    await userEvent.clear(search)
    await expect(count).toHaveTextContent("48 van 48 facturen")

    await userEvent.type(search, "xyz")
    await expect(count).toHaveTextContent("0 van 48 facturen")
    await expect(
      canvas.getByText("Geen facturen die bij deze zoekterm passen.")
    ).toBeVisible()

    await userEvent.clear(search)
    await userEvent.type(search, "advies")
    await expect(count).toHaveTextContent("2 van 48 facturen")
    const rows = bodyRows(canvasElement)
    await expect(rows[0]).toHaveTextContent("Hofstede Advies")
    await expect(rows[1]).toHaveTextContent("Noorderlicht Advies")
    search.blur()
  },
}

export const RowHoverAndFocus: Story = {
  name: "Row hover and focus",
  render: () => (
    <DataTable
      caption="Facturen"
      columns={invoiceColumns}
      data={invoices.slice(0, 3)}
      getRowId={getInvoiceId}
      defaultSorting={byClient}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Vervaldatum" }))
    await userEvent.hover(bodyRows(canvasElement)[1])

    canvas
      .getByRole("button", { name: "Verwijderen: factuur 2026-041" })
      .focus()
    await userEvent.tab()
    const edit = canvas.getByRole("button", {
      name: "Bewerken: factuur 2026-044",
    })
    await expect(edit).toHaveFocus()
    await expect(edit).toHaveClass("focus-visible:outline-2")
  },
}

const onMarkPaid = fn()
const onDeleteSelected = fn()

export const SelectedRows: Story = {
  name: "Selected rows",
  render: () => (
    <DataTable
      caption="Facturen, selecteerbaar"
      columns={selectableColumns}
      data={invoices}
      getRowId={getInvoiceId}
      defaultSorting={byClient}
      selectable
      defaultRowSelection={{ "2026-044": true, "2026-038": true }}
      getRowSelectLabel={(invoice) => `Selecteer factuur ${invoice.number}`}
      bulkActions={(selected) => (
        <>
          <Button size="sm" onClick={() => onMarkPaid(selected.length)}>
            <CheckIcon aria-hidden="true" />
            Markeer als betaald ({selected.length})
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteSelected(selected.length)}
          >
            <Trash2Icon aria-hidden="true" />
            Verwijderen ({selected.length})
          </Button>
        </>
      )}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Alles selecteren" })
    // The first status is the count; the loading status follows it.
    const [count] = canvas.getAllByRole("status")
    await expect(selectAll).toHaveAttribute("aria-checked", "mixed")
    await expect(count).toHaveTextContent("2 van 5 geselecteerd")
    await expect(
      canvas.getByRole("checkbox", { name: "Selecteer factuur 2026-044" })
    ).toBeChecked()

    const jansen = canvas.getByRole("checkbox", {
      name: "Selecteer factuur 2026-047",
    })
    // The 24px square around the checkbox is a label, so all of it toggles.
    await expect(jansen.parentElement?.tagName).toBe("LABEL")
    await userEvent.click(jansen)
    await expect(count).toHaveTextContent("3 van 5 geselecteerd")
    await userEvent.click(
      canvas.getByRole("button", { name: "Markeer als betaald (3)" })
    )
    await expect(onMarkPaid).toHaveBeenCalledWith(3)
    await userEvent.click(jansen)

    await userEvent.click(selectAll)
    await expect(count).toHaveTextContent("5 van 5 geselecteerd")
    await expect(selectAll).toBeChecked()

    // Keyboard: Space toggles the focused checkbox.
    selectAll.focus()
    await userEvent.keyboard(" ")
    await expect(count).toHaveTextContent("0 van 5 geselecteerd")
    await expect(selectAll).toHaveAttribute("aria-checked", "false")
    await expect(
      canvas.queryByRole("button", { name: /Verwijderen/ })
    ).toBeNull()

    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Selecteer factuur 2026-044" })
    )
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Selecteer factuur 2026-038" })
    )
    await expect(count).toHaveTextContent("2 van 5 geselecteerd")
    await expect(
      canvas.getByRole("button", { name: "Verwijderen (2)" })
    ).toBeVisible()
    canvas.getByRole("checkbox", { name: "Selecteer factuur 2026-038" }).blur()
  },
}

export const Loading: Story = {
  render: () => (
    <DataTable
      caption="Facturen"
      columns={plainColumns}
      data={[]}
      loading
      loadingLabel="Facturen laden…"
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Facturen laden…"
    )
    await expect(canvas.getByRole("table", { hidden: true })).toHaveAttribute(
      "aria-busy",
      "true"
    )
    await expect(
      canvas.getAllByRole("columnheader").map((th) => th.textContent)
    ).toEqual(["Factuur", "Klant", "Vervaldatum", "Bedrag", "Status"])
  },
}

const onCreateInvoice = fn()

export const Empty: Story = {
  render: () => (
    <DataTable
      caption="Facturen"
      columns={plainColumns}
      data={[]}
      empty={{
        icon: FileTextIcon,
        title: "Nog geen facturen",
        description: "Facturen die je aanmaakt, komen hier te staan.",
        action: (
          <Button onClick={onCreateInvoice}>
            <PlusIcon aria-hidden="true" />
            Nieuwe factuur
          </Button>
        ),
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Nog geen facturen")).toBeVisible()
    await expect(canvas.getByRole("cell")).toHaveAttribute("colspan", "5")
    const button = canvas.getByRole("button", { name: "Nieuwe factuur" })
    await userEvent.click(button)
    await expect(onCreateInvoice).toHaveBeenCalled()
    button.blur()
  },
}

type Timesheet = {
  name: string
  project: string
  hours: [number, number, number, number, number]
}

const timesheets: Timesheet[] = [
  {
    name: "Sanne de Jong",
    project: "Herinrichting portaal",
    hours: [8, 7.5, 8, 6, 4],
  },
  {
    name: "Mehmet Yilmaz",
    project: "Migratie archief",
    hours: [6, 8, 8, 8, 8],
  },
  {
    name: "Lotte Visser",
    project: "Herinrichting portaal",
    hours: [4, 4, 0, 4, 4],
  },
  { name: "Daan Mulder", project: "Klantportaal", hours: [8, 8, 7, 8, 5.5] },
]

const hoursFormat = new Intl.NumberFormat("nl-NL")
const timesheetHelper = createDataTableColumnHelper<Timesheet>()
const dayColumns = (["Ma", "Di", "Wo", "Do", "Vr"] as const).map((day, i) =>
  timesheetHelper.accessor((row) => row.hours[i], {
    id: day,
    header: day,
    meta: { align: "end" },
    cell: (info) => hoursFormat.format(info.getValue()),
  })
)

const timesheetColumns = timesheetHelper.columns([
  timesheetHelper.accessor("name", {
    header: "Medewerker",
    meta: { rowHeader: true },
  }),
  timesheetHelper.accessor("project", {
    header: "Project",
    meta: { muted: true },
  }),
  ...dayColumns,
  timesheetHelper.accessor(
    (row) => row.hours.reduce((sum, hours) => sum + hours, 0),
    {
      id: "total",
      header: "Totaal",
      meta: { align: "end" },
      cell: (info) => hoursFormat.format(info.getValue()),
    }
  ),
])

export const Dense: Story = {
  render: () => (
    <DataTable
      caption="Uren per medewerker, week 45"
      columns={timesheetColumns}
      data={timesheets}
      getRowId={(row) => row.name}
      density="dense"
      focusable
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = canvas.getByRole("region", {
      name: "Uren per medewerker, week 45",
    })
    await userEvent.tab()
    await expect(region).toHaveFocus()
    await expect(
      canvas.getByRole("rowheader", { name: "Sanne de Jong" })
    ).toBeVisible()
    const lotte = canvas.getByRole("row", { name: /Lotte Visser/ })
    await expect(within(lotte).getAllByRole("cell").at(-1)).toHaveTextContent(
      "16"
    )
    region.blur()
  },
}

// The ten newest invoices as the pagination and filter examples show them,
// then 38 older ones: 48 in total, two of them overdue.
const recentInvoices: Invoice[] = [
  {
    number: "2026-048",
    issued: "2026-10-24",
    client: "Smit Transport",
    due: "2026-11-23",
    amount: 2180,
    status: "draft",
  },
  {
    number: "2026-047",
    issued: "2026-10-21",
    client: "Jansen Bouw",
    due: "2026-11-20",
    amount: 9640,
    status: "sent",
  },
  {
    number: "2026-046",
    issued: "2026-10-18",
    client: "Noorderlicht Advies",
    due: "2026-11-17",
    amount: 6400,
    status: "sent",
  },
  {
    number: "2026-045",
    issued: "2026-10-14",
    client: "Kanaalzicht Zorg",
    due: "2026-11-13",
    amount: 3120,
    status: "paid",
  },
  {
    number: "2026-044",
    issued: "2026-10-09",
    client: "Dekker Logistiek",
    due: "2026-11-08",
    amount: 12300,
    status: "sent",
  },
  {
    number: "2026-043",
    issued: "2026-10-07",
    client: "De Vries Architecten",
    due: "2026-11-06",
    amount: 5025,
    status: "paid",
  },
  {
    number: "2026-042",
    issued: "2026-10-05",
    client: "Gemeente Westerveld",
    due: "2026-11-04",
    amount: 18750,
    status: "paid",
  },
  {
    number: "2026-041",
    issued: "2026-10-03",
    client: "Bakker Installatietechniek",
    due: "2026-11-02",
    amount: 4850,
    status: "paid",
  },
  {
    number: "2026-040",
    issued: "2026-09-30",
    client: "Van Dijk Installatietechniek",
    due: "2026-10-30",
    amount: 2640,
    status: "overdue",
  },
  {
    number: "2026-039",
    issued: "2026-09-28",
    client: "Hofstede Advies",
    due: "2026-10-28",
    amount: 1980,
    status: "paid",
  },
  {
    number: "2026-038",
    issued: "2026-09-26",
    client: "Hofstede Advies",
    due: "2026-10-26",
    amount: 1275.5,
    status: "overdue",
  },
]

const pagedInvoices: Invoice[] = [
  ...recentInvoices,
  ...Array.from({ length: 37 }, (_, i) => {
    const n = 37 - i
    const day = String((n % 27) + 1).padStart(2, "0")
    return {
      number: `2026-${String(n).padStart(3, "0")}`,
      issued: `2026-${n < 20 ? "07" : "08"}-${day}`,
      client: otherClients[i % otherClients.length],
      due: `2026-${n < 20 ? "08" : "09"}-${day}`,
      amount: 750 + ((i * 1375) % 11000),
      status: statusCycle[i % statusCycle.length],
    }
  }),
]

const statusOptions = (
  Object.entries(statusBadges) as [InvoiceStatus, { label: string }][]
).map(([value, badge]) => ({ value, label: badge.label }))

const listColumns = helper.columns([
  helper.accessor("number", {
    header: "Factuur",
    meta: { rowHeader: true, nowrap: true },
  }),
  helper.accessor("client", { header: "Klant" }),
  dueColumn(false),
  amountColumn(false),
  helper.accessor("status", {
    header: "Status",
    filterFn: "equals",
    cell: ({ row }) => {
      const badge = statusBadges[row.original.status]
      return <Badge variant={badge.variant}>{badge.label}</Badge>
    },
  }),
])

function pageButtons(canvas: ReturnType<typeof within>) {
  const nav = canvas.getByRole("navigation", { name: "Paginering facturen" })
  return within(nav)
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-label") ?? button.textContent)
}

export const Pagination: Story = {
  render: function Render() {
    const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: 10,
    })
    const pageCount = Math.ceil(pagedInvoices.length / pagination.pageSize)
    return (
      <DataTable
        caption={`Facturen, pagina ${pagination.pageIndex + 1} van ${pageCount}`}
        columns={listColumns}
        data={pagedInvoices}
        getRowId={getInvoiceId}
        paginated
        pagination={pagination}
        onPaginationChange={setPagination}
        paginationLabel="Paginering facturen"
      />
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const range = canvas.getByText("1–10 van 48")
    await expect(range).toHaveAttribute("role", "status")
    await expect(pageButtons(canvas)).toEqual([
      "Vorige pagina",
      "1",
      "2",
      "3",
      "4",
      "5",
      "Volgende pagina",
    ])
    await expect(
      canvas.getByRole("button", { name: "Vorige pagina" })
    ).toHaveAttribute("aria-disabled", "true")
    await expect(canvas.getByRole("button", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(bodyRows(canvasElement)).toHaveLength(10)
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent("2026-048")
    await expect(bodyRows(canvasElement)[9]).toHaveTextContent("2026-039")

    // A page button keeps focus after the page changes.
    const two = canvas.getByRole("button", { name: "2" })
    await userEvent.click(two)
    await expect(range).toHaveTextContent("11–20 van 48")
    await expect(two).toHaveFocus()
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent("2026-038")
    await expect(
      canvas.getByRole("table", { name: "Facturen, pagina 2 van 5" })
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole("button", { name: "Volgende pagina" })
    )
    await expect(range).toHaveTextContent("21–30 van 48")

    // A bigger page keeps the first visible row on screen.
    const size = canvas.getByRole("combobox", { name: "Rijen per pagina" })
    await userEvent.click(size)
    const body = within(document.body)
    await userEvent.click(await body.findByRole("option", { name: "25" }))
    await expect(range).toHaveTextContent("1–25 van 48")
    await expect(bodyRows(canvasElement)).toHaveLength(25)
    await expect(pageButtons(canvas)).toEqual([
      "Vorige pagina",
      "1",
      "2",
      "Volgende pagina",
    ])

    await userEvent.click(size)
    await userEvent.click(await body.findByRole("option", { name: "10" }))
    await expect(range).toHaveTextContent("1–10 van 48")
    await expect(bodyRows(canvasElement)).toHaveLength(10)
    size.blur()
  },
}

const serverTotal = 1284

// One page as a server would return it, newest first.
function fetchInvoicePage(pageIndex: number, pageSize: number): Invoice[] {
  const first = pageIndex * pageSize
  const count = Math.max(0, Math.min(pageSize, serverTotal - first))
  return Array.from({ length: count }, (_, i) => {
    const n = serverTotal - first - i
    const day = String((n % 27) + 1).padStart(2, "0")
    return {
      number: `2026-${String(n).padStart(4, "0")}`,
      issued: `2026-10-${day}`,
      client: otherClients[n % otherClients.length],
      due: `2026-11-${day}`,
      amount: 750 + ((n * 1375) % 11000),
      status: statusCycle[n % statusCycle.length],
    }
  })
}

const serverDelay = 800

export const ServerPagination: Story = {
  name: "Server pagination",
  render: function Render() {
    const [pagination, setPagination] = React.useState({
      pageIndex: 2,
      pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const key = `${pageIndex}:${pageSize}`
    const [loaded, setLoaded] = React.useState<{
      key: string
      rows: Invoice[]
    }>({ key: "", rows: [] })

    React.useEffect(() => {
      const timer = setTimeout(
        () => setLoaded({ key, rows: fetchInvoicePage(pageIndex, pageSize) }),
        serverDelay
      )
      return () => clearTimeout(timer)
    }, [key, pageIndex, pageSize])

    const loading = loaded.key !== key
    const pageCount = Math.ceil(serverTotal / pageSize)
    return (
      <DataTable
        caption={`Facturen, pagina ${pageIndex + 1} van ${pageCount}`}
        columns={listColumns}
        data={loaded.rows}
        getRowId={getInvoiceId}
        paginated
        manualPagination
        rowCount={serverTotal}
        pagination={pagination}
        onPaginationChange={setPagination}
        paginationLabel="Paginering facturen"
        loading={loading}
        loadingLabel={`Pagina ${pageIndex + 1} laden…`}
      />
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const range = canvas.getByText("21–30 van 1.284")
    const loadingStatus = canvasElement.querySelector(
      '[data-slot="data-table-loading"]'
    )
    await expect(loadingStatus).toHaveTextContent("Pagina 3 laden…")
    await expect(canvas.getByRole("table", { hidden: true })).toHaveAttribute(
      "aria-busy",
      "true"
    )
    await expect(pageButtons(canvas)).toEqual([
      "Vorige pagina",
      "1",
      "2",
      "3",
      "4",
      "129",
      "Volgende pagina",
    ])

    // The rows arrive; the skeleton rows kept the table at ten rows high.
    await expect(
      await canvas.findByRole(
        "rowheader",
        { name: "2026-1264" },
        { timeout: 3000 }
      )
    ).toBeVisible()
    await expect(loadingStatus).toHaveTextContent("")
    await expect(bodyRows(canvasElement)).toHaveLength(10)

    // The pager moves at once and keeps focus; the rows follow.
    const four = canvas.getByRole("button", { name: "4" })
    await userEvent.click(four)
    await expect(range).toHaveTextContent("31–40 van 1.284")
    await expect(four).toHaveFocus()
    await expect(loadingStatus).toHaveTextContent("Pagina 4 laden…")
    await canvas.findByRole(
      "rowheader",
      { name: "2026-1254" },
      { timeout: 3000 }
    )

    await userEvent.click(canvas.getByRole("button", { name: "3" }))
    await expect(range).toHaveTextContent("21–30 van 1.284")
    await expect(loadingStatus).toHaveTextContent("Pagina 3 laden…")
    canvas.getByRole("button", { name: "3" }).blur()
  },
}

// Test only (hidden from the sidebar): with server search, the counts come
// from the server and a new search starts on the first page.
export const ServerSearch: Story = {
  name: "Server search",
  tags: ["!dev", "!autodocs"],
  render: function Render() {
    const [pagination, setPagination] = React.useState({
      pageIndex: 5,
      pageSize: 10,
    })
    const [search, setSearch] = React.useState("")
    const { pageIndex, pageSize } = pagination
    // The server filters all rows, then returns one page and the counts.
    const matches = fetchInvoicePage(0, serverTotal).filter((invoice) =>
      invoice.number.includes(search)
    )
    const first = pageIndex * pageSize
    return (
      <DataTable
        caption="Facturen"
        columns={listColumns}
        data={matches.slice(first, first + pageSize)}
        getRowId={getInvoiceId}
        search={{ label: "Zoeken in facturen" }}
        globalFilter={search}
        onGlobalFilterChange={setSearch}
        resultCountLabel={(shown, total) => `${shown} van ${total} facturen`}
        paginated
        manualPagination
        manualFiltering
        rowCount={matches.length}
        totalRowCount={serverTotal}
        pagination={pagination}
        onPaginationChange={setPagination}
        paginationLabel="Paginering facturen"
      />
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const count = canvasElement.querySelector('[data-slot="data-table-count"]')
    await expect(count).toHaveTextContent("1284 van 1284 facturen")
    await expect(canvas.getByText("51–60 van 1.284")).toBeInTheDocument()

    await userEvent.type(
      canvas.getByRole("searchbox", { name: "Zoeken in facturen" }),
      "2026-12"
    )
    await expect(count).toHaveTextContent("85 van 1284 facturen")
    await expect(canvas.getByText("1–10 van 85")).toBeInTheDocument()
    await expect(
      canvas.getByRole("rowheader", { name: "2026-1284" })
    ).toBeInTheDocument()
    await expect(bodyRows(canvasElement)).toHaveLength(10)
  },
}

export const ToolbarFilters: Story = {
  name: "Toolbar filters",
  render: function Render() {
    const [columnFilters, setColumnFilters] =
      React.useState<ColumnFiltersState>([{ id: "status", value: "overdue" }])
    const status = statusOptions.find(
      (option) => option.value === columnFilters[0]?.value
    )
    return (
      <DataTable
        caption={
          status
            ? `Facturen met status ${status.label.toLowerCase()}`
            : "Facturen"
        }
        columns={listColumns}
        data={pagedInvoices}
        getRowId={getInvoiceId}
        search={{
          label: "Zoek een factuur",
          placeholder: "Zoek op factuur of klant",
        }}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        filters={(table) => (
          <DataTableSelectFilter
            column={table.getColumn("status")}
            label="Status"
            options={statusOptions}
          />
        )}
        resultCountLabel={(shown, total) => `${shown} van ${total} facturen`}
        noResults={{
          size: "compact",
          description: "Geen facturen die bij deze filters passen.",
        }}
      />
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const search = canvas.getByRole("searchbox", { name: "Zoek een factuur" })
    const status = canvas.getByRole("combobox", { name: "Status" })
    const [count] = canvas.getAllByRole("status")
    await expect(search).toHaveAttribute(
      "placeholder",
      "Zoek op factuur of klant"
    )
    await expect(status).toHaveTextContent("Te laat")
    await expect(count).toHaveTextContent("2 van 48 facturen")
    const rows = bodyRows(canvasElement)
    await expect(rows).toHaveLength(2)
    await expect(rows[0]).toHaveTextContent("Van Dijk Installatietechniek")
    await expect(rows[1]).toHaveTextContent("Hofstede Advies")

    // Search and status filter together.
    await userEvent.type(search, "van dijk")
    await expect(count).toHaveTextContent("1 van 48 facturen")

    // Filters wissen clears both, disappears and hands focus to the search.
    await userEvent.click(
      canvas.getByRole("button", { name: "Filters wissen" })
    )
    await expect(count).toHaveTextContent("48 van 48 facturen")
    await expect(search).toHaveValue("")
    await expect(search).toHaveFocus()
    await expect(status).toHaveTextContent("Alle")
    await expect(
      canvas.queryByRole("button", { name: "Filters wissen" })
    ).toBeNull()

    const body = within(document.body)
    await userEvent.click(status)
    await userEvent.click(await body.findByRole("option", { name: "Concept" }))
    const drafts = pagedInvoices.filter((i) => i.status === "draft").length
    await expect(count).toHaveTextContent(`${drafts} van 48 facturen`)
    await expect(
      canvas.getByRole("button", { name: "Filters wissen" })
    ).toBeVisible()

    await userEvent.click(status)
    await userEvent.click(await body.findByRole("option", { name: "Te laat" }))
    await expect(count).toHaveTextContent("2 van 48 facturen")
    status.blur()
  },
}

// The detail examples show 2026-047 as sent.
const detailInvoices: Invoice[] = invoices.map((invoice) =>
  invoice.number === "2026-047" ? { ...invoice, status: "sent" } : invoice
)

const linkColumns = helper.columns([
  helper.accessor("number", {
    header: "Factuur",
    meta: { rowHeader: true, nowrap: true },
    cell: ({ row }) => (
      <>
        <TableLink href={`#factuur-${row.original.number}`}>
          {row.original.number}
        </TableLink>
        <TableCellDescription>
          <time dateTime={row.original.issued}>
            {formatDate(row.original.issued)}
          </time>
        </TableCellDescription>
      </>
    ),
  }),
  helper.accessor("client", { header: "Klant" }),
  dueColumn(false),
  amountColumn(false),
  statusColumn,
])

export const RowOpensDetail: Story = {
  name: "Row opens detail",
  render: () => (
    <DataTable
      caption="Facturen; open een factuur via het factuurnummer"
      columns={linkColumns}
      data={detailInvoices.slice(0, 4)}
      getRowId={getInvoiceId}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("link", { name: "2026-041" })
    await expect(first).toHaveAttribute("href", "#factuur-2026-041")
    await expect(
      canvas.getByRole("rowheader", { name: /2026-041/ })
    ).toContainElement(first)

    // One tab stop per row: the invoice number.
    await userEvent.tab()
    await expect(first).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "2026-044" })).toHaveFocus()
    await userEvent.tab()
    const third = canvas.getByRole("link", { name: "2026-038" })
    await expect(third).toHaveFocus()
    await expect(third).toHaveClass("focus-visible:outline-2")

    await userEvent.hover(canvas.getByRole("link", { name: "2026-044" }))
    await expect(canvas.getByRole("link", { name: "2026-044" })).toHaveClass(
      "hover:decoration-current"
    )
  },
}

const draftInvoice = invoices.find((invoice) => invoice.status === "draft")

// Test only (hidden from the sidebar): muted text in the active row turns
// dark, so it keeps its contrast on the brand-ice tint.
export const ActiveRowMutedText: Story = {
  name: "Active row muted text",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <DataTable
      caption="Facturen"
      columns={helper.columns([
        linkColumns[0],
        helper.accessor("client", { header: "Klant", meta: { muted: true } }),
        statusColumn,
      ])}
      data={invoices}
      getRowId={getInvoiceId}
      activeRowId={draftInvoice?.number}
    />
  ),
  play: async ({ canvas }) => {
    const row = canvas
      .getByRole("link", { name: draftInvoice?.number })
      .closest("tr")
    await expect(row).toHaveAttribute("data-active", "true")
    await expect(
      within(row ?? document.body).getByText("Concept")
    ).toBeVisible()
  },
}

const sheetDelay = 1500

// Cells read the open invoice from context, so the columns stay stable.
const InvoiceSheetContext = React.createContext<{
  openNumber: string | undefined
  sheetId: string
  open: (number: string) => void
  buttons: Map<string, HTMLButtonElement>
} | null>(null)

function InvoiceSheetButton({ number }: { number: string }) {
  const context = React.use(InvoiceSheetContext)
  if (!context) return number
  const expanded = number === context.openNumber
  return (
    <TableLinkButton
      ref={(node) => {
        if (!node) return
        context.buttons.set(number, node)
        return () => {
          context.buttons.delete(number)
        }
      }}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={expanded ? context.sheetId : undefined}
      onClick={() => context.open(number)}
    >
      {number}
    </TableLinkButton>
  )
}

const sheetColumns = helper.columns([
  helper.accessor("number", {
    header: "Factuur",
    meta: { rowHeader: true, nowrap: true },
    cell: ({ row }) => <InvoiceSheetButton number={row.original.number} />,
  }),
  helper.accessor("client", { header: "Klant" }),
  amountColumn(false),
])

function InvoiceSheetExample() {
  const [openNumber, setOpenNumber] = React.useState<string>()
  const [loadedNumber, setLoadedNumber] = React.useState<string>()
  const [buttons] = React.useState(() => new Map<string, HTMLButtonElement>())
  const sheetId = React.useId()

  React.useEffect(() => {
    if (!openNumber) return
    const timer = setTimeout(() => setLoadedNumber(openNumber), sheetDelay)
    return () => clearTimeout(timer)
  }, [openNumber])

  const invoice = detailInvoices.find((i) => i.number === openNumber)
  const loading = openNumber !== loadedNumber
  const context = React.useMemo(
    () => ({ openNumber, sheetId, open: setOpenNumber, buttons }),
    [openNumber, sheetId, buttons]
  )

  return (
    <InvoiceSheetContext value={context}>
      <DataTable
        caption="Facturen; klik op een rij voor de details"
        columns={sheetColumns}
        data={detailInvoices}
        getRowId={getInvoiceId}
        onRowClick={(row) => setOpenNumber(row.number)}
        activeRowId={openNumber}
      />
      <Sheet
        open={invoice !== undefined}
        onOpenChange={(open) => {
          if (open) return
          setOpenNumber(undefined)
          setLoadedNumber(undefined)
        }}
      >
        {invoice && (
          <SheetContent
            id={sheetId}
            onCloseAutoFocus={(event) => {
              // No SheetTrigger: return focus to the row's button.
              event.preventDefault()
              buttons.get(invoice.number)?.focus()
            }}
          >
            <SheetHeader>
              <SheetTitle>Factuur {invoice.number}</SheetTitle>
              <SheetDescription>{invoice.client}</SheetDescription>
            </SheetHeader>
            <SheetBody aria-busy={loading || undefined}>
              <p role="status" className="sr-only">
                {loading ? "Factuur laden…" : ""}
              </p>
              {loading ? (
                <>
                  <div aria-hidden="true" className="flex flex-col gap-2">
                    <Skeleton shape="sm" width="25" />
                    <Skeleton width="60" />
                  </div>
                  <div aria-hidden="true" className="flex flex-col gap-2">
                    <Skeleton shape="sm" width="25" />
                    <Skeleton width="40" />
                  </div>
                  <div aria-hidden="true" className="flex flex-col gap-2">
                    <Skeleton shape="sm" width="25" />
                    <Skeleton />
                    <Skeleton width="90" />
                    <Skeleton width="75" />
                  </div>
                </>
              ) : (
                <dl className="flex flex-col gap-4">
                  {[
                    ["Factuurdatum", formatDate(invoice.issued)],
                    ["Vervaldatum", formatDate(invoice.due)],
                    ["Bedrag", euro.format(invoice.amount)],
                    ["Status", statusBadges[invoice.status].label],
                  ].map(([term, value]) => (
                    <div key={term} className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">{term}</dt>
                      <dd className="text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </SheetBody>
          </SheetContent>
        )}
      </Sheet>
    </InvoiceSheetContext>
  )
}

export const RowOpensSheet: Story = {
  name: "Row opens sheet",
  render: () => <InvoiceSheetExample />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const button = canvas.getByRole("button", { name: "2026-044" })
    await expect(button).toHaveAttribute("aria-haspopup", "dialog")
    await expect(button).toHaveAttribute("aria-expanded", "false")

    // A click anywhere on the row opens the details.
    await userEvent.click(canvas.getByText("Dekker Logistiek"))
    const panel = await body.findByRole("complementary", {
      name: "Factuur 2026-044",
    })
    await expect(button).toHaveAttribute("aria-expanded", "true")
    await expect(button).toHaveAttribute("aria-controls", panel.id)
    await expect(button.closest("tr")).toHaveAttribute("data-active", "true")

    // Skeletons while loading: aria-busy and a status text.
    const region = within(panel).getByRole("region")
    await expect(region).toHaveAttribute("aria-busy", "true")
    await expect(within(panel).getByRole("status")).toHaveTextContent(
      "Factuur laden…"
    )
    await expect(
      await within(panel).findByText("€ 12.300,00", {}, { timeout: 3000 })
    ).toBeVisible()
    await expect(region).not.toHaveAttribute("aria-busy")

    await userEvent.click(body.getByRole("button", { name: "Paneel sluiten" }))
    await waitFor(() => expect(body.queryByRole("complementary")).toBeNull())
    await expect(button).toHaveFocus()
    await expect(button).toHaveAttribute("aria-expanded", "false")
    await expect(button.closest("tr")).not.toHaveAttribute("data-active")

    // Keyboard: the invoice number is a real button.
    const other = canvas.getByRole("button", { name: "2026-038" })
    other.focus()
    await userEvent.keyboard("{Enter}")
    await body.findByRole("complementary", { name: "Factuur 2026-038" })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("complementary")).toBeNull())
    await expect(other).toHaveFocus()

    await userEvent.click(canvas.getByText("Dekker Logistiek"))
    await body.findByRole("complementary", { name: "Factuur 2026-044" })
  },
}

const onRowAction = fn()

const rowActions = [
  { label: "Bekijken", icon: EyeIcon },
  { label: "Bewerken", icon: PencilIcon },
  { label: "Dupliceren", icon: CopyIcon },
  { label: "Downloaden als pdf", icon: DownloadIcon },
]

const actionsMenuColumns = helper.columns([
  helper.accessor("number", {
    header: "Factuur",
    meta: { rowHeader: true, nowrap: true },
  }),
  helper.accessor("client", { header: "Klant" }),
  dueColumn(false),
  amountColumn(false),
  statusColumn,
  helper.display({
    id: "actions",
    header: () => <span className="sr-only">Acties</span>,
    meta: { shrink: true },
    cell: ({ row }) => {
      const { number } = row.original
      return (
        <TableRowActions>
          {/* Not modal: the other rows' buttons stay out of a hidden page. */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Acties: factuur ${number}`}
              >
                <EllipsisIcon aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Factuur {number}</DropdownMenuLabel>
              {rowActions.map(({ label, icon: Icon }) => (
                <DropdownMenuItem
                  key={label}
                  onSelect={() => onRowAction(label, number)}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onRowAction("Verwijderen", number)}
              >
                <Trash2Icon aria-hidden="true" />
                Verwijderen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableRowActions>
      )
    },
  }),
])

export const RowActionsMenu: Story = {
  name: "Row actions menu",
  render: () => (
    <DataTable
      caption="Facturen met acties per rij"
      columns={actionsMenuColumns}
      data={detailInvoices}
      getRowId={getInvoiceId}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", {
      name: "Acties: factuur 2026-044",
    })
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(trigger)
    const menu = await body.findByRole("menu", {
      name: "Acties: factuur 2026-044",
    })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(within(menu).getByText("Factuur 2026-044")).toBeVisible()
    await expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent)
    ).toEqual([
      "Bekijken",
      "Bewerken",
      "Dupliceren",
      "Downloaden als pdf",
      "Verwijderen",
    ])
    await expect(
      within(menu).getByRole("menuitem", { name: "Verwijderen" })
    ).toHaveAttribute("data-variant", "destructive")

    await userEvent.click(
      within(menu).getByRole("menuitem", { name: "Dupliceren" })
    )
    await expect(onRowAction).toHaveBeenCalledWith("Dupliceren", "2026-044")
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())
    await expect(trigger).toHaveFocus()

    // Keyboard: Enter opens on the first item, Escape returns to the button.
    await userEvent.keyboard("{Enter}")
    const reopened = await body.findByRole("menu", {
      name: "Acties: factuur 2026-044",
    })
    await waitFor(() =>
      expect(within(reopened).getAllByRole("menuitem")[0]).toHaveFocus()
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("menu", { name: "Acties: factuur 2026-044" })
  },
}
