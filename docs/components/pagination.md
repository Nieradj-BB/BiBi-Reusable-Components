# Pagination

Moves between pages of a long list or table: previous and next, page numbers, an ellipsis for skipped pages and the current page. `PaginationBar` adds the range text (`21–30 van 248`) and a page-size select for under a table.

## When to use

- Tables and lists with more rows than fit on one page.
- Server-side lists where the total count is known.
- A compact "Pagina 3 van 12" control in narrow panels and on small screens.

## When not to use

- Lists of a few dozen items: show them all, or filter.
- Feeds people scan from the top: load more on request instead.
- Steps in a form or wizard: those are not pages of the same list.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/pagination#v0.2.0
```

This also installs Select.

## Usage

Links, for a list page whose page is in the URL:

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  getPaginationRange,
} from "@/components/ui/pagination"

export function InvoicePages({
  page,
  pageCount,
}: {
  page: number
  pageCount: number
}) {
  const href = (p: number) => `?pagina=${p}`

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
```

Under a client-side table or list, use the bar with buttons:

```tsx
import { PaginationBar } from "@/components/ui/pagination"

;<PaginationBar
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
```

DataTable has this bar built in (`paginated`); see the DataTable page.

The compact form is built from the parts: icon buttons for first, previous, next and last around a `PaginationStatus`.

```tsx
<Pagination size="sm">
  <PaginationContent>
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
        Pagina {page} van {pageCount}
      </PaginationStatus>
    </PaginationItem>
    {/* next and last the same way */}
  </PaginationContent>
</Pagination>
```

For a router link component, put `paginationLinkVariants({ shape })` on it and set `aria-current="page"` on the current page.

## Props

### Pagination (`nav`)

| Prop         | Type                | Default        | Notes                                                                         |
| ------------ | ------------------- | -------------- | ----------------------------------------------------------------------------- |
| `size`       | `"default" \| "sm"` | `"default"`    | Pages 36px or 32px high. Use `sm` under tables.                               |
| `aria-label` | `string`            | `"Paginering"` | Name it after the list when a page has more than one (`Paginering facturen`). |

### Parts

| Part                 | Element  | Props                                                                                                                                          |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `PaginationContent`  | `ul`     | Wrapping row, 4px gaps.                                                                                                                        |
| `PaginationItem`     | `li`     |                                                                                                                                                |
| `PaginationLink`     | `a`      | `isActive` (sets `aria-current="page"`), `disabled` (drops `href`, sets `aria-disabled`), `shape`: `"page" \| "previous" \| "next" \| "icon"`. |
| `PaginationPrevious` | `a`      | `label` (`"Vorige"`), `aria-label` (`"Ga naar vorige pagina"`), `disabled`.                                                                    |
| `PaginationNext`     | `a`      | `label` (`"Volgende"`), `aria-label` (`"Ga naar volgende pagina"`), `disabled`.                                                                |
| `PaginationButton`   | `button` | `isActive`, `shape`, `disabled` (sets `aria-disabled` and ignores clicks, so focus stays on it).                                               |
| `PaginationEllipsis` | `span`   | `label` (`"Meer pagina's"`): visually hidden text next to the hidden dots.                                                                     |
| `PaginationStatus`   | `span`   | Text such as `Pagina 3 van 12`, with `aria-live="polite"`.                                                                                     |

### PaginationBar

| Prop               | Type                          | Default              | Notes                                               |
| ------------------ | ----------------------------- | -------------------- | --------------------------------------------------- |
| `page`             | `number`                      | required             | Current page, starting at 1.                        |
| `pageSize`         | `number`                      | required             |                                                     |
| `totalCount`       | `number`                      | required             | Total rows; sets the page count and the range text. |
| `onPageChange`     | `(page: number) => void`      | required             |                                                     |
| `onPageSizeChange` | `(pageSize: number) => void`  |                      | Shows the page-size select when set.                |
| `pageSizeOptions`  | `number[]`                    | `[10, 25, 50, 100]`  |                                                     |
| `siblingCount`     | `number`                      | `1`                  | Pages on each side of the current page.             |
| `label`            | `string`                      | `"Paginering"`       | Name of the page navigation.                        |
| `pageSizeLabel`    | `string`                      | `"Rijen per pagina"` | Visible label of the select.                        |
| `previousLabel`    | `string`                      | `"Vorige pagina"`    | Name of the previous button.                        |
| `nextLabel`        | `string`                      | `"Volgende pagina"`  | Name of the next button.                            |
| `rangeLabel`       | `(from, to, total) => string` | `21–30 van 248`      | Numbers are formatted for `nl-NL` (`1.284`).        |

### getPaginationRange

`getPaginationRange({ page, pageCount, siblingCount = 1 })` returns the pages to show: the first, the last, and `siblingCount` pages on each side of the current one, as numbers plus `"ellipsis-start"` / `"ellipsis-end"`. Near the edges it keeps the same number of pages (`1 2 3 … 12`, `1 … 10 11 12`), and a gap of one page shows that page instead of an ellipsis.

## Variants and states

- **Page:** the ghost Button look: transparent, `accent` fill on hover, 6px corners, 14px medium text with tabular figures, at least 36px wide and high (32px with `size="sm"`).
- **Current page:** brand-cyan border and text on the brand-ice tint, semibold, `aria-current="page"`; no hover fill.
- **Previous / next:** a chevron with the text `Vorige` / `Volgende`; icon-only (`shape="icon"`) in the bar and the compact form.
- **Disabled:** 50% opacity and a not-allowed cursor, on the first or last page. Kept in place so the layout does not jump.
- **Ellipsis:** muted dots in a 36px (32px) square.
- **Bar:** range text (muted) on the left; page-size select (32px, 76px wide) and the size `sm` pages on the right; wraps on narrow screens.
- **Compact:** first, previous, the status text and next, last, all size `sm`.

## Accessibility

- The list sits in a `nav` with a name (`Paginering`, or after the list when a page has more than one). The current page has `aria-current="page"` and is marked by border and weight, not only by colour.
- Previous and next have names (`Ga naar vorige pagina`). On the first or last page they are disabled, not removed: a link loses its `href` and gets `aria-disabled`; a `PaginationButton` gets `aria-disabled` and stays focusable, so focus is not lost when you reach the first or last page. This deliberately replaces the gallery spec's `disabled` attribute on a button (an accepted deviation): a disabled button drops focus to the page body.
- The ellipsis dots are `aria-hidden`; visually hidden text `Meer pagina's` stands next to them.
- The range text in the bar is a `role="status"` region and `PaginationStatus` is `aria-live="polite"`, so page changes are announced.
- Page targets are 36px (32px with `size="sm"`). After a page change, focus stays on the button that was pressed; do not move it to the top of the page.
- Every page shows the 2px focus ring with a 2px offset.
