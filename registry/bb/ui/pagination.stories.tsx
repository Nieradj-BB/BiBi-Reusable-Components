import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { expect, waitFor, within } from "storybook/test"

import {
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
} from "@/components/ui/pagination"

const meta = {
  title: "Components/Navigation & layout/Pagination",
  component: Pagination,
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const href = (page: number) => `?pagina=${page}`

/** Link pagination for a list page: pages from `getPaginationRange`. */
function LinkPagination({
  page,
  pageCount,
}: {
  page: number
  pageCount: number
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? href(page - 1) : undefined}
            disabled={page <= 1}
          />
        </PaginationItem>
        {getPaginationRange({ page, pageCount }).map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink href={href(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={page < pageCount ? href(page + 1) : undefined}
            disabled={page >= pageCount}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function pageLinks(canvas: ReturnType<typeof within>) {
  const nav = canvas.getByRole("navigation", { name: "Paginering" })
  return within(nav)
    .getAllByRole("link")
    .map((link) => link.textContent)
}

export const Basic: Story = {
  render: () => <LinkPagination page={2} pageCount={3} />,
  play: async ({ canvas, userEvent }) => {
    await expect(pageLinks(canvas)).toEqual([
      "Vorige",
      "1",
      "2",
      "3",
      "Volgende",
    ])
    const current = canvas.getByRole("link", { name: "2" })
    await expect(current).toHaveAttribute("aria-current", "page")
    await expect(canvas.getByRole("link", { name: "1" })).not.toHaveAttribute(
      "aria-current"
    )
    await expect(
      canvas.getByRole("link", { name: "Ga naar vorige pagina" })
    ).toHaveAttribute("href", "?pagina=1")
    await expect(
      canvas.getByRole("link", { name: "Ga naar volgende pagina" })
    ).toHaveAttribute("href", "?pagina=3")

    // Every page is one tab stop, in order.
    await userEvent.tab()
    await expect(
      canvas.getByRole("link", { name: "Ga naar vorige pagina" })
    ).toHaveFocus()
    await userEvent.tab()
    await userEvent.tab()
    await expect(current).toHaveFocus()
    current.blur()
  },
}

export const Ellipsis: Story = {
  render: () => <LinkPagination page={10} pageCount={25} />,
  play: async ({ canvas, canvasElement }) => {
    await expect(pageLinks(canvas)).toEqual([
      "Vorige",
      "1",
      "9",
      "10",
      "11",
      "25",
      "Volgende",
    ])
    await expect(canvas.getByRole("link", { name: "10" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    // The dots are hidden; screen readers hear the text next to them.
    await expect(canvas.getAllByText("Meer pagina's")).toHaveLength(2)
    const dots = canvasElement.querySelectorAll(
      '[data-slot="pagination-ellipsis"]'
    )
    await expect(dots).toHaveLength(2)
    for (const dot of dots) {
      await expect(dot).toHaveAttribute("aria-hidden", "true")
    }
  },
}

export const FirstPage: Story = {
  name: "First page",
  render: () => <LinkPagination page={1} pageCount={12} />,
  play: async ({ canvas, userEvent }) => {
    await expect(pageLinks(canvas)).toEqual([
      "Vorige",
      "1",
      "2",
      "3",
      "12",
      "Volgende",
    ])
    // Disabled, not removed: no href, aria-disabled, no tab stop.
    const previous = canvas.getByRole("link", { name: "Ga naar vorige pagina" })
    await expect(previous).toHaveAttribute("aria-disabled", "true")
    await expect(previous).not.toHaveAttribute("href")
    await userEvent.tab()
    const first = canvas.getByRole("link", { name: "1" })
    await expect(first).toHaveFocus()
    first.blur()
    await expect(
      canvas.getByRole("link", { name: "Ga naar volgende pagina" })
    ).toHaveAttribute("href", "?pagina=2")
  },
}

export const LastPage: Story = {
  name: "Last page",
  render: () => <LinkPagination page={12} pageCount={12} />,
  play: async ({ canvas }) => {
    await expect(pageLinks(canvas)).toEqual([
      "Vorige",
      "1",
      "10",
      "11",
      "12",
      "Volgende",
    ])
    await expect(canvas.getByRole("link", { name: "12" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    const next = canvas.getByRole("link", { name: "Ga naar volgende pagina" })
    await expect(next).toHaveAttribute("aria-disabled", "true")
    await expect(next).not.toHaveAttribute("href")
  },
}

export const LinkStates: Story = {
  name: "Link states",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={href(3)} />
        </PaginationItem>
        {[3, 4, 5].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={href(page)} isActive={page === 4}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={href(5)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvas, userEvent }) => {
    const three = canvas.getByRole("link", { name: "3" })
    const five = canvas.getByRole("link", { name: "5" })
    await userEvent.hover(three)
    await expect(three).toHaveClass(
      "not-aria-[current=page]:not-aria-disabled:not-disabled:hover:bg-accent"
    )

    // Keyboard focus shows the 2px cyan ring.
    canvas.getByRole("link", { name: "4" }).focus()
    await userEvent.tab()
    await expect(five).toHaveFocus()
    await expect(five).toHaveClass("focus-visible:outline-2")
  },
}

const numberFormat = new Intl.NumberFormat("nl-NL")

export const WithPageSize: Story = {
  name: "With page size",
  render: function Render() {
    const [page, setPage] = React.useState(3)
    const [pageSize, setPageSize] = React.useState(10)
    return (
      <PaginationBar
        page={page}
        pageSize={pageSize}
        totalCount={248}
        label="Paginering facturen"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          // Keep the first visible row on screen.
          setPage(Math.floor(((page - 1) * pageSize) / size) + 1)
          setPageSize(size)
        }}
      />
    )
  },
  play: async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Paginering facturen" })
    const range = canvas.getByRole("status")
    await expect(range).toHaveTextContent("21–30 van 248")
    await expect(
      within(nav)
        .getAllByRole("button")
        .map((button) => button.textContent)
    ).toEqual(["", "1", "2", "3", "4", "25", ""])
    await expect(canvas.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    )

    // Focus stays on the page that was chosen.
    const four = canvas.getByRole("button", { name: "4" })
    await userEvent.click(four)
    await expect(range).toHaveTextContent("31–40 van 248")
    await expect(four).toHaveAttribute("aria-current", "page")
    await expect(four).toHaveFocus()

    await userEvent.click(canvas.getByRole("button", { name: "Vorige pagina" }))
    await expect(range).toHaveTextContent("21–30 van 248")

    // Page size: the label names the select.
    const size = canvas.getByRole("combobox", { name: "Rijen per pagina" })
    await expect(size).toHaveTextContent("10")
    await userEvent.click(size)
    const body = within(document.body)
    await userEvent.click(await body.findByRole("option", { name: "25" }))
    await expect(size).toHaveTextContent("25")
    await expect(range).toHaveTextContent("1–25 van 248")

    await userEvent.click(size)
    await userEvent.click(await body.findByRole("option", { name: "10" }))
    await userEvent.click(canvas.getByRole("button", { name: "3" }))
    await expect(range).toHaveTextContent("21–30 van 248")
    canvas.getByRole("button", { name: "3" }).blur()
  },
}

// Test only (hidden from the sidebar): while the total is unknown (the first
// server page is loading) the bar keeps its height, announces no count and
// its pages cannot be used.
export const UnknownTotal: Story = {
  name: "Unknown total",
  tags: ["!dev", "!autodocs"],
  render: function Render() {
    const [totalCount, setTotalCount] = React.useState<number>()
    const [page, setPage] = React.useState(3)
    const [pageSize, setPageSize] = React.useState(10)
    React.useEffect(() => {
      const timer = setTimeout(() => setTotalCount(248), 800)
      return () => clearTimeout(timer)
    }, [])
    return (
      <PaginationBar
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        label="Paginering facturen"
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const bar = canvasElement.querySelector('[data-slot="pagination-bar"]')
    const range = canvas.getByRole("status")
    await expect(range).toHaveTextContent("")
    await expect(
      range.querySelector('[data-slot="pagination-range-skeleton"]')
    ).toHaveAttribute("aria-hidden", "true")

    // Only the requested page shows; every page button is disabled.
    const nav = canvas.getByRole("navigation", { name: "Paginering facturen" })
    const buttons = within(nav).getAllByRole("button")
    await expect(buttons.map((button) => button.textContent)).toEqual([
      "",
      "3",
      "",
    ])
    for (const button of buttons) {
      await expect(button).toHaveAttribute("aria-disabled", "true")
    }
    await expect(canvas.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await userEvent.click(
      canvas.getByRole("button", { name: "Volgende pagina" })
    )
    await expect(range).toHaveTextContent("")
    // The page size does not depend on the total.
    await expect(
      canvas.getByRole("combobox", { name: "Rijen per pagina" })
    ).toBeEnabled()
    const height = bar?.getBoundingClientRect().height

    // The total arrives: the range and the pages, at the same height.
    await waitFor(() => expect(range).toHaveTextContent("21–30 van 248"), {
      timeout: 3000,
    })
    await expect(bar?.getBoundingClientRect().height).toBe(height)
    await expect(
      within(nav)
        .getAllByRole("button")
        .map((button) => button.textContent)
    ).toEqual(["", "1", "2", "3", "4", "25", ""])
    await expect(
      canvas.getByRole("button", { name: "Volgende pagina" })
    ).not.toHaveAttribute("aria-disabled")
  },
}

// Test only (hidden from the sidebar): the bar's rows follow its own width,
// so at 360, 560 and 800px it keeps its height when the page list arrives.
export const UnknownTotalWidths: Story = {
  name: "Unknown total widths",
  tags: ["!dev", "!autodocs"],
  render: function Render() {
    const [totalCount, setTotalCount] = React.useState<number>()
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    React.useEffect(() => {
      const timer = setTimeout(() => setTotalCount(1284), 800)
      return () => clearTimeout(timer)
    }, [])
    return (
      <div className="flex flex-col gap-8">
        {[
          { width: 360, className: "w-90" },
          { width: 560, className: "w-140" },
          { width: 800, className: "w-200" },
        ].map(({ width, className }) => (
          <div key={width} className={className}>
            <PaginationBar
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              label={`Paginering ${width}px`}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        ))}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const bars = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="pagination-bar"]'
      )
    )
    const heights = () => bars.map((bar) => bar.getBoundingClientRect().height)
    const before = heights()
    // Three rows, two rows, one row.
    await expect(before).toEqual([108, 64, 32])

    await waitFor(
      () => {
        for (const bar of bars) {
          expect(
            bar.querySelector('[data-slot="pagination-range"]')
          ).toHaveTextContent("1–10 van 1.284")
        }
      },
      { timeout: 3000 }
    )
    await expect(heights()).toEqual(before)
  },
}

export const Compact: Story = {
  render: function Render() {
    const pageCount = 12
    const [page, setPage] = React.useState(3)
    return (
      <Pagination size="sm">
        <PaginationContent>
          <PaginationItem>
            <PaginationButton
              shape="icon"
              aria-label="Eerste pagina"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              <ChevronsLeftIcon aria-hidden="true" />
            </PaginationButton>
          </PaginationItem>
          <PaginationItem>
            <PaginationButton
              shape="icon"
              aria-label="Vorige pagina"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeftIcon aria-hidden="true" />
            </PaginationButton>
          </PaginationItem>
          <PaginationItem>
            <PaginationStatus>
              Pagina {numberFormat.format(page)} van{" "}
              {numberFormat.format(pageCount)}
            </PaginationStatus>
          </PaginationItem>
          <PaginationItem>
            <PaginationButton
              shape="icon"
              aria-label="Volgende pagina"
              disabled={page === pageCount}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRightIcon aria-hidden="true" />
            </PaginationButton>
          </PaginationItem>
          <PaginationItem>
            <PaginationButton
              shape="icon"
              aria-label="Laatste pagina"
              disabled={page === pageCount}
              onClick={() => setPage(pageCount)}
            >
              <ChevronsRightIcon aria-hidden="true" />
            </PaginationButton>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
  play: async ({ canvas, userEvent }) => {
    const status = canvas.getByText("Pagina 3 van 12")
    await expect(status).toHaveAttribute("aria-live", "polite")

    const next = canvas.getByRole("button", { name: "Volgende pagina" })
    await userEvent.click(next)
    await expect(status).toHaveTextContent("Pagina 4 van 12")
    await expect(next).toHaveFocus()

    // On the first page, first and previous are disabled but keep focus.
    const first = canvas.getByRole("button", { name: "Eerste pagina" })
    await userEvent.click(first)
    await expect(status).toHaveTextContent("Pagina 1 van 12")
    await expect(first).toHaveAttribute("aria-disabled", "true")
    await expect(first).toHaveFocus()
    await userEvent.click(first)
    await expect(status).toHaveTextContent("Pagina 1 van 12")

    await userEvent.click(
      canvas.getByRole("button", { name: "Laatste pagina" })
    )
    await expect(status).toHaveTextContent("Pagina 12 van 12")
    await expect(next).toHaveAttribute("aria-disabled", "true")

    // Keyboard: Enter and Space on a focused button change the page.
    await userEvent.click(first)
    await expect(status).toHaveTextContent("Pagina 1 van 12")
    next.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")
    await waitFor(() => expect(status).toHaveTextContent("Pagina 3 van 12"))
    next.blur()
  },
}
