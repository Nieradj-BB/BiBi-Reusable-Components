import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

type Token = {
  name: string
  use: string
  classes: string
  note?: string
}

type Group = {
  title: string
  tokens: Token[]
}

const groups: Group[] = [
  {
    title: "Brand",
    tokens: [
      {
        name: "primary",
        use: "Headings, labels, KPI numbers, navy buttons. Same value as brand-navy.",
        classes: "text-primary, bg-primary, border-primary",
      },
      {
        name: "primary-foreground",
        use: "Text and icons on navy fills",
        classes: "text-primary-foreground",
      },
      {
        name: "brand-navy",
        use: "Brand navy by name, for brand-specific use. Prefer primary in components.",
        classes: "bg-brand-navy, text-brand-navy",
      },
      {
        name: "secondary",
        use: "Navy tint: default badges and selected filter options (with a primary border)",
        classes: "bg-secondary",
        note: "muted-foreground on it is 4.06:1: use secondary-foreground or foreground for text.",
      },
      {
        name: "secondary-foreground",
        use: "Text and icons on secondary",
        classes: "text-secondary-foreground",
      },
      {
        name: "brand-cyan",
        use: "Main call-to-action fill, links, active states, title stripe",
        classes: "bg-brand-cyan, text-brand-cyan, border-brand-cyan",
        note: "Below 4.5:1 as small text; accepted brand-colour failure (decision 5). Meets 3:1 for large text, icons and borders.",
      },
      {
        name: "brand-cyan-foreground",
        use: "Text and icons on cyan fills",
        classes: "text-brand-cyan-foreground",
        note: "Below 4.5:1 for 14px button text; accepted brand-colour failure (decision 5).",
      },
      {
        name: "brand-sky",
        use: "Light cyan for decoration only",
        classes: "bg-brand-sky",
        note: "Decorative only: never for text, control boundaries or meaning.",
      },
      {
        name: "brand-ice",
        use: "Cyan tint for selected and active backgrounds: active nav item and tab, chosen item",
        classes: "bg-brand-ice",
        note: "Cyan text on ice is below AA; accepted brand-colour failure (decision 5). muted-foreground on it is 4.27:1: use foreground or primary.",
      },
    ],
  },
  {
    title: "Surfaces",
    tokens: [
      {
        name: "background",
        use: "Page canvas behind cards and panels",
        classes: "bg-background",
        note: "destructive text on it is 4.29:1: place error text on card.",
      },
      {
        name: "card",
        use: "Cards, panels, dialogs, popovers, table wrappers and form fields",
        classes: "bg-card",
      },
      {
        name: "card-foreground",
        use: "Text on card. Same value as foreground.",
        classes: "text-card-foreground",
      },
      {
        name: "popover",
        use: "Popovers, menus and tooltips surfaces. Same value as card.",
        classes: "bg-popover",
      },
      {
        name: "popover-foreground",
        use: "Text on popover. Same value as foreground.",
        classes: "text-popover-foreground",
      },
      {
        name: "muted",
        use: "Subtle sunken fill: skeletons, inset notes, expanded table rows",
        classes: "bg-muted",
        note: "muted-foreground text on this fill is below 4.5:1: use foreground or primary text on it.",
      },
      {
        name: "accent",
        use: "Hover fill for neutral controls: outline and ghost buttons, menu and nav items",
        classes: "hover:bg-accent",
        note: "Hover fill in the shadcn sense, not a brand colour; same value as muted.",
      },
      {
        name: "accent-foreground",
        use: "Text on the accent hover fill. Same value as foreground.",
        classes: "hover:text-accent-foreground",
      },
    ],
  },
  {
    title: "Text",
    tokens: [
      {
        name: "foreground",
        use: "Body text and control text",
        classes: "text-foreground",
      },
      {
        name: "muted-foreground",
        use: "Secondary text: descriptions, meta, help text, table headers, placeholders, leading field icons",
        classes: "text-muted-foreground",
        note: "Below 4.5:1 on muted (4.37), brand-ice (4.27) and secondary (4.06): use it only on card or background.",
      },
    ],
  },
  {
    title: "Lines",
    tokens: [
      {
        name: "border",
        use: "Default borders and dividers: cards, tables, header bands, list rows",
        classes: "border-border, divide-border",
        note: "Decorative separation only.",
      },
      {
        name: "border-strong",
        use: "Stronger border: field hover, dashed empty states",
        classes: "border-border-strong",
      },
      {
        name: "input",
        use: "Borders of inputs, selects, textareas and checkboxes",
        classes: "border-input",
        note: "Below the 3:1 for field boundaries; value fixed (decision 3), to be reviewed with the brand style sheet.",
      },
      {
        name: "ring",
        use: "Focus outline on every interactive element",
        classes: "focus-visible:outline-ring",
        note: "Meets 3:1 for focus indicators.",
      },
    ],
  },
  {
    title: "Status",
    tokens: [
      {
        name: "destructive",
        use: "Destructive buttons, error text, invalid field borders",
        classes: "bg-destructive, text-destructive, border-destructive",
        note: "Error text only on card; on background or muted it is below 4.5:1.",
      },
      {
        name: "destructive-foreground",
        use: "Text and icons on destructive fills",
        classes: "text-destructive-foreground",
        note: "White on the /90 hover fill is 3.99:1, below 4.5:1 for 14px text; caused by the fixed destructive value (decision 3).",
      },
      {
        name: "success",
        use: "Success fills and icons, always next to text in foreground",
        classes: "bg-success, text-success (icons only)",
        note: "Not for text and never the only cue: below 3:1 on card and background.",
      },
    ],
  },
  {
    title: "Charts",
    tokens: [
      {
        name: "chart-1",
        use: "First chart series",
        classes: "var(--chart-1), fill-chart-1, stroke-chart-1",
      },
      {
        name: "chart-2",
        use: "Second chart series",
        classes: "var(--chart-2), fill-chart-2, stroke-chart-2",
      },
      {
        name: "chart-3",
        use: "Third chart series; the only orange, also for a single data highlight",
        classes: "var(--chart-3), fill-chart-3, stroke-chart-3",
        note: "Almost the same lightness as chart-1 (1.09:1): separate adjacent segments with a 2px card-coloured stroke and label every series.",
      },
    ],
  },
]

