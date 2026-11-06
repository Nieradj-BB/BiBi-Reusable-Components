import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CheckIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { expect, fn, within } from "storybook/test"

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
