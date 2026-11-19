import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Building2Icon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  PlusIcon,
  ReceiptIcon,
} from "lucide-react"
import { expect, fn, within } from "storybook/test"

import {
  AppShell,
  type AppShellNavItem,
} from "@/components/app-shell/app-shell"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from "@/components/data-table/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormActions, FormField, FormStack } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import {
  PageContent,
  PageSection,
  PageSectionAction,
  PageSectionDescription,
  PageSectionHeader,
  PageSectionTitle,
} from "@/components/ui/page-content"
import { PageHeader } from "@/components/ui/page-header"
import { Textarea } from "@/components/ui/textarea"

const invoices = [
  {
    number: "2026-0412",
    client: "Van Dijk Bouw",
    due: "18 nov 2026",
    amount: "€ 12.480,00",
    late: false,
  },
  {
    number: "2026-0409",
    client: "Hofstede Groep",
    due: "2 dec 2026",
    amount: "€ 3.150,00",
    late: false,
  },
  {
    number: "2026-0398",
    client: "Bakker Installatietechniek",
    due: "28 okt 2026",
    amount: "€ 4.850,00",
    late: true,
  },
]

const projects = [
  {
    name: "Renovatie hoofdkantoor",
    client: "Van Dijk Bouw",
    text: "Ontwerp en vergunning zijn rond; de aanbesteding start in maart.",
  },
  {
    name: "Kantoor Noordkade",
    client: "Hofstede Groep",
    text: "Nieuwbouw van een kantoor met twaalf verdiepingen.",
  },
  {
    name: "Schoolplein De Linde",
    client: "Stichting De Linde",
    text: "Aanleg van een groen schoolplein met een waterspeelplaats.",
  },
]