function tokenValue(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
}

function Swatch({ token }: { token: Token }) {
  return (
    <li
      data-token={token.name}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div
        aria-hidden
        className="h-16 border-b border-border"
        style={{ background: `var(--${token.name})` }}
      />
      <div className="flex flex-col gap-1 p-4">
        <p className="text-sm font-semibold text-primary">{token.name}</p>
        <p className="text-xs text-muted-foreground" data-value>
          {tokenValue(token.name)}
        </p>
        <p className="text-sm text-foreground">{token.use}</p>
        <p className="text-xs text-muted-foreground">{token.classes}</p>
        {token.note ? (
          <p className="text-xs text-muted-foreground">{token.note}</p>
        ) : null}
      </div>
    </li>
  )
}

function ColourPalette() {
  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <p className="max-w-3xl text-sm text-muted-foreground">
        The colour tokens are fixed: use them through their Tailwind classes and
        never add, change, darken or lighten a colour. Opacity modifiers only
        where a library component already uses them.
      </p>
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <h2 className="text-xl">{group.title}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.tokens.map((token) => (
              <Swatch key={token.name} token={token} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: "Foundations/Colours",
  component: ColourPalette,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ColourPalette>

export default meta

type Story = StoryObj<typeof meta>

export const Palette: Story = {
  play: async ({ canvasElement }) => {
    const values = canvasElement.querySelectorAll("[data-value]")
    const count = groups.reduce((sum, group) => sum + group.tokens.length, 0)
    await expect(values).toHaveLength(count)
    for (const value of values) {
      await expect(value.textContent).toMatch(/^#[\da-f]{6}$/)
    }
  },
}
