import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CSSProperties } from "react"
import { expect } from "storybook/test"

import { cn } from "@/lib/utils"

const radii = [
  {
    name: "rounded-md",
    value: "6px",
    box: "rounded-md",
    use: "Controls: buttons, inputs, selects, textareas, search fields, chips, segmented controls, checkboxes, menu and nav items, tabs, tooltips, skeleton lines",
  },
  {
    name: "rounded-xl",
    value: "12px",
    box: "rounded-xl",
    use: "Containers: cards, table wrappers, dialogs, popovers, side panels, empty states, skeleton blocks",
  },
  {
    name: "rounded-full",
    value: "9999px",
    box: "rounded-full",
    use: "Pills and circles: badges, tags, switches, radios, avatars, round icon buttons, the title stripe",
  },
]

const shadows = [
  {
    name: "shadow-tile",
    value: "0 1px 2px rgb(34 42 84 / 0.05)",
    box: "shadow-tile",
    use: "Interactive tiles at rest",
  },
  {
    name: "shadow-tile-hover",
    value: "0 4px 14px rgb(34 42 84 / 0.1)",
    box: "shadow-tile-hover",
    use: "Hover state of clickable tiles and cards (200ms transition)",
  },
  {
    name: "shadow-card",
    value: "0 1px 3px rgb(34 42 84 / 0.08)",
    box: "shadow-card",
    use: "Standalone elevated cards: stat tiles, chart cards, settings cards",
  },
  {
    name: "shadow-panel",
    value: "-1px 0 20px rgb(34 42 84 / 0.07)",
    box: "shadow-panel",
    use: "Floating layers: side panels (sheet), dialogs and popovers",
  },
]

const motion = [
  {
    name: "Entrance",
    value:
      "animate-enter: 320ms cubic-bezier(0.2, 0.7, 0.3, 1) (ease-enter); fade with a 6px rise; 28ms stagger per item through --enter-index, capped at 12",
    use: "The one entrance animation: cards or tiles appearing on first load. Off under prefers-reduced-motion.",
  },
  {
    name: "Colour change",
    value: "150ms (transition-colors)",
    use: "Hover, active and selected fills, borders and text colours on controls",
  },
  {
    name: "Elevation",
    value: "200ms (transition-shadow duration-200)",
    use: "Clickable tiles moving to shadow-tile-hover on hover",
  },
  {
    name: "Rotate and slide",
    value: "150ms (motion-safe:transition-transform)",
    use: "Disclosure chevron turning 90 degrees, switch thumb sliding",
  },
  {
    name: "Loading pulse",
    value: "motion-safe:animate-pulse",
    use: "Skeleton placeholders",
  },
  {
    name: "Spinner",
    value: "motion-safe:animate-spin",
    use: "Inline LoaderCircle for a job running in the background; not for page or section loading",
  },
]

function ShapeAndElevation() {
  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Radius</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Outside chart marks there are three radii. Chart bar ends use 4px
          (rounded-sm).
        </p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {radii.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
            >
              <div
                aria-hidden
                data-radius={item.name}
                className={cn(
                  item.box,
                  "size-16 border border-border-strong bg-secondary"
                )}
              />
              <p className="text-sm font-semibold text-primary">
                {item.name} · {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.use}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Shadows</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Four navy-tinted shadows only. Cards stay flat by default.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shadows.map((item) => (
            <li
              key={item.name}
              data-shadow={item.name}
              className={cn(
                "flex flex-col gap-1 rounded-xl border border-border bg-card p-5",
                item.box
              )}
            >
              <p className="text-sm font-semibold text-primary">{item.name}</p>
              <p className="text-xs text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.use}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Motion</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {motion.map((item, index) => (
            <li
              key={item.name}
              className="flex animate-enter flex-col gap-1 rounded-xl border border-border bg-card p-5"
              style={{ "--enter-index": index } as CSSProperties}
            >
              <p className="text-sm font-semibold text-primary">{item.name}</p>
              <p className="text-xs text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.use}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const meta = {
  title: "Foundations/Radius & Shadows",
  component: ShapeAndElevation,
} satisfies Meta<typeof ShapeAndElevation>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const radius = (name: string) => {
      const box = canvasElement.querySelector(`[data-radius="${name}"]`)
      return box ? getComputedStyle(box).borderTopLeftRadius : ""
    }
    await expect(radius("rounded-md")).toBe("6px")
    await expect(radius("rounded-xl")).toBe("12px")

    const card = canvasElement.querySelector('[data-shadow="shadow-card"]')
    await expect(card).not.toBeNull()
    if (card) {
      await expect(getComputedStyle(card).boxShadow).toContain("0px 1px 3px")
    }
  },
}