function InvoicesSection() {
  return (
    <PageSection>
      <PageSectionHeader>
        <PageSectionTitle>Openstaande facturen</PageSectionTitle>
        <PageSectionDescription>
          Verstuurde facturen die nog niet zijn betaald
        </PageSectionDescription>
        <PageSectionAction>
          <Button variant="outline">
            <DownloadIcon aria-hidden="true" />
            Exporteren
          </Button>
        </PageSectionAction>
      </PageSectionHeader>
      <Table>
        <TableCaption>Openstaande facturen</TableCaption>
        <TableHeader>
          <TableRow interactive={false}>
            <TableHead>Factuur</TableHead>
            <TableHead>Klant</TableHead>
            <TableHead nowrap>Vervaldatum</TableHead>
            <TableHead align="end">Bedrag</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.number}>
              <TableRowHeader nowrap>{invoice.number}</TableRowHeader>
              <TableCell>{invoice.client}</TableCell>
              <TableCell nowrap>{invoice.due}</TableCell>
              <TableCell align="end">{invoice.amount}</TableCell>
              <TableCell>
                {invoice.late ? (
                  <Badge variant="destructive">Te laat</Badge>
                ) : (
                  <Badge>Openstaand</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageSection>
  )
}

function ProjectsSection() {
  return (
    <PageSection>
      <PageSectionHeader>
        <PageSectionTitle>Lopende projecten</PageSectionTitle>
        <PageSectionDescription>
          Projecten met uren of kosten in deze maand
        </PageSectionDescription>
        <PageSectionAction>
          <Button variant="outline">Alle projecten</Button>
          <Button>
            <PlusIcon aria-hidden="true" />
            Nieuw project
          </Button>
        </PageSectionAction>
      </PageSectionHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.client}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{project.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageSection>
  )
}

const navItems: AppShellNavItem[] = [
  {
    label: "Overzicht",
    href: "#overzicht",
    icon: LayoutDashboardIcon,
    active: true,
  },
  { label: "Projecten", href: "#projecten", icon: FolderIcon },
  { label: "Klanten", href: "#klanten", icon: Building2Icon },
  { label: "Documenten", href: "#documenten", icon: FileTextIcon },
  { label: "Facturen", href: "#facturen", icon: ReceiptIcon },
]

const meta = {
  title: "Components/Navigation & layout/PageContent",
  component: PageContent,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        page414: {
          name: "414px",
          styles: { width: "414px", height: "896px" },
          type: "mobile",
        },
        page800: {
          name: "800px",
          styles: { width: "800px", height: "1000px" },
          type: "tablet",
        },
        page1280: {
          name: "1280px",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
} satisfies Meta<typeof PageContent>

export default meta
type Story = StoryObj<typeof meta>

function getSlot(root: HTMLElement, slot: string) {
  const element = root.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  if (!element) throw new Error(`No ${slot} element`)
  return element
}

const box = (element: Element) => element.getBoundingClientRect()

// Page padding: 24px, and 32px left and right from 1024px.
const pagePadding = () =>
  window.matchMedia("(min-width: 1024px)").matches ? 32 : 24

export const Sections: Story = {
  globals: { viewport: { value: "page800", isRotated: false } },
  render: () => (
    <>
      <PageHeader
        title="Overzicht"
        subtitle="Facturen en projecten van deze maand"
      />
      <PageContent>
        <InvoicesSection />
        <ProjectsSection />
      </PageContent>
    </>
  ),
  play: async ({ canvas, canvasElement }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Overzicht" })
    const sectionTitles = canvas.getAllByRole("heading", { level: 2 })
    await expect(sectionTitles.map((heading) => heading.textContent)).toEqual([
      "Openstaande facturen",
      "Lopende projecten",
    ])
    await expect(canvas.getAllByRole("heading", { level: 3 })).toHaveLength(3)

    const sections = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="page-section"]'
    )
    await expect(sections).toHaveLength(2)
    for (const section of sections) {
      await expect(section.tagName).toBe("SECTION")
      await expect(
        within(section).getAllByRole("heading", { level: 2 })
      ).toHaveLength(1)
    }

    // The header and the content share the page padding.
    const content = getSlot(canvasElement, "page-content")
    await expect(box(sectionTitles[0]).left).toBeCloseTo(box(title).left, 0)
    await expect(box(title).left - box(content).left).toBeCloseTo(
      pagePadding(),
      0
    )

    // The action sits top right, level with the section title.
    const action = getSlot(sections[0], "page-section-action")
    await expect(box(action).top).toBeCloseTo(box(sectionTitles[0]).top, 0)
    await expect(box(action).right).toBeCloseTo(box(sections[0]).right, 0)
  },
}

export const ReadableWidth: Story = {
  name: "Readable width",
  globals: { viewport: { value: "page1280", isRotated: false } },
  render: () => (
    <PageContent width="readable">
      <PageSection>
        <PageSectionHeader>
          <PageSectionTitle>Projectgegevens</PageSectionTitle>
          <PageSectionDescription>
            Naam, klant en omschrijving zoals ze op offertes en facturen staan
          </PageSectionDescription>
        </PageSectionHeader>
        <FormStack asChild>
          <form aria-label="Projectgegevens">
            <FormField label="Projectnaam" required>
              <Input defaultValue="Renovatie hoofdkantoor" />
            </FormField>
            <FormField label="Klant" required>
              <Input defaultValue="Van Dijk Bouw" />
            </FormField>
            <FormField
              label="Omschrijving"
              optional
              help="Zichtbaar voor iedereen in het projectteam."
            >
              <Textarea rows={4} />
            </FormField>
            <FormActions>
              <Button type="button" variant="outline">
                Annuleren
              </Button>
              <Button type="submit">Opslaan</Button>
            </FormActions>
          </form>
        </FormStack>
      </PageSection>
      <PageSection>
        <PageSectionHeader>
          <PageSectionTitle>Werkwijze</PageSectionTitle>
        </PageSectionHeader>
        <p className="text-sm/relaxed text-foreground">
          Elk project krijgt een vaste projectleider die de planning bewaakt en
          het eerste aanspreekpunt is voor de klant. Uren en kosten worden
          wekelijks bijgewerkt, zodat de stand van het budget altijd klopt. Aan
          het eind van elke fase volgt een korte evaluatie met de klant, waarna
          de volgende fase wordt ingepland.
        </p>
      </PageSection>
    </PageContent>
  ),
  play: async ({ canvas, canvasElement }) => {
    const content = getSlot(canvasElement, "page-content")
    await expect(content).toHaveAttribute("data-width", "readable")
    await expect(canvas.getByLabelText(/Projectnaam/)).toBeVisible()

    // The page padding, then a column of at most 768px.
    const padding = pagePadding()
    const section = getSlot(canvasElement, "page-section")
    await expect(box(section).left - box(content).left).toBeCloseTo(padding, 0)
    await expect(box(section).width).toBeCloseTo(
      Math.min(768, box(content).width - 2 * padding),
      0
    )
    await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(2)
  },
}

