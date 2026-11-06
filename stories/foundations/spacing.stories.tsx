import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { cn } from "@/lib/utils"

const steps = [
  { step: "0.5", px: 2, bar: "w-0.5" },
  { step: "1", px: 4, bar: "w-1" },
  { step: "1.5", px: 6, bar: "w-1.5" },
  { step: "2", px: 8, bar: "w-2" },
  { step: "2.5", px: 10, bar: "w-2.5" },
  { step: "3", px: 12, bar: "w-3" },
  { step: "4", px: 16, bar: "w-4" },
  { step: "5", px: 20, bar: "w-5" },
  { step: "6", px: 24, bar: "w-6" },
  { step: "8", px: 32, bar: "w-8" },
  { step: "10", px: 40, bar: "w-10" },
]

const roles = [
  {
    role: "Page padding",
    value: "p-6 lg:px-8 (24px; 32px left and right from lg)",
    note: "The page header band and the content area below it use the same padding.",
  },
  {
    role: "Section gap",
    value: "gap-8 (32px)",
    note: "Between sections of a page, in a flex flex-col stack.",
  },
  {
    role: "Section heading to content",
    value: "gap-4 (16px)",
    note: "From a section's heading block to its table, grid or card.",
  },
  {
    role: "Title to description",
    value: "mt-1 (4px)",
    note: "Page, section, card and dialog titles to the line of text under them.",
  },
  {
    role: "Grid gap",
    value: "gap-4 (16px)",
    note: "Between cards and tiles in a grid.",
  },
  {
    role: "Card padding",
    value: "p-5 (20px)",
    note: "Cards and stat tiles.",
  },
  {
    role: "Dialog and panel padding",
    value: "p-6 (24px)",
    note: "Dialogs and side panels; their header, body and footer stack with gap-5 (20px).",
  },
  {
    role: "Stack gap inside cards",
    value: "gap-3 (12px)",
    note: "Between blocks inside a card.",
  },
  {
    role: "Form field stack",
    value: "gap-5 (20px)",
    note: "Between form fields, in a page form, a dialog or a side panel.",
  },
  {
    role: "Field gap",
    value: "gap-2 (8px)",
    note: "Label to control; help or error text sits mt-1 (4px) under the control.",
  },
  {
    role: "Button group gap",
    value: "gap-2 (8px)",
    note: "Between buttons in a footer or toolbar, with flex-wrap.",
  },
  {
    role: "Table cell padding",
    value: "px-4 py-3 (16px / 12px)",
    note: "Header and body cells alike.",
  },
  {
    role: "Readable width",
    value: "max-w-3xl (768px)",
    note: "Long text blocks, notes and single-column forms.",
  },
]

const breakpoints = [
  {
    name: "sm",
    value: "640px",
    use: "Two-column grids; dialog footer buttons move from stacked to one right-aligned row",
  },
  {
    name: "md",
    value: "768px",
    use: "The app shell sidebar (250px) appears; below it navigation sits behind a menu button",
  },
  {
    name: "lg",
    value: "1024px",
    use: "Page padding grows to px-8; three- and four-column grids; side panel 560px wide",
  },
  { name: "xl", value: "1280px", use: "Four-column card grids" },
  { name: "2xl", value: "1536px", use: "Side panel 640px wide" },
]

function SpacingScale() {
  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <p className="max-w-3xl text-sm text-foreground">
        The 4px Tailwind scale (--spacing: 0.25rem). Use these steps and the
        role values below; no arbitrary spacing. pl-9 is the one extra step, to
        clear a leading icon in a field. Stack siblings with gap on a flex or
        grid parent.
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Steps</h2>
        <ul className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          {steps.map((item) => (
            <li
              key={item.step}
              data-step={item.step}
              className="grid grid-cols-[4rem_4rem_1fr] items-center gap-4 text-sm"
            >
              <span className="font-semibold text-primary">{item.step}</span>
              <span className="text-muted-foreground tabular-nums">
                {item.px}px
              </span>
              <span
                aria-hidden
                data-bar
                className={cn(item.bar, "h-3 rounded-sm bg-chart-2")}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Roles</h2>
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {roles.map((item) => (
            <li key={item.role} className="flex flex-col gap-1 px-4 py-3">
              <p className="text-sm font-semibold text-primary">{item.role}</p>
              <p className="text-sm text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Breakpoints</h2>
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {breakpoints.map((item) => (
            <li key={item.name} className="flex flex-col gap-1 px-4 py-3">
              <p className="text-sm font-semibold text-primary">
                {item.name} · {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.use}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const meta = {
  title: "Foundations/Spacing",
  component: SpacingScale,
} satisfies Meta<typeof SpacingScale>

export default meta

type Story = StoryObj<typeof meta>

export const Scale: Story = {
  play: async ({ canvasElement }) => {
    for (const item of steps) {
      const bar = canvasElement.querySelector(
        `[data-step="${item.step}"] [data-bar]`
      )
      await expect(bar).not.toBeNull()
      if (bar) {
        await expect(bar.getBoundingClientRect().width).toBe(item.px)
      }
    }
  },
}
