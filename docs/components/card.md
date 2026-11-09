# Card

A white surface with a thin border and 12px corners that groups related content, optionally with a header, body, footer or media area.

## When to use

- Grouping one section of content on a page.
- Clickable tiles in a grid that open a detail view (`interactive`).
- Media tiles with an image or placeholder, a badge and icon meta rows.

## When not to use

- Every row of a list: use a list or a table.
- Cards inside cards.
- Content that floats over the page: use Dialog, Sheet or Popover.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/card#v0.2.0
```

## Usage

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function InvoiceCard() {
  return (
    <Card variant="elevated" asChild>
      <section aria-labelledby="invoice-title">
        <CardHeader>
          <CardTitle id="invoice-title">Factuur 2026-0412</CardTitle>
          <CardDescription>
            Van Dijk Bouw · vervalt op 18 november
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Totaal € 12.480,00 voor 96 uur advies in oktober.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            Downloaden
          </Button>
          <Button size="sm">Versturen</Button>
        </CardFooter>
      </section>
    </Card>
  )
}
```

Interactive card: one link in the title stretches over the whole card.

```tsx
import { Briefcase } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardLink,
  CardMeta,
  CardMetaItem,
  CardTitle,
} from "@/components/ui/card"

export function ProjectTile({ selected }: { selected: boolean }) {
  return (
    <Card variant="interactive" asChild>
      <article>
        <CardHeader>
          <CardTitle>
            <CardLink href="/projecten/noordkade" selected={selected}>
              Kantoor Noordkade
            </CardLink>
          </CardTitle>
          <CardDescription>
            Nieuwbouw van een kantoor met twaalf verdiepingen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardMeta>
            <CardMetaItem>
              <Briefcase aria-hidden="true" />
              <span>Hofstede Groep</span>
            </CardMetaItem>
          </CardMeta>
        </CardContent>
      </article>
    </Card>
  )
}
```

With a router, pass its link component through `asChild`: `<CardLink asChild><Link to="...">...</Link></CardLink>`.

## Props

### Card

| Prop        | Type                                    | Default  | Notes                                                    |
| ----------- | --------------------------------------- | -------- | -------------------------------------------------------- |
| `variant`   | `"flat" \| "elevated" \| "interactive"` | `"flat"` | See below.                                               |
| `asChild`   | `boolean`                               | `false`  | Render the child (`<section>`, `<article>`) as the card. |
| `className` | `string`                                |          | Merged with `cn()`.                                      |

`cardVariants({ variant })` returns the classes.

### Parts

| Part                | Element | Notes                                                                                      |
| ------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `CardMedia`         | `div`   | Square ice area; an svg child is 40px, a `Badge` child sits 12px from the top-left corner. |
| `CardMediaInitials` | `span`  | 48px extra-bold initials for the media placeholder.                                        |
| `CardHeader`        | `div`   | 20px padding, 6px gap. Puts a `CardAction` in a second column.                             |
| `CardTitle`         | `h3`    | 16px heading. `asChild` to render another heading level.                                   |
| `CardDescription`   | `p`     | 14px muted text.                                                                           |
| `CardAction`        | `div`   | Top-right slot in the header (not for interactive cards).                                  |
| `CardLink`          | `a`     | Stretched link for interactive cards. `selected` sets `aria-current="true"`; `asChild`.    |
| `CardContent`       | `div`   | Body: 20px padding, 14px text, grows to fill the card.                                     |
| `CardMeta`          | `ul`    | Stack of meta rows, 6px apart.                                                             |
| `CardMetaItem`      | `li`    | 16px cyan icon, 8px gap, 14px muted text.                                                  |
| `CardFooter`        | `div`   | 20px padding, wrapping row of actions with an 8px gap.                                     |

A part that follows the header or the body drops its top padding, so the 20px rhythm stays even.

## Variants and states

| Variant / state | Look                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- |
| `flat`          | Border, no shadow. Sections on a page.                                                 |
| `elevated`      | Adds the card shadow. Standalone tiles such as charts or settings.                     |
| `interactive`   | Card shadow; hover raises it to the tile-hover shadow (200ms).                         |
| Focus           | While the link has keyboard focus the whole card shows the 2px ring with a 2px offset. |
| Selected        | `CardLink selected`: cyan border plus a 1px cyan ring, kept on hover.                  |

## Accessibility

- Give every card title a heading (`h3` under the page's `h2` sections). Label `section` cards with `aria-labelledby`.
- Interactive cards have exactly one link or button in the title, stretched over the card. Never wrap the heading in a button and put no other controls inside.
- Focus shows on the whole card (any variant) while its `CardLink` has keyboard focus, through `:has([data-slot=card-link]:focus-visible)`; the link itself shows no ring of its own. The selected card is marked with `aria-current`, not with colour alone.
- Images in `CardMedia` need alt text when they add meaning; placeholder icons are decorative (`aria-hidden="true"`).