export const NestedSection: Story = {
  name: "Nested section",
  render: () => (
    <PageContent>
      <PageSection>
        <PageSectionHeader>
          <PageSectionTitle>Facturatie</PageSectionTitle>
          <PageSectionDescription>
            Hoe en wanneer facturen naar klanten gaan
          </PageSectionDescription>
        </PageSectionHeader>
        <PageSection>
          <PageSectionHeader>
            <PageSectionTitle asChild className="text-base">
              <h3>Betaaltermijn</h3>
            </PageSectionTitle>
            <PageSectionDescription>
              Geldt voor nieuwe facturen; lopende facturen houden hun termijn
            </PageSectionDescription>
          </PageSectionHeader>
          <Card>
            <CardContent>
              <p>30 dagen na de factuurdatum</p>
            </CardContent>
          </Card>
        </PageSection>
        <PageSection>
          <PageSectionHeader>
            <PageSectionTitle asChild className="text-base">
              <h3>Herinneringen</h3>
            </PageSectionTitle>
            <PageSectionDescription>
              Gaan automatisch naar de contactpersoon van de klant
            </PageSectionDescription>
            <PageSectionAction>
              <Button variant="outline">
                <PlusIcon aria-hidden="true" />
                Herinnering toevoegen
              </Button>
            </PageSectionAction>
          </PageSectionHeader>
          <Card>
            <CardContent>
              <p>7 dagen na de vervaldatum, daarna elke 14 dagen</p>
            </CardContent>
          </Card>
        </PageSection>
      </PageSection>
    </PageContent>
  ),
  play: async ({ canvas, canvasElement }) => {
    const parentTitle = canvas.getByRole("heading", {
      level: 2,
      name: "Facturatie",
    })
    const parent = parentTitle.closest("section")
    await expect(parent).not.toBeNull()
    if (!parent) return

    const nestedTitles = within(parent).getAllByRole("heading", { level: 3 })
    await expect(nestedTitles.map((heading) => heading.textContent)).toEqual([
      "Betaaltermijn",
      "Herinneringen",
    ])
    for (const heading of nestedTitles) {
      await expect(heading).toHaveAttribute("data-slot", "page-section-title")
      await expect(heading.closest("section")?.parentElement).toBe(parent)
      await expect(box(heading).left).toBeCloseTo(box(parentTitle).left, 0)
    }
    await expect(
      canvasElement.querySelectorAll('[data-slot="page-section"]')
    ).toHaveLength(3)

    const action = getSlot(canvasElement, "page-section-action")
    await expect(box(action).top).toBeCloseTo(box(nestedTitles[1]).top, 0)
  },
}

