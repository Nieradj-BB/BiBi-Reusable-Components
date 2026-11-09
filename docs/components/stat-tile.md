# StatTile

A tile that shows one key number with its label, optionally with a caption, a trend, a sparkline or a link to the details.

## When to use

- Key figures at the top of a dashboard or overview.
- A summary tile that links to the section with the details.

## When not to use

- Many comparable numbers: use DataTable.
- Trends that need axes or values: use Chart.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/stat-tile#v0.2.0
```

Also installs `skeleton` from this registry (the loading placeholder).

## Usage

```tsx
import { StatTile, StatTileGroup } from "@/components/ui/stat-tile"

export function KeyFigures({ loading }: { loading: boolean }) {
  return (
    <StatTileGroup>
      <StatTile
        label="Lopende projecten"
        value="24"
        sparkline={[14, 16, 15, 19, 18, 22, 24]}
        caption="3 gestart deze maand"
      />
      <StatTile
        label="Omzet deze maand"
        value="€ 64.300"
        loading={loading}
        loadingLabel="Omzet laden…"
        trend={{
          direction: "up",
          tone: "good",
          label: "12 % hoger dan vorige maand",
        }}
      />
      <StatTile
        label="Openstaande facturen"
        value="€ 18.420"
        caption="7 facturen, 2 over de vervaldatum"
        meta="Vorige maand: € 21.950"
        href="/facturen"
      />
    </StatTileGroup>
  )
}
```

Always put tiles inside `StatTileGroup`, even a single one: the group is the `dl` that gives each label and value their meaning.

For a router link, pass the link as the label inside `StatTileLink` instead of using `href`:

```tsx
import { StatTile, StatTileLink } from "@/components/ui/stat-tile"

export function InvoicesTile() {
  return (
    <StatTile
      label={
        <StatTileLink asChild>
          <Link to="/facturen">Openstaande facturen</Link>
        </StatTileLink>
      }
      value="€ 18.420"
    />
  )
}
```

## Props

| Part / prop               | Type                                                                  | Default            | Notes                                                                          |
| ------------------------- | --------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| `StatTile` `label`        | `ReactNode`                                                           |                    | Required. Rendered as the `dt`.                                                |
| `StatTile` `value`        | `ReactNode`                                                           |                    | Already formatted for nl-NL, e.g. `"€ 18.420"`.                                |
| `StatTile` `caption`      | `ReactNode`                                                           |                    | One line of body text under the value.                                         |
| `StatTile` `meta`         | `ReactNode`                                                           |                    | Small muted line, e.g. the previous period.                                    |
| `StatTile` `trend`        | `{ direction: "up" \| "down"; tone: "good" \| "bad"; label: string }` |                    | `direction` picks the arrow, `tone` its colour; the label carries the meaning. |
| `StatTile` `sparkline`    | `number[]`                                                            |                    | Two or more points, drawn 112 by 40px next to the value.                       |
| `StatTile` `href`         | `string`                                                              |                    | Makes the label a link stretched over the whole tile.                          |
| `StatTile` `loading`      | `boolean`                                                             | `false`            | Shows a pulsing placeholder instead of the value, caption, trend and meta.     |
| `StatTile` `loadingLabel` | `string`                                                              | `"<label> laden…"` | Screen reader text while loading (`"Laden…"` when the label is not a string).  |
| `StatTileLink` `asChild`  | `boolean`                                                             | `false`            | Renders your own link element (for client-side routing) as the stretched link. |
| `className`               | `string`                                                              |                    | Merged with `cn()` on `StatTileGroup`, `StatTile` and `StatTileLink`.          |

## Variants and states

`StatTileGroup` is a grid of columns at least 200px wide with 16px gaps. A tile is a white card with a 1px border, 12px radius, 20px padding, the card shadow and 4px between lines: the label in 14px muted text, the value in 30px bold navy (`font-heading`), the caption in 14px body text, the trend in 12px medium text and the meta line in 12px muted text.

| Variant / state | Look                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Value and label | Label above the value                                                                           |
| With caption    | Caption under the value, previous period as a small muted line                                  |
| Trend up / down | 14px trending arrow plus words; the arrow is green for `tone: "good"` and red for `tone: "bad"` |
| Sparkline       | Muted 2px line ending in a chart-1 dot for the current period                                   |
| Loading         | `aria-busy` on the tile, a 96 by 28px pulsing block (Skeleton) in place of the value            |
| Linked          | The label link covers the tile; hover raises the shadow to the tile-hover shadow                |
| Linked focus    | 2px cyan outline with a 2px offset on the whole tile while its link has keyboard focus          |

## Accessibility

- The tiles are `dt`/`dd` groups inside one `dl`, so the label is announced with its value.
- The trend arrow and the sparkline are `aria-hidden`: the trend label carries the meaning, and the values behind a sparkline must exist as text or in a table elsewhere.
- Loading: `aria-busy` on the tile, a visually hidden "… laden…" text and an `aria-hidden` placeholder; the pulse is off under reduced motion.
- A linked tile has one link, the label; its `::after` covers the tile and the focus ring shows on the whole tile.
