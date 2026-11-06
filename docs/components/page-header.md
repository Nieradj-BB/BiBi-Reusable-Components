# PageHeader

The top block of every page: title, one-line subtitle and the short cyan accent stripe, with optional actions, breadcrumbs, eyebrow and a slot for tabs or search.

## When to use

- At the top of every page inside the app shell.
- With actions for the page's main commands.
- With tabs, a search field or filters in the slot below the stripe.

## When not to use

- Inside cards, dialogs or sheets: they have their own titles.
- With more than two or three actions.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/page-header#v0.1.0
```

## Usage

```tsx
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderBreadcrumbItem,
  PageHeaderBreadcrumbLink,
  PageHeaderBreadcrumbPage,
  PageHeaderBreadcrumbs,
} from "@/components/ui/page-header"

export function ProjectHeader() {
  return (
    <PageHeader
      eyebrow="Project"
      title="Renovatie hoofdkantoor"
      subtitle="Van Dijk Bouw · projectleider Sanne de Vries"
      breadcrumbs={
        <PageHeaderBreadcrumbs>
          <PageHeaderBreadcrumbItem>
            <PageHeaderBreadcrumbLink href="/projecten">
              Projecten
            </PageHeaderBreadcrumbLink>
          </PageHeaderBreadcrumbItem>
          <PageHeaderBreadcrumbItem>
            <PageHeaderBreadcrumbPage>
              Renovatie hoofdkantoor
            </PageHeaderBreadcrumbPage>
          </PageHeaderBreadcrumbItem>
        </PageHeaderBreadcrumbs>
      }
      actions={
        <Button>
          <PlusIcon aria-hidden="true" />
          Nieuwe taak
        </Button>
      }
    />
  )
}
```

With a router, render breadcrumb links through `asChild`:

```tsx
<PageHeaderBreadcrumbLink asChild>
  <Link to="/projecten">Projecten</Link>
</PageHeaderBreadcrumbLink>
```

Tabs, a search field or filters go in `children`, 20px below the stripe:

```tsx
<PageHeader title="Instellingen" subtitle="Team, facturatie en meldingen">
  <TabsNav aria-label="Instellingen">
    <TabsLink href="/instellingen" active>
      Algemeen
    </TabsLink>
    <TabsLink href="/instellingen/team">Team</TabsLink>
  </TabsNav>
</PageHeader>
```

## Props

`PageHeader` (a `div`; other `div` props are passed on):

| Prop          | Type        | Default | Notes                                                           |
| ------------- | ----------- | ------- | --------------------------------------------------------------- |
| `title`       | `ReactNode` |         | Required. Rendered as the page's only `h1`, 30px.               |
| `subtitle`    | `ReactNode` |         | One line, 16px muted, 4px under the title.                      |
| `eyebrow`     | `ReactNode` |         | 12px bold uppercase cyan paragraph above the title.             |
| `breadcrumbs` | `ReactNode` |         | Slot above the title, usually `<PageHeaderBreadcrumbs>`.        |
| `actions`     | `ReactNode` |         | Buttons, right of the title; wrap below it on narrow screens.   |
| `children`    | `ReactNode` |         | Slot 20px below the stripe for tabs, a search field or filters. |
| `className`   | `string`    |         | Merged with `cn()`.                                             |

| Part                       | Element      | Notes                                                                               |
| -------------------------- | ------------ | ----------------------------------------------------------------------------------- |
| `PageHeaderBreadcrumbs`    | `nav` > `ol` | `aria-label` defaults to `"Kruimelpad"`.                                            |
| `PageHeaderBreadcrumbItem` | `li`         | Adds the 14px chevron separator before every item except the first.                 |
| `PageHeaderBreadcrumbLink` | `a`          | Muted, accent background on hover, max 14rem with ellipsis. `asChild` for a router. |
| `PageHeaderBreadcrumbPage` | `span`       | The current page: semibold, `aria-current="page"`.                                  |

## Variants and states

- Basic: title, subtitle and the 64 × 4px cyan stripe, 16px under the text.
- With actions: actions sit top right with an 8px gap and wrap below the title when there is no room.
- Breadcrumbs and eyebrow: breadcrumbs 12px above the title block, shifted 4px left so the text lines up with the title.
- With tabs: content in the slot 20px below the stripe.
- Layout: 24px padding, 32px side padding from 1024px, page background and a bottom border.

## Accessibility

- The title is the page's only `h1`; the eyebrow is a paragraph before it, not a heading.
- The stripe is decorative (`aria-hidden`).
- Actions follow the title in DOM order and wrap below it on narrow screens.
- Breadcrumbs keep their own labelled `nav`; the current page is marked with `aria-current="page"`. Links have a 24px minimum height and the standard focus ring.
- The cyan eyebrow is an accepted brand-colour contrast exception.
