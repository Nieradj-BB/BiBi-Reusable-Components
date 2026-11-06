import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statuses = ["Concept", "Verzonden", "Betaald", "Vervallen"]
const clients = [
  "Bakker Advies",
  "De Wit Logistiek",
  "Jansen Bouw",
  "Van Dijk Installatietechniek",
]

const meta = {
  title: "Components/Inputs & forms/Select",
  component: Select,
  decorators: [
    (Story) => (
      // Muted and red text need the card surface for contrast.
      <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: { defaultValue: "Verzonden" },
  render: (args) => (
    <>
      <Label htmlFor="select-closed" className="mb-1">
        Status
      </Label>
      <Select {...args}>
        <SelectTrigger id="select-closed">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Status" })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toHaveTextContent("Verzonden")

    await userEvent.click(trigger)
    const body = within(document.body)
    const listbox = await body.findByRole("listbox")
    await expect(
      within(listbox).getByRole("option", { name: "Verzonden" })
    ).toHaveAttribute("aria-selected", "true")

    await userEvent.click(
      within(listbox).getByRole("option", { name: "Betaald" })
    )
    await waitFor(() => expect(body.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Betaald")
    await expect(trigger).toHaveFocus()

    // Escape closes without a change and returns focus to the trigger.
    await userEvent.keyboard("{Enter}")
    await body.findByRole("listbox")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveTextContent("Betaald")

    // Typing jumps to a matching option; Enter selects it.
    await userEvent.keyboard("{Enter}")
    const reopened = await body.findByRole("listbox")
    await userEvent.keyboard("Verz")
    await waitFor(() =>
      expect(
        within(reopened).getByRole("option", { name: "Verzonden" })
      ).toHaveFocus()
    )
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(body.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Verzonden")
    trigger.blur()
  },
}

export const Placeholder: Story = {
  render: (args) => (
    <>
      <Label htmlFor="select-placeholder" className="mb-1">
        Klant
      </Label>
      <Select {...args}>
        <SelectTrigger id="select-placeholder">
          <SelectValue placeholder="Kies een klant" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client} value={client}>
              {client}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Klant" })
    await expect(trigger).toHaveAttribute("data-placeholder")
    await expect(trigger).toHaveTextContent("Kies een klant")
  },
}

export const Open: Story = {
  args: { defaultValue: "Verzonden" },
  render: (args) => (
    <>
      <Label htmlFor="select-open" className="mb-1">
        Status
      </Label>
      <Select {...args}>
        <SelectTrigger id="select-open">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Status" })
    trigger.focus()
    await userEvent.keyboard("{Enter}")
    const body = within(document.body)
    const listbox = await body.findByRole("listbox")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(
        within(listbox).getByRole("option", { name: "Verzonden" })
      ).toHaveFocus()
    )

    await userEvent.keyboard("{ArrowDown}")
    await expect(
      within(listbox).getByRole("option", { name: "Betaald" })
    ).toHaveAttribute("data-highlighted")
  },
}

export const Focus: Story = {
  args: { defaultValue: "30 dagen" },
  render: (args) => (
    <>
      <Label htmlFor="select-focus" className="mb-1">
        Betaaltermijn
      </Label>
      <Select {...args}>
        <SelectTrigger id="select-focus">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["14 dagen", "30 dagen", "60 dagen"].map((term) => (
            <SelectItem key={term} value={term}>
              {term}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(
      canvas.getByRole("combobox", { name: "Betaaltermijn" })
    ).toHaveFocus()
  },
}

export const Disabled: Story = {
  args: { defaultValue: "Euro", disabled: true },
  render: (args) => (
    <>
      <Label htmlFor="select-disabled" className="mb-1">
        Valuta
      </Label>
      <Select {...args}>
        <SelectTrigger id="select-disabled">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Euro">Euro</SelectItem>
          <SelectItem value="Britse pond">Britse pond</SelectItem>
        </SelectContent>
      </Select>
    </>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Valuta" })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  },
}

export const Invalid: Story = {
  render: (args) => (
    <>
      <Label htmlFor="select-invalid" className="mb-1">
        Klant
      </Label>
      <Select {...args}>
        <SelectTrigger
          id="select-invalid"
          aria-invalid
          aria-describedby="select-invalid-error"
        >
          <SelectValue placeholder="Kies een klant" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client} value={client}>
              {client}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p
        id="select-invalid-error"
        role="alert"
        className="text-sm text-destructive"
      >
        Kies een klant.
      </p>
    </>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Klant" })
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger).toHaveAccessibleDescription("Kies een klant.")
  },
}
