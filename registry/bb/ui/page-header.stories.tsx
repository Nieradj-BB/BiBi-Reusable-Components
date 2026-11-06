import type { Meta, StoryObj } from "@storybook/react-vite"
import { DownloadIcon, PencilIcon, PlusIcon } from "lucide-react"
import { expect } from "storybook/test"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderBreadcrumbItem,
  PageHeaderBreadcrumbLink,
  PageHeaderBreadcrumbPage,
  PageHeaderBreadcrumbs,
} from "@/components/ui/page-header"
import { TabsLink, TabsNav } from "@/components/ui/tabs"

const meta = {
  title: "Components/Navigation & layout/PageHeader",
  component: PageHeader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    title: "Projecten",
    subtitle: "Alle lopende en afgeronde projecten van je team",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Projecten" })
    ).toBeVisible()
    await expect(canvas.getAllByRole("heading")).toHaveLength(1)
  },
}

export const WithActions: Story = {
  name: "With actions",
  args: {
    title: "Facturen",
    subtitle: "Verstuurde en openstaande facturen per klant",
    actions: (
      <>
        <Button variant="outline">
          <DownloadIcon aria-hidden="true" />
          Exporteren
        </Button>
        <Button>
          <PlusIcon aria-hidden="true" />
          Nieuwe factuur
        </Button>
      </>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    const heading = canvas.getByRole("heading", { level: 1, name: "Facturen" })
    const exporteren = canvas.getByRole("button", { name: "Exporteren" })
    // Actions follow the title in DOM order.
    await expect(
      heading.compareDocumentPosition(exporteren) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    await userEvent.tab()
    await expect(exporteren).toHaveFocus()
    await userEvent.tab()
    const nieuweFactuur = canvas.getByRole("button", { name: "Nieuwe factuur" })
    await expect(nieuweFactuur).toHaveFocus()
    nieuweFactuur.blur()
  },
}

export const BreadcrumbsAndEyebrow: Story = {
  name: "Breadcrumbs and eyebrow",
  args: {
    eyebrow: "Project",
    title: "Renovatie hoofdkantoor",
    subtitle: "Van Dijk Bouw · projectleider Sanne de Vries",
    breadcrumbs: (
      <PageHeaderBreadcrumbs>
        <PageHeaderBreadcrumbItem>
          <PageHeaderBreadcrumbLink href="#projecten">
            Projecten
          </PageHeaderBreadcrumbLink>
        </PageHeaderBreadcrumbItem>
        <PageHeaderBreadcrumbItem>
          <PageHeaderBreadcrumbLink href="#van-dijk-bouw">
            Van Dijk Bouw
          </PageHeaderBreadcrumbLink>
        </PageHeaderBreadcrumbItem>
        <PageHeaderBreadcrumbItem>
          <PageHeaderBreadcrumbPage>
            Renovatie hoofdkantoor
          </PageHeaderBreadcrumbPage>
        </PageHeaderBreadcrumbItem>
      </PageHeaderBreadcrumbs>
    ),
    actions: (
      <Button variant="outline">
        <PencilIcon aria-hidden="true" />
        Bewerken
      </Button>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Kruimelpad" })
    await expect(nav).toBeVisible()
    await expect(canvas.getByText("Project", { selector: "p" })).toBeVisible()
    await expect(
      canvas.getByText("Renovatie hoofdkantoor", { selector: "span" })
    ).toHaveAttribute("aria-current", "page")

    await userEvent.tab()
    const link = canvas.getByRole("link", { name: "Projecten" })
    await expect(link).toHaveFocus()
    await expect(getComputedStyle(link).outlineStyle).toBe("solid")
    link.blur()
  },
}

export const WithTabs: Story = {
  name: "With tabs",
  args: {
    title: "Instellingen",
    subtitle: "Team, facturatie, meldingen en koppelingen",
    children: (
      <TabsNav aria-label="Instellingen">
        <TabsLink href="#algemeen" active>
          Algemeen
        </TabsLink>
        <TabsLink href="#team">Team</TabsLink>
        <TabsLink href="#facturatie">Facturatie</TabsLink>
        <TabsLink href="#meldingen">
          Meldingen{" "}
          <Badge count>
            2 <span className="sr-only">nieuw</span>
          </Badge>
        </TabsLink>
        <TabsLink href="#koppelingen">Koppelingen</TabsLink>
      </TabsNav>
    ),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("navigation", { name: "Instellingen" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("link", { name: "Algemeen" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("link", { name: "Meldingen 2 nieuw" })
    ).toBeVisible()
  },
}
