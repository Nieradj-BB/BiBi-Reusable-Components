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
