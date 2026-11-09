# Chart

A chart card with a title, a one-sentence takeaway and bars in the three chart colours. The shadcn chart parts (`ChartContainer`, `ChartTooltip`, `ChartLegend`, `ChartConfig`) on `recharts` v3, plus parts that carry the house defaults and a card shell.

## When to use

- A trend or comparison read at a glance, for example on a dashboard.
- One to three series.
- Parts of a whole, shown as a proportion bar.

## When not to use

- Exact values matter more than the shape: use a data table.
- More than three series.
- Decoration without data.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/chart#v0.2.0
```

## Usage

```tsx
import { BarChart } from "recharts"

import {
  ChartBar,
  ChartBarStack,
  ChartCard,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartContainer,
  ChartGrid,
  ChartLegendContent,
  ChartPlot,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  chartMargin,
  type ChartConfig,
} from "@/components/ui/chart"

// Series in data order: chart-1, chart-2, chart-3. Never hex values.
const config = {
  advies: { label: "Advies", color: "var(--chart-1)" },
  ontwikkeling: { label: "Ontwikkeling", color: "var(--chart-2)" },
  beheer: { label: "Beheer", color: "var(--chart-3)" },
} satisfies ChartConfig

const data = [
  { month: "sep", advies: 45, ontwikkeling: 30, beheer: 20 },
  { month: "okt", advies: 50, ontwikkeling: 35, beheer: 15 },
]

export function HoursChart() {
  return (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardTitle>Uren per maand</ChartCardTitle>
        <ChartCardDescription>
          Oktober 100 uur: 50 advies, 35 ontwikkeling en 15 beheer.
        </ChartCardDescription>
      </ChartCardHeader>
      <ChartPlot
        unit="Uren"
        aria-label="Gestapelde staven: uren in september en oktober, verdeeld over advies, ontwikkeling en beheer"
      >
        <ChartContainer config={config}>
          <BarChart data={data} margin={chartMargin} accessibilityLayer={false}>
            <ChartGrid />
            <ChartXAxis dataKey="month" />
            <ChartYAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartBarStack>
              <ChartBar dataKey="advies" fill="var(--color-advies)" />
              <ChartBar
                dataKey="ontwikkeling"
                fill="var(--color-ontwikkeling)"
              />
              <ChartBar dataKey="beheer" fill="var(--color-beheer)" />
            </ChartBarStack>
          </BarChart>
        </ChartContainer>
      </ChartPlot>
      <ChartLegendContent config={config} />
    </ChartCard>
  )
}
```

Proportion and ranked bars need no recharts:

```tsx
<ChartProportion
  items={[
    { label: "Betaald", value: 31 },
    { label: "Open", value: 13 },
    { label: "Te laat", value: 6 },
  ]}
/>

<ChartRanking
  items={[
    { label: "Offertes", value: 42 },
    { label: "Facturen", value: 35 },
  ]}
