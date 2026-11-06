import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Download,
  Info,
  Pencil,
  Search,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react"
import { expect } from "storybook/test"

import { cn } from "@/lib/utils"

const sizes = [
  {
    name: "small",
    value: "14px (size-3.5)",
    icon: "size-3.5",
    use: "Inside tags and badges, next to text-xs, breadcrumb separators",
  },
  {
    name: "inline",
    value: "16px (size-4)",
    icon: "size-4",
    use: "Default: in buttons (set by the button), leading icon in a field, table actions, next to text-sm",
  },
  {
    name: "navigation",
    value: "20px (size-5)",
    icon: "size-5",
    use: "Sidebar navigation items and other primary navigation",
  },
  {
    name: "large",
    value: "24px (size-6)",
    icon: "size-6",
    use: "Lucide's native size; standalone icons only, never inside controls",
  },
]

const meanings: { meaning: string; name: string; Icon: LucideIcon }[] = [
  { meaning: "Delete", name: "Trash2", Icon: Trash2 },
  { meaning: "Edit", name: "Pencil", Icon: Pencil },
  { meaning: "Close or remove", name: "X", Icon: X },
  {
    meaning: "Disclosure (turned 90° when open)",
    name: "ChevronRight",
    Icon: ChevronRight,
  },
  { meaning: "Search", name: "Search", Icon: Search },
  { meaning: "Selected", name: "Check", Icon: Check },
  { meaning: "Back", name: "ArrowLeft", Icon: ArrowLeft },
  { meaning: "Download", name: "Download", Icon: Download },
  { meaning: "Explanation", name: "Info", Icon: Info },
]

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

function IconsAndFocus() {
  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Icon sizes</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          lucide-react only, stroke width 2 in currentColor. Size icons with
          size-*; hide decorative icons with aria-hidden and give every
          icon-only button an accessible name.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sizes.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5"
            >
              <Download
                aria-hidden
                data-icon-size={item.name}
                className={cn(item.icon, "text-primary")}
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
        <h2 className="text-xl">One icon per meaning</h2>
        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {meanings.map(({ meaning, name, Icon }) => (
            <li
              key={name}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <Icon aria-hidden className="size-4 text-primary" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-primary">{name}</p>
                <p className="text-xs text-muted-foreground">{meaning}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Focus</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Every interactive element shows a 2px solid ring outline with a 2px
          offset on :focus-visible. Use an outline, not a box-shadow ring: it
          stays visible in forced-colours mode. Press Tab to move through the
          examples.
        </p>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
          <button
            type="button"
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent",
              focusRing
            )}
          >
            <Download aria-hidden className="size-4" />
            Downloaden
          </button>
          <button
            type="button"
            aria-label="Verwijderen"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent",
              focusRing
            )}
          >
            <Trash2 aria-hidden className="size-4" />
          </button>
          <a
            href="#focus"
            className={cn(
              "rounded-md text-sm font-medium text-primary underline underline-offset-4",
              focusRing
            )}
          >
            Alle documenten
          </a>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-primary">
              Projectnaam
            </span>
            <input
              type="text"
              className={cn(
                "h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground",
                focusRing
              )}
            />
          </label>
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: "Foundations/Icons & Focus",
  component: IconsAndFocus,
} satisfies Meta<typeof IconsAndFocus>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const icon = canvasElement.querySelector('[data-icon-size="inline"]')
    await expect(icon?.getAttribute("width")).toBe("24")
    if (icon) {
      await expect(icon.getBoundingClientRect().width).toBe(16)
    }

    const button = canvas.getByRole("button", { name: "Downloaden" })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    const outline = getComputedStyle(button)
    await expect(outline.outlineStyle).toBe("solid")
    await expect(outline.outlineWidth).toBe("2px")
    await expect(outline.outlineOffset).toBe("2px")

    await userEvent.tab()
    await expect(
      canvas.getByRole("button", { name: "Verwijderen" })
    ).toHaveFocus()
  },
}
