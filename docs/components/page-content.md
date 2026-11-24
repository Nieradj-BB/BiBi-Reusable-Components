# PageContent

The content area under the page header: the same page padding as the header, so the content lines up with the page title, a stack of sections 32px apart, and section headers with a title, description and actions.

## When to use

- Under the PageHeader on every page inside the app shell, for all of the page's content.
- `width="readable"` for forms, notes and text pages: the column stops at 768px.
- `PageSection` for each block of the page that has a title: a table, a card grid, a form.

## When not to use

- Inside cards, dialogs and sheets: they have their own padding and titles.
- As the page's `<main>`: AppShell renders `<main>`, and PageContent is a `div` inside it.
- For a single block without a title: put it straight in `PageContent`, no section needed.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/page-content#v0.2.2
```

## Usage

```tsx
import { DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  PageContent,
  PageSection,
  PageSectionAction,
  PageSectionDescription,
  PageSectionHeader,
  PageSectionTitle,
} from "@/components/ui/page-content"
import { PageHeader } from "@/components/ui/page-header"

export function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Overzicht"
        subtitle="Facturen en projecten van deze maand"
      />
      <PageContent>
        <PageSection>
          <PageSectionHeader>
            <PageSectionTitle>Openstaande facturen</PageSectionTitle>
            <PageSectionDescription>
              Verstuurde facturen die nog niet zijn betaald
            </PageSectionDescription>
            <PageSectionAction>
              <Button variant="outline">
                <DownloadIcon aria-hidden="true" />
                Exporteren
              </Button>
            </PageSectionAction>
          </PageSectionHeader>
          <InvoicesTable />
        </PageSection>
        <PageSection>
          <PageSectionHeader>
            <PageSectionTitle>Lopende projecten</PageSectionTitle>
          </PageSectionHeader>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* cards */}
          </div>
        </PageSection>
      </PageContent>
    </>
  )
}
```

Both components render inside AppShell's `<main>`, header first.

Forms and text pages use the readable width. Text runs to 768px; a `FormStack` keeps its own 448px field width inside it:

```tsx
<PageContent width="readable">
  <PageSection>
    <PageSectionHeader>
      <PageSectionTitle>Projectgegevens</PageSectionTitle>
    </PageSectionHeader>
    <FormStack asChild>
      <form aria-label="Projectgegevens">{/* fields */}</form>
    </FormStack>
  </PageSection>
</PageContent>
```

A section inside a section renders its title as an `h3` through `asChild`, sized like the other `h3` titles (`text-base`):

```tsx
<PageSection>
  <PageSectionHeader>
    <PageSectionTitle>Facturatie</PageSectionTitle>
  </PageSectionHeader>
  <PageSection>
    <PageSectionHeader>
      <PageSectionTitle asChild className="text-base">
        <h3>Betaaltermijn</h3>
      </PageSectionTitle>
    </PageSectionHeader>
    {/* content */}
  </PageSection>
</PageSection>
```

## Props

`PageContent` (a `div`; other `div` props are passed on):

| Prop        | Type                   | Default  | Notes                                                       |
| ----------- | ---------------------- | -------- | ----------------------------------------------------------- |
| `width`     | `"full" \| "readable"` | `"full"` | `readable`: the column inside the padding is at most 768px. |
| `className` | `string`               |          | Merged with `cn()`.                                         |

`pageContentVariants({ width })` returns the classes.

| Part                     | Element   | Notes                                                                                                                                                                              |
| ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PageSection`            | `section` | One block of the page: its header 16px above its content.                                                                                                                          |
| `PageSectionHeader`      | `div`     | Title, description and an optional `PageSectionAction`, laid out like the page header's title and actions. Always as wide as the section, also when the section has `items-start`. |
| `PageSectionTitle`       | `h2`      | 20px section title; weight, colour and tracking come from the base heading style. `asChild` for an `h3`.                                                                           |
| `PageSectionDescription` | `p`       | 14px muted text, 4px under the title.                                                                                                                                              |
| `PageSectionAction`      | `div`     | The section's buttons, 8px apart and wrapping. Top right of the header, or under the title block when narrow.                                                                      |

## Variants and states

- Page padding: 24px, and 32px left and right from 1024px: the same as PageHeader at every width, so the section titles start exactly under the page title and section actions end under the page actions.
- `full` (default): the content fills the width of `<main>` inside the padding.
- `readable`: the column is at most 768px wide and stays left-aligned with the page title; the padding sits outside the 768px.
- Spacing: 32px between sections, 16px from a section header to its content, 4px from title to description.
- Section header with an action: the action sits top right, 16px from the title block, level with the title. When the header is narrower than 448px (a phone, a narrow column) the action moves under the description, 16px down, aligned left. Above 448px, buttons that do not fit next to the title wrap inside the action; the title column never gets narrower than its longest word. Keep a section to one or two buttons and put the rest in a `DropdownMenu`.
- No background, border, radius or shadow: these parts are layout only and sit on the page background.

## Accessibility

- The page has one `h1`, the PageHeader title. Section titles are `h2`; a nested section renders an `h3` with `asChild`, so the heading outline follows the layout.
- PageContent is not a landmark and never renders `<main>`: AppShell's `<main>` holds the header and the content, and its skip link lands there.
- `PageSection` is a `<section>` without a name, so it adds no landmark. To make a major section a named region, pass `aria-labelledby` with the title's `id`; keep such regions few.
- The action comes after the title and description in DOM order, so keyboard and reading order match what is on screen, also when it wraps.
- The parts have no focus style or colour of their own; buttons and links inside keep their focus ring.