export const InAppShell: Story = {
  name: "In app shell",
  globals: { viewport: { value: "page1280", isRotated: false } },
  render: () => (
    <AppShell
      appName="Projecten"
      navItems={navItems}
      user={{ name: "Sanne de Vries" }}
      onSignOut={fn()}
      className="h-200"
    >
      <PageHeader
        title="Overzicht"
        subtitle="Facturen en projecten van deze maand"
        actions={
          <Button>
            <PlusIcon aria-hidden="true" />
            Nieuwe factuur
          </Button>
        }
      />
      <PageContent>
        <InvoicesSection />
        <ProjectsSection />
      </PageContent>
    </AppShell>
  ),
  play: async ({ canvas, canvasElement }) => {
    const main = canvas.getByRole("main")
    const title = within(main).getByRole("heading", {
      level: 1,
      name: "Overzicht",
    })
    const content = getSlot(main, "page-content")
    await expect(canvas.getAllByRole("main")).toHaveLength(1)
    await expect(content.parentElement).toBe(main)

    // The header and the content share the page padding.
    const sectionTitles = within(content).getAllByRole("heading", { level: 2 })
    for (const heading of sectionTitles) {
      await expect(box(heading).left).toBeCloseTo(box(title).left, 0)
    }
    await expect(box(title).left - box(content).left).toBeCloseTo(
      pagePadding(),
      0
    )

    // Header actions and section actions end on the same line.
    const headerActions = getSlot(canvasElement, "page-header-actions")
    const sectionAction = getSlot(content, "page-section-action")
    await expect(box(sectionAction).right).toBeCloseTo(
      box(headerActions).right,
      0
    )
  },
}

export const Mobile: Story = {
  globals: { viewport: { value: "page414", isRotated: false } },
  render: () => (
    <>
      <PageHeader
        title="Overzicht"
        subtitle="Facturen en projecten van deze maand"
      />
      <PageContent>
        <ProjectsSection />
      </PageContent>
    </>
  ),
  play: async ({ canvas, canvasElement }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Overzicht" })
    const sectionTitle = canvas.getByRole("heading", {
      level: 2,
      name: "Lopende projecten",
    })
    await expect(box(sectionTitle).left).toBeCloseTo(box(title).left, 0)
    await expect(box(title).left).toBeCloseTo(pagePadding(), 0)

    // Below a 448px header the action wraps under the description, 16px down.
    const description = getSlot(canvasElement, "page-section-description")
    const action = getSlot(canvasElement, "page-section-action")
    await expect(box(action).top - box(description).bottom).toBeCloseTo(16, 0)
    await expect(box(action).left).toBeCloseTo(box(sectionTitle).left, 0)
  },
}

// Test only (hidden from the sidebar): a section with `items-start`, so a
// lone button keeps its own width; the header still spans the section.
export const SectionAlignedToStart: Story = {
  name: "Section aligned to start",
  tags: ["!dev", "!autodocs"],
  globals: { viewport: { value: "page1280", isRotated: false } },
  render: () => (
    <PageContent>
      <PageSection className="items-start">
        <PageSectionHeader>
          <PageSectionTitle>Openstaande facturen</PageSectionTitle>
          <PageSectionDescription>
            Verstuurde facturen die nog niet zijn betaald
          </PageSectionDescription>
          <PageSectionAction>
            <Button variant="outline">Exporteren</Button>
          </PageSectionAction>
        </PageSectionHeader>
        <Button>Factuur toevoegen</Button>
      </PageSection>
    </PageContent>
  ),
  play: async ({ canvas, canvasElement }) => {
    const section = getSlot(canvasElement, "page-section")
    const header = getSlot(section, "page-section-header")
    await expect(box(header).width).toBeCloseTo(box(section).width, 0)

    // The title stays on one line and the action sits top right.
    const title = canvas.getByRole("heading", {
      level: 2,
      name: "Openstaande facturen",
    })
    const action = getSlot(section, "page-section-action")
    await expect(box(title).height).toBeCloseTo(28, 0)
    await expect(box(action).top).toBeCloseTo(box(title).top, 0)
    await expect(box(action).right).toBeCloseTo(box(section).right, 0)
    await expect(
      box(canvas.getByRole("button", { name: "Factuur toevoegen" })).width
    ).toBeLessThan(box(section).width)
  },
}
