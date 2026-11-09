import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { StatTile, StatTileGroup } from "@/components/ui/stat-tile"

const meta = {
  title: "Components/Data display/StatTile",
  component: StatTile,
  decorators: [
    (Story, { name }) => (
      <div className={name === "Dashboard row" ? "w-full" : "max-w-xs"}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const ValueAndLabel: Story = {
  name: "Value and label",
  args: { label: "Lopende projecten", value: "24" },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const term = canvas.getByRole("term")
    await expect(term).toHaveTextContent("Lopende projecten")
    await expect(canvas.getByRole("definition")).toHaveTextContent("24")
  },
}

export const WithCaption: Story = {
  name: "With caption",
  args: {
    label: "Openstaande facturen",
    value: "€ 18.420",
    caption: "7 facturen, 2 over de vervaldatum",
    meta: "Vorige maand: € 21.950",
  },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const values = canvas.getAllByRole("definition")
    await expect(values.map((dd) => dd.textContent)).toEqual([
      "€ 18.420",
      "7 facturen, 2 over de vervaldatum",
      "Vorige maand: € 21.950",
    ])
  },
}

export const TrendUp: Story = {
  name: "Trend up",
  args: {
    label: "Omzet deze maand",
    value: "€ 64.300",
    trend: {
      direction: "up",
      tone: "good",
      label: "12 % hoger dan vorige maand",
    },
  },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const trend = canvas.getByText("12 % hoger dan vorige maand")
    await expect(trend).toHaveAttribute("data-tone", "good")
    await expect(trend.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  },
}

export const TrendDown: Story = {
  name: "Trend down",
  args: {
    label: "Gefactureerde uren",
    value: "1.132",
    trend: {
      direction: "down",
      tone: "bad",
      label: "8 % lager dan vorige maand",
    },
  },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const trend = canvas.getByText("8 % lager dan vorige maand")
    await expect(trend).toHaveAttribute("data-direction", "down")
    await expect(trend).toHaveAttribute("data-tone", "bad")
  },
}

export const Loading: Story = {
  args: {
    label: "Omzet deze maand",
    loading: true,
    loadingLabel: "Omzet laden…",
  },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const tile = canvas.getByRole("term").parentElement
    await expect(tile).toHaveAttribute("aria-busy", "true")
    await expect(canvas.getByRole("definition")).toHaveTextContent(
      "Omzet laden…"
    )
    await expect(
      canvas.getByRole("definition").querySelector("[data-slot=skeleton]")
    ).toHaveAttribute("aria-hidden", "true")
  },
}

export const Linked: Story = {
  args: {
    label: "Openstaande facturen",
    value: "€ 18.420",
    caption: "7 facturen, 2 over de vervaldatum",
    href: "#facturen",
  },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Openstaande facturen" })
    await expect(link).toHaveAttribute("href", "#facturen")
    await expect(canvas.getByRole("term")).toContainElement(link)
    await expect(canvas.getAllByRole("link")).toHaveLength(1)
  },
}

export const LinkedFocus: Story = {
  name: "Linked focus",
  args: {
    label: "Openstaande facturen",
    value: "€ 18.420",
    caption: "7 facturen, 2 over de vervaldatum",
    href: "#facturen",
  },
  render: (args) => (
    <StatTileGroup>
      <StatTile {...args} />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Openstaande facturen" })
    await userEvent.tab()
    await expect(link).toHaveFocus()
    // The ring shows on the whole tile, not on the label.
    const tile = link.closest("[data-slot=stat-tile]")
    if (!(tile instanceof HTMLElement)) throw new Error("tile not found")
    await expect(getComputedStyle(tile).outlineStyle).toBe("solid")
    await expect(getComputedStyle(link).outlineStyle).toBe("none")
  },
}

export const DashboardRow: Story = {
  name: "Dashboard row",
  args: { label: "Lopende projecten" },
  render: () => (
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
      />
      <StatTile
        label="Gefactureerde uren"
        value="1.132"
        trend={{
          direction: "down",
          tone: "bad",
          label: "8 % lager dan vorige maand",
        }}
      />
    </StatTileGroup>
  ),
  play: async ({ canvas }) => {
    const terms = canvas.getAllByRole("term")
    await expect(terms).toHaveLength(4)
    const list = terms[0].closest("dl")
    if (!(list instanceof HTMLElement)) throw new Error("list not found")
    await expect(within(list).getAllByRole("definition")).toHaveLength(8)
    const spark = list.querySelector("[data-slot=stat-tile-sparkline]")
    await expect(spark).toHaveAttribute("aria-hidden", "true")
    await expect(spark?.querySelector("circle")).toHaveAttribute("cx", "106")
    await expect(spark?.querySelector("circle")).toHaveAttribute("cy", "10")
  },
}
