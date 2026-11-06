import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetSection,
  SheetSectionTitle,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const meta = {
  title: "Components/Overlays/Sheet",
  component: SheetContent,
} satisfies Meta<typeof SheetContent>

export default meta
type Story = StoryObj<typeof meta>

function Fields({
  items,
}: {
  items: { term: string; value: React.ReactNode }[]
}) {
  return (
    <dl className="grid gap-5">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="mb-1 text-sm font-semibold text-primary">
            {item.term}
          </dt>
          <dd className="text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-1">{children}</div>
}

export const DetailPanel: Story = {
  name: "Detail panel",
  render: () => (
    <Sheet>
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm">Renovatie hoofdkantoor · Van Dijk Bouw</p>
        <SheetTrigger asChild>
          <Button variant="outline">Details bekijken</Button>
        </SheetTrigger>
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Renovatie hoofdkantoor</SheetTitle>
          <SheetDescription>
            Van Dijk Bouw · gestart op 3 maart 2026
          </SheetDescription>
        </SheetHeader>
        <SheetBody role="region" aria-label="Projectgegevens">
          <SheetSection>
            <SheetSectionTitle>Gegevens</SheetSectionTitle>
            <Fields
              items={[
                { term: "Projectleider", value: "Sanne de Vries" },
                { term: "Budget", value: "€ 48.500" },
                {
                  term: "Status",
                  value: <Badge variant="brand">Lopend</Badge>,
                },
              ]}
            />
          </SheetSection>
          <SheetSection>
            <SheetSectionTitle>Omschrijving</SheetSectionTitle>
            <p className="text-sm">
              Vervanging van de klimaatinstallatie en nieuwe indeling van de
              tweede verdieping, in drie fasen tot eind 2026.
            </p>
          </SheetSection>
          <SheetSection>
            <SheetSectionTitle>Documenten</SheetSectionTitle>
            <Fields
              items={[
                {
                  term: "Offerte-renovatie.pdf",
                  value: "Toegevoegd door Ahmed Bakker",
                },
                {
                  term: "Planning-fase-2.xlsx",
                  value: "Toegevoegd door Lotte Jansen",
                },
              ]}
            />
          </SheetSection>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Sluiten</Button>
          </SheetClose>
          <Button>Project openen</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Details bekijken" })

    await userEvent.click(trigger)
    const panel = await body.findByRole("complementary", {
      name: "Renovatie hoofdkantoor",
    })
    await expect(panel.tagName).toBe("ASIDE")
    await waitFor(() => expect(panel).toHaveFocus())

    // Non-modal: the page stays usable and a click on it keeps the panel open.
    await userEvent.click(canvas.getByText(/Renovatie hoofdkantoor ·/))
    await expect(panel).toBeInTheDocument()
    await expect(canvasElement).not.toHaveAttribute("aria-hidden")

    await userEvent.click(body.getByRole("button", { name: "Paneel sluiten" }))
    await waitFor(() => expect(body.queryByRole("complementary")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("complementary", { name: "Renovatie hoofdkantoor" })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("complementary")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("complementary", { name: "Renovatie hoofdkantoor" })
  },
}

export const ModalForm: Story = {
  name: "Modal form",
  render: () => (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button variant="outline">Factuur bewerken</Button>
      </SheetTrigger>
      <SheetContent closeLabel="Venster sluiten">
        <SheetHeader>
          <SheetTitle>Factuur bewerken</SheetTitle>
          <SheetDescription>
            Factuur 2026-0142 · Noordkade Vastgoed
          </SheetDescription>
        </SheetHeader>
        <SheetBody role="region" aria-label="Factuurgegevens">
          <Field>
            <Label htmlFor="sheet-modal-ref" className="mb-1">
              Referentie
            </Label>
            <Input id="sheet-modal-ref" defaultValue="PO-88213" />
          </Field>
          <Field>
            <Label htmlFor="sheet-modal-amount" className="mb-1">
              Bedrag excl. btw
            </Label>
            <Input
              id="sheet-modal-amount"
              inputMode="decimal"
              defaultValue="12.450,00"
            />
          </Field>
          <Field>
            <Label htmlFor="sheet-modal-due" className="mb-1">
              Vervaldatum
            </Label>
            <Input
              id="sheet-modal-due"
              defaultValue="30-11-2026"
              aria-describedby="sheet-modal-due-help"
            />
            <p
              id="sheet-modal-due-help"
              className="text-xs text-muted-foreground"
            >
              Standaard 30 dagen na verzending.
            </p>
          </Field>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Annuleren</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Opslaan</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Factuur bewerken" })

    await userEvent.click(trigger)
    const sheet = await body.findByRole("dialog", { name: "Factuur bewerken" })
    await expect(sheet).toHaveAttribute("aria-modal", "true")
    await expect(
      document.querySelector("[data-slot=sheet-overlay]")
    ).toBeInTheDocument()
    await waitFor(() => expect(body.getByLabelText("Referentie")).toHaveFocus())
    // The focus trap keeps Shift+Tab inside the sheet.
    await userEvent.tab({ shift: true })
    await expect(sheet.contains(document.activeElement)).toBe(true)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Factuur bewerken" })
  },
}

// Test only (hidden from the sidebar): Radix adds a hidden native <select>
// inside a form; focus must land on the visible trigger instead.
export const SelectFirstInForm: Story = {
  name: "Select first in form",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button variant="outline">Status wijzigen</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Status wijzigen</SheetTitle>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => event.preventDefault()}
        >
          <SheetBody>
            <Field>
              <Label htmlFor="sheet-select-status" className="mb-1">
                Status
              </Label>
              <Select name="status" defaultValue="open">
                <SelectTrigger id="sheet-select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Afgerond</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="sheet-select-note" className="mb-1">
                Opmerking
              </Label>
              <Input id="sheet-select-note" />
            </Field>
          </SheetBody>
        </form>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)

    await userEvent.click(
      canvas.getByRole("button", { name: "Status wijzigen" })
    )
    const sheet = await body.findByRole("dialog", { name: "Status wijzigen" })
    await expect(sheet.querySelector("select[aria-hidden=true]")).not.toBeNull()
    await waitFor(() =>
      expect(body.getByRole("combobox", { name: "Status" })).toHaveFocus()
    )
    // The body region is named by the sheet title when no label is passed.
    await expect(
      body.getByRole("region", { name: "Status wijzigen" })
    ).toBeInTheDocument()
  },
}

export const Unavailable: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Project bekijken</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="sr-only">Project</SheetTitle>
          <SheetDescription className="mt-0 pt-1.5">
            Dit project is niet (meer) beschikbaar.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Project bekijken" })

    await userEvent.click(trigger)
    const panel = await body.findByRole("complementary", { name: "Project" })
    await expect(panel).toHaveAccessibleDescription(
      "Dit project is niet (meer) beschikbaar."
    )
    await waitFor(() => expect(panel).toHaveFocus())

    await userEvent.click(body.getByRole("button", { name: "Paneel sluiten" }))
    await waitFor(() => expect(body.queryByRole("complementary")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("complementary", { name: "Project" })
  },
}
