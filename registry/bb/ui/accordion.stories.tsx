import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

const meta = {
  title: "Components/Data display/Accordion",
  component: Accordion,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <p className="mb-1 font-semibold text-primary">{label}</p>
      <p>{children}</p>
    </div>
  )
}

export const Closed: Story = {
  render: () => (
    <Accordion>
      <AccordionItem value="figures">
        <AccordionTrigger>Alle cijfers</AccordionTrigger>
        <AccordionContent>
          <p>Alle uren per maand, per team.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Alle cijfers" })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Alle cijfers" })
    ).toContainElement(trigger)
    await expect(
      canvas.queryByText("Alle uren per maand, per team.")
    ).toBeNull()

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    const region = canvas.getByRole("region", { name: "Alle cijfers" })
    await expect(trigger).toHaveAttribute("aria-controls", region.id)
    await expect(region).toHaveTextContent("Alle uren per maand, per team.")

    // Single and collapsible by default: the open section closes again.
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    trigger.blur()
  },
}

export const Open: Story = {
  render: () => (
    <Accordion defaultValue="counting">
      <AccordionItem value="counting">
        <AccordionTrigger>Zo tellen we</AccordionTrigger>
        <AccordionContent>
          <Field label="Uren">
            Alle geschreven uren, ook de uren die niet worden gefactureerd.
          </Field>
          <Field label="Facturen">
            Alleen verstuurde facturen; concepten tellen niet mee.
          </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Zo tellen we" })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(trigger).toHaveAttribute("data-state", "open")
    await expect(
      canvas.getByRole("region", { name: "Zo tellen we" })
    ).toHaveTextContent("Facturen")
  },
}

export const Focus: Story = {
  render: () => (
    <Accordion>
      <AccordionItem value="figures">
        <AccordionTrigger>Alle cijfers</AccordionTrigger>
        <AccordionContent>
          <p>Alle uren per maand, per team.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Alle cijfers" })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await expect(getComputedStyle(trigger).outlineStyle).toBe("solid")

    await userEvent.keyboard("{Enter}")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await userEvent.keyboard(" ")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toHaveFocus()
  },
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["billing", "terms"]}>
      <AccordionItem value="billing">
        <AccordionTrigger>Facturatie</AccordionTrigger>
        <AccordionContent>
          <p>Facturen gaan op de eerste werkdag van de maand de deur uit.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="terms">
        <AccordionTrigger>Betaaltermijn</AccordionTrigger>
        <AccordionContent>
          <p>Klanten betalen binnen 30 dagen na de factuurdatum.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="reminders">
        <AccordionTrigger>Herinneringen</AccordionTrigger>
        <AccordionContent>
          <p>Na 14 dagen volgt een herinnering per e-mail.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    const billing = canvas.getByRole("button", { name: "Facturatie" })
    const terms = canvas.getByRole("button", { name: "Betaaltermijn" })
    const reminders = canvas.getByRole("button", { name: "Herinneringen" })
    await expect(billing).toHaveAttribute("aria-expanded", "true")
    await expect(terms).toHaveAttribute("aria-expanded", "true")
    await expect(reminders).toHaveAttribute("aria-expanded", "false")

    // Opening one section leaves the others as they are.
    await userEvent.click(reminders)
    await expect(reminders).toHaveAttribute("aria-expanded", "true")
    await expect(billing).toHaveAttribute("aria-expanded", "true")

    // Arrow keys, Home and End move between triggers.
    await userEvent.keyboard("{ArrowUp}")
    await expect(terms).toHaveFocus()
    await userEvent.keyboard("{Home}")
    await expect(billing).toHaveFocus()
    await userEvent.keyboard("{End}")
    await expect(reminders).toHaveFocus()

    await userEvent.keyboard("{Enter}")
    await expect(reminders).toHaveAttribute("aria-expanded", "false")
    reminders.blur()
  },
}

export const ItemsInACard: Story = {
  name: "Items in a card",
  render: () => (
    <Card asChild>
      <section aria-labelledby="accordion-projects-title">
        <div className="p-5">
          <h3 id="accordion-projects-title" className="mb-3 text-base">
            Projecten (3)
          </h3>
          <Accordion variant="item" defaultValue="portal">
            <AccordionItem value="case-system">
              <AccordionTrigger
                headingLevel={4}
                meta="Gemeente Westerveld · gepland"
              >
                Nieuw zaaksysteem
              </AccordionTrigger>
              <AccordionContent>
                <p>Start in februari 2027, na de aanbesteding.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="portal">
              <AccordionTrigger
                headingLevel={4}
                meta="Hofstede Advies · loopt tot maart 2027"
              >
                Klantportaal
              </AccordionTrigger>
              <AccordionContent>
                <Field label="Omschrijving">
                  Een portaal waarin klanten hun aanvragen, documenten en
                  facturen zien.
                </Field>
                <Field label="Stand van zaken">
                  De eerste versie staat klaar voor de acceptatietest.
                </Field>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rostering">
              <AccordionTrigger
                headingLevel={4}
                meta="Kanaalzicht Zorg · afgerond"
              >
                Roosterpakket
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Selectie en invoering van een roosterpakket voor drie
                  locaties.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </Card>
  ),
  play: async ({ canvas }) => {
    const portal = canvas.getByRole("button", { name: /^Klantportaal/ })
    const caseSystem = canvas.getByRole("button", {
      name: /^Nieuw zaaksysteem/,
    })
    await expect(portal).toHaveAttribute("aria-expanded", "true")
    await expect(portal).toHaveTextContent(
      "Hofstede Advies · loopt tot maart 2027"
    )
    await expect(canvas.getAllByRole("heading", { level: 4 })).toHaveLength(3)
    await expect(portal.closest("[data-slot=accordion-item]")).toHaveAttribute(
      "data-state",
      "open"
    )

    // Type single: opening another section closes the open one.
    await userEvent.click(caseSystem)
    await expect(caseSystem).toHaveAttribute("aria-expanded", "true")
    await expect(portal).toHaveAttribute("aria-expanded", "false")
    await expect(
      within(
        canvas.getByRole("region", { name: /^Nieuw zaaksysteem/ })
      ).getByText("Start in februari 2027, na de aanbesteding.")
    ).toBeVisible()

    // Back to the documented state: the second item open.
    await userEvent.click(portal)
    await expect(portal).toHaveAttribute("aria-expanded", "true")
    portal.blur()
  },
}

// Test only (hidden from the sidebar): the item variant directly on the page
// background keeps the muted meta text readable.
export const ItemsOnThePage: Story = {
  name: "Items on the page",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <Accordion variant="item">
      <AccordionItem value="case-system">
        <AccordionTrigger meta="Gemeente Westerveld · gepland">
          Nieuw zaaksysteem
        </AccordionTrigger>
        <AccordionContent>
          <p>Start in februari 2027, na de aanbesteding.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="rostering">
        <AccordionTrigger meta="Kanaalzicht Zorg · afgerond">
          Roosterpakket
        </AccordionTrigger>
        <AccordionContent>
          <p>Selectie en invoering van een roosterpakket.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /^Roosterpakket/ })
    ).toHaveAttribute("aria-expanded", "false")
  },
}
