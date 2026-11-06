import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsLink,
  TabsList,
  TabsNav,
  TabsTrigger,
} from "@/components/ui/tabs"

const meta = {
  title: "Components/Navigation & layout/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="overzicht">
      <TabsList aria-label="Projectonderdelen">
        <TabsTrigger value="overzicht">Overzicht</TabsTrigger>
        <TabsTrigger value="documenten">Documenten</TabsTrigger>
        <TabsTrigger value="facturen">Facturen</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="overzicht">
        <p>
          Renovatie hoofdkantoor loopt sinds maart 2026 en heeft 12 documenten.
        </p>
      </TabsContent>
      <TabsContent value="documenten">
        <p>12 documenten, waarvan 3 wachten op akkoord.</p>
      </TabsContent>
      <TabsContent value="facturen">
        <p>4 facturen, waarvan 1 openstaand.</p>
      </TabsContent>
      <TabsContent value="team">
        <p>Sanne de Vries, Thomas Bakker en Lotte Jansen.</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overzicht = canvas.getByRole("tab", { name: "Overzicht" })
    const documenten = canvas.getByRole("tab", { name: "Documenten" })
    await expect(canvas.getByRole("tablist")).toHaveAccessibleName(
      "Projectonderdelen"
    )
    await expect(overzicht).toHaveAttribute("aria-selected", "true")
    await expect(overzicht).toHaveAttribute(
      "aria-controls",
      canvas.getByRole("tabpanel").id
    )
    const active = getComputedStyle(overzicht)
    await expect(active.borderBottomColor).toBe(active.color)
    await expect(active.borderBottomWidth).toBe("2px")

    await userEvent.click(documenten)
    await expect(documenten).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(
      "12 documenten, waarvan 3 wachten op akkoord."
    )

    await userEvent.keyboard("{ArrowRight}")
    const facturen = canvas.getByRole("tab", { name: "Facturen" })
    await expect(facturen).toHaveFocus()
    await expect(facturen).toHaveAttribute("aria-selected", "true")

    await userEvent.keyboard("{End}")
    await expect(canvas.getByRole("tab", { name: "Team" })).toHaveFocus()
    await userEvent.keyboard("{Home}")
    await expect(overzicht).toHaveFocus()
    await expect(overzicht).toHaveAttribute("aria-selected", "true")

    await userEvent.tab()
    const panel = canvas.getByRole("tabpanel")
    await expect(panel).toHaveFocus()
    await expect(panel).toHaveTextContent("Renovatie hoofdkantoor loopt")
    await expect(getComputedStyle(panel).outlineStyle).toBe("solid")
  },
}

export const States: Story = {
  render: () => (
    <Tabs defaultValue="overzicht" activationMode="manual">
      <TabsList aria-label="Projectonderdelen">
        <TabsTrigger value="overzicht">Overzicht</TabsTrigger>
        {/* Static preview of the hover look. */}
        <TabsTrigger value="documenten" className="bg-accent">
          Documenten
        </TabsTrigger>
        <TabsTrigger value="facturen">Facturen</TabsTrigger>
        <TabsTrigger value="archief" disabled>
          Archief
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overzicht">
        <p>Het overzicht van Renovatie hoofdkantoor.</p>
      </TabsContent>
      <TabsContent value="documenten">
        <p>De documenten van Renovatie hoofdkantoor.</p>
      </TabsContent>
      <TabsContent value="facturen">
        <p>De facturen van Renovatie hoofdkantoor.</p>
      </TabsContent>
      <TabsContent value="archief">
        <p>Het archief van Renovatie hoofdkantoor.</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overzicht = canvas.getByRole("tab", { name: "Overzicht" })
    const facturen = canvas.getByRole("tab", { name: "Facturen" })
    const archief = canvas.getByRole("tab", { name: "Archief" })

    await userEvent.tab()
    await expect(overzicht).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}{ArrowRight}")
    await expect(facturen).toHaveFocus()
    await expect(getComputedStyle(facturen).outlineStyle).toBe("solid")
    await expect(overzicht).toHaveAttribute("aria-selected", "true")
    await expect(archief).toBeDisabled()

    await userEvent.keyboard("{ArrowRight}")
    await expect(archief).not.toHaveFocus()
    await expect(overzicht).toHaveFocus()

    await userEvent.keyboard("{ArrowLeft}")
    await expect(facturen).toHaveFocus()
  },
}

export const WithCounts: Story = {
  name: "With counts",
  render: () => (
    <Tabs defaultValue="openstaand">
      <TabsList aria-label="Facturen">
        <TabsTrigger value="openstaand">
          Openstaand <Badge count>12</Badge>
        </TabsTrigger>
        <TabsTrigger value="vervallen">
          Vervallen <Badge count>3</Badge>
        </TabsTrigger>
        <TabsTrigger value="betaald">Betaald</TabsTrigger>
      </TabsList>
      <TabsContent value="openstaand">
        <p>12 facturen wachten op betaling.</p>
      </TabsContent>
      <TabsContent value="vervallen">
        <p>3 facturen zijn over de vervaldatum.</p>
      </TabsContent>
      <TabsContent value="betaald">
        <p>Alle betaalde facturen van dit jaar.</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const vervallen = canvas.getByRole("tab", { name: "Vervallen 3" })
    await userEvent.click(vervallen)
    await expect(vervallen).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(
      "3 facturen zijn over de vervaldatum."
    )
  },
}

export const PillLinks: Story = {
  name: "Pill links",
  render: () => (
    <TabsNav aria-label="Instellingen">
      <TabsLink href="#algemeen" active>
        Algemeen
      </TabsLink>
      <TabsLink href="#team">Team</TabsLink>
      {/* Static preview of the hover look. */}
      <TabsLink href="#facturatie" className="bg-accent">
        Facturatie
      </TabsLink>
      <TabsLink href="#meldingen">
        Meldingen{" "}
        <Badge count>
          2 <span className="sr-only">nieuw</span>
        </Badge>
      </TabsLink>
      <TabsLink href="#koppelingen">Koppelingen</TabsLink>
    </TabsNav>
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Instellingen" })
    await expect(nav).toBeVisible()
    await expect(
      canvas.getByRole("link", { name: "Algemeen" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("link", { name: "Meldingen 2 nieuw" })
    ).not.toHaveAttribute("aria-current")
    await expect(canvas.queryByRole("tab")).toBeNull()

    await userEvent.tab()
    const algemeen = canvas.getByRole("link", { name: "Algemeen" })
    await expect(algemeen).toHaveFocus()
    await expect(getComputedStyle(algemeen).outlineStyle).toBe("solid")
    const team = canvas.getByRole("link", { name: "Team" })
    await userEvent.tab()
    await expect(team).toHaveFocus()
    team.blur()
  },
}