/>
```

Offer the same numbers as a table as well, for example in an [Accordion](accordion.md) under the chart.

## Props

### Card shell

| Part                   | Element   | Notes                                                                                           |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `ChartCard`            | `section` | 20px padding, 16px gaps, card surface with `shadow-card`. Named by its `ChartCardTitle`.        |
| `ChartCardHeader`      | `div`     | Title and takeaway on the left, `ChartCardAction` top right.                                    |
| `ChartCardTitle`       | `h3`      | 16px heading.                                                                                   |
| `ChartCardDescription` | `p`       | The one-sentence takeaway, 14px muted, 2px under the title.                                     |
| `ChartCardAction`      | `div`     | For an info toggletip: a `ghost` `icon-sm` Button in a Popover.                                 |
| `ChartCardFooter`      | `p`       | 14px line above a 1px border, e.g. an average under a proportion bar.                           |
| `ChartEmpty`           | `p`       | 14px muted text shown instead of the chart when there is no data.                               |
| `ChartPlot`            | `div`     | `aria-label` (required) and `unit` (caption above the y-axis). Wraps the chart in `role="img"`. |

### Recharts parts

| Part                  | Props                                                     | Notes                                                                                                                                                        |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ChartContainer`      | `config: ChartConfig`, `initialDimension`, `div` props    | Sets `--color-<key>` from the config, 12px muted axis text, half-strength grid lines. 212px high by default.                                                 |
| `ChartConfig`         | `{ [key]: { label?, icon?, color? } }`                    | `color` is `var(--chart-1)`, `var(--chart-2)` or `var(--chart-3)`.                                                                                           |
| `chartMargin`         | `{ top: 8, right: 0, bottom: 0, left: 0 }`                | Pass as `margin` to the recharts chart so the plot is 180px high.                                                                                            |
| `ChartGrid`           | `CartesianGrid` props                                     | Horizontal lines only.                                                                                                                                       |
| `ChartXAxis`          | `XAxis` props                                             | No axis or tick lines, labels 8px below the plot, 24px high.                                                                                                 |
| `ChartYAxis`          | `YAxis` props                                             | 32px wide, no lines, labels 8px left of the plot. Set `domain` and `ticks` for round steps.                                                                  |
| `ChartBar`            | `Bar` props, `valueLabels?: "none" \| "last" \| "all"`    | At most 24px wide, 4px rounded top, no animation. `last` labels only the latest bar (the last entry of the category axis: X, or Y with `layout="vertical"`). |
| `ChartBarStack`       | `BarStack` props                                          | Stacks the ChartBars inside it: only the top of the stack is rounded, parts have 2px card-coloured seams.                                                    |
| `ChartTooltip`        | recharts `Tooltip` props                                  | Not animated. Use with `content={<ChartTooltipContent />}`.                                                                                                  |
| `ChartTooltipContent` | `indicator`, `hideLabel`, `hideIndicator`, `nameKey`, ... | shadcn API. Card surface, 6px corners, `shadow-panel`, tabular values.                                                                                       |
| `ChartLegend`         | recharts `Legend`                                         | Use with `content={<ChartLegendContent />}` when the legend may sit inside the drawing.                                                                      |
| `ChartLegendContent`  | `config?`, `hideIcon`, `nameKey`                          | A `ul` in data order. Pass `config` to render it outside the chart (preferred: outside `ChartPlot` it is read out).                                          |

### HTML charts

| Part              | Props                                             | Notes                                                                                                                                    |
| ----------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ChartProportion` | `items: { label, value, valueLabel? }[]` (1 to 3) | 24px 100% bar (decorative) and a list with swatch, label and share (`62 %` by default). Colours in order.                                |
| `ChartRanking`    | `items: { label, value, valueLabel? }[]`, `max?`  | Horizontal 24px bars in chart-1, labels right-aligned in a 120px column, value after each bar. Sorts `items` from large to small itself. |

## Variants and states

- **Stacked bars:** up to three series in a `ChartBarStack`, legend under the plot, unit caption above the y-axis.
- **Single series:** one `ChartBar`, often with `valueLabels="last"`; the takeaway carries the other numbers.
- **Proportion bar:** `ChartProportion`, optional `ChartCardFooter`.
- **Ranked bars:** `ChartRanking` sorts the items large to small and shows every bar with its value.
- **Empty:** keep the card, title and takeaway; replace the chart with `ChartEmpty`.

All bars start at a zero baseline, are at most 24px thick with 4px rounded ends, and are never animated. Grid lines are horizontal only. Series use `chart-1`, `chart-2`, `chart-3` in that order and never more than three. `chart-1` and `chart-3` have nearly the same lightness, so stacked parts are always separated by a 2px card-coloured seam and every series is named in a legend or list.

## Accessibility

- Put a one-sentence takeaway under the title and offer every value as a table as well.
- `ChartPlot` gives the drawing `role="img"` with a short `aria-label` that names the chart type and what it shows. Set `accessibilityLayer={false}` on the recharts chart inside it, so no focusable element sits inside the image.
- Render the legend with `ChartLegendContent config={...}` outside `ChartPlot`, so screen readers read it. `ChartProportion` and `ChartRanking` are lists: the decorative bar is hidden and the list is the text alternative.
- Never rely on colour alone: the legend or value list names every series, in the order chart-1, chart-2, chart-3.
- No animation; the tooltip is a mouse extra, never the only way to read a value.
