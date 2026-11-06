import type { Meta, StoryObj } from "@storybook/react-vite"
import { Briefcase, Calendar, Clock, Image } from "lucide-react"
import { expect, userEvent } from "storybook/test"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardMedia,
  CardMeta,
  CardMetaItem,
  CardTitle,
} from "@/components/ui/card"

const meta = {
  title: "Components/Data display/Card",
  component: Card,
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "elevated", "interactive"],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

function ProjectCard({
  className,
  selected = false,
}: {
  className?: string
  selected?: boolean
}) {
  return (
    <Card variant="interactive" className={className} asChild>
      <article>
        <CardHeader>
          <CardTitle>
            <CardLink href="#kantoor-noordkade" selected={selected}>
              Kantoor Noordkade
            </CardLink>
          </CardTitle>
          <CardDescription>
            Nieuwbouw van een kantoor met twaalf verdiepingen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardMeta>
            <CardMetaItem>
              <Briefcase aria-hidden="true" />
              <span>Hofstede Groep</span>
            </CardMetaItem>
            <CardMetaItem>
              <Calendar aria-hidden="true" />
              <span>Oplevering juni 2027</span>
            </CardMetaItem>
          </CardMeta>
        </CardContent>
      </article>
    </Card>
  )
}

export const Flat: Story = {
  args: { variant: "flat" },
  render: (args) => (
    <Card {...args} asChild>
      <section aria-labelledby="card-flat-title">
        <CardHeader>
          <CardTitle id="card-flat-title">Projectplan</CardTitle>
          <CardDescription>Hofstede Groep · fase 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Ontwerp en vergunning zijn rond. De aanbesteding start in maart.
          </p>
        </CardContent>
      </section>
    </Card>
  ),
}

export const Elevated: Story = {
  args: { variant: "elevated" },
  render: (args) => (
    <Card {...args} asChild>
      <section aria-labelledby="card-elevated-title">
        <CardHeader>
          <CardTitle id="card-elevated-title">Kwartaalrapportage</CardTitle>
          <CardDescription>Derde kwartaal 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Omzet, uren en openstaande facturen per klant.</p>
        </CardContent>
      </section>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => <ProjectCard />,
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Kantoor Noordkade" })
    await expect(link).toHaveAttribute("href", "#kantoor-noordkade")
    await expect(link).not.toHaveAttribute("aria-current")
    await expect(canvas.getByRole("heading", { level: 3 })).toContainElement(
      link
    )
  },
}

// Static preview of the hover look; real hover raises the same shadow.
export const InteractiveHover: Story = {
  name: "Interactive hover",
  render: () => <ProjectCard className="shadow-tile-hover" />,
}

export const InteractiveFocus: Story = {
  name: "Interactive focus",
  render: () => <ProjectCard />,
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Kantoor Noordkade" })
    await userEvent.tab()
    await expect(link).toHaveFocus()
    const card = link.closest("[data-slot=card]")
    if (!(card instanceof HTMLElement)) throw new Error("Card not found")
    await expect(getComputedStyle(card).outlineStyle).toBe("solid")
    await expect(getComputedStyle(link).outlineStyle).toBe("none")

    await userEvent.tab()
    await expect(link).not.toHaveFocus()
    await expect(getComputedStyle(card).outlineStyle).toBe("none")

    await userEvent.tab({ shift: true })
    await expect(link).toHaveFocus()
    await expect(getComputedStyle(card).outlineStyle).toBe("solid")
  },
}

export const Selected: Story = {
  render: () => <ProjectCard selected />,
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Kantoor Noordkade" })
    await expect(link).toHaveAttribute("aria-current", "true")
  },
}

export const HeaderBodyAndFooter: Story = {
  name: "Header, body and footer",
  args: { variant: "elevated" },
  render: (args) => (
    <Card {...args} asChild>
      <section aria-labelledby="card-invoice-title">
        <CardHeader>
          <CardTitle id="card-invoice-title">Factuur 2026-0412</CardTitle>
          <CardDescription>
            Van Dijk Bouw · vervalt op 18 november
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Totaal € 12.480,00 voor 96 uur advies in oktober.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            Downloaden
          </Button>
          <Button size="sm">Versturen</Button>
        </CardFooter>
      </section>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Downloaden" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Versturen" })
    ).toBeVisible()
  },
}

export const MediaWithBadge: Story = {
  name: "Media with badge",
  render: () => (
    <Card variant="interactive" asChild>
      <article>
        <CardMedia>
          <Image aria-hidden="true" />
          <Badge variant="default">Concept</Badge>
        </CardMedia>
        <CardHeader>
          <CardTitle>
            <CardLink href="#renovatie-stadskantoor">
              Renovatie Stadskantoor
            </CardLink>
          </CardTitle>
          <CardDescription>
            Verduurzaming van de gevel en de installaties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardMeta>
            <CardMetaItem>
              <Briefcase aria-hidden="true" />
              <span>Van Dijk Bouw</span>
            </CardMetaItem>
            <CardMetaItem>
              <Clock aria-hidden="true" />
              <span>Gestart in september</span>
            </CardMetaItem>
          </CardMeta>
        </CardContent>
      </article>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Concept")).toBeVisible()
    await expect(
      canvas.getByRole("link", { name: "Renovatie Stadskantoor" })
    ).toBeVisible()
  },
}
