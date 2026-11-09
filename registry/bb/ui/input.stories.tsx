import type { Meta, StoryObj } from "@storybook/react-vite"
import { MailIcon } from "lucide-react"
import { expect, userEvent } from "storybook/test"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Inputs & forms/Input",
  component: Input,
  decorators: [
    (Story) => (
      // Error text needs the card surface for contrast.
      <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { id: "input-default", defaultValue: "Van Dijk Installatietechniek" },
  render: (args) => (
    <>
      <Label htmlFor="input-default" className="mb-1">
        Klantnaam
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Klantnaam")
    await userEvent.clear(input)
    await userEvent.type(input, "Bakker Advies")
    await expect(input).toHaveValue("Bakker Advies")
    await userEvent.clear(input)
    await userEvent.type(input, "Van Dijk Installatietechniek")
    input.blur()
  },
}

export const Placeholder: Story = {
  args: {
    id: "input-placeholder",
    type: "email",
    placeholder: "naam@bedrijf.nl",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-placeholder" className="mb-1">
        E-mailadres
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("E-mailadres")
    await expect(input).toHaveValue("")
    await expect(input).toHaveAttribute("placeholder", "naam@bedrijf.nl")
  },
}

// The hover border is drawn with the hover class so the state stays visible.
export const Hover: Story = {
  args: {
    id: "input-hover",
    defaultValue: "Renovatie Havenkade",
    className: "border-border-strong",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-hover" className="mb-1">
        Projectnaam
      </Label>
      <Input {...args} />
    </>
  ),
}

export const Focus: Story = {
  args: { id: "input-focus", defaultValue: "Sanne de Vries" },
  render: (args) => (
    <>
      <Label htmlFor="input-focus" className="mb-1">
        Contactpersoon
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab()
    const input = canvas.getByLabelText<HTMLInputElement>("Contactpersoon")
    await expect(input).toHaveFocus()
    input.setSelectionRange(input.value.length, input.value.length)
  },
}

export const Disabled: Story = {
  args: { id: "input-disabled", defaultValue: "PRJ-2026-041", disabled: true },
  render: (args) => (
    <>
      <Label htmlFor="input-disabled" className="mb-1">
        Projectnummer
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Projectnummer")).toBeDisabled()
  },
}

export const Invalid: Story = {
  args: {
    id: "input-invalid",
    inputMode: "numeric",
    defaultValue: "twaalf",
    "aria-invalid": true,
    "aria-describedby": "input-invalid-error",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-invalid" className="mb-1">
        Aantal uren
      </Label>
      <Input {...args} />
      <p
        id="input-invalid-error"
        role="alert"
        className="text-sm text-destructive"
      >
        Vul een heel getal in, zoals 12.
      </p>
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Aantal uren")
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription(
      "Vul een heel getal in, zoals 12."
    )
  },
}

export const LeadingIcon: Story = {
  name: "Leading icon",
  args: {
    id: "input-icon",
    type: "email",
    placeholder: "naam@bedrijf.nl",
    leadingIcon: MailIcon,
  },
  render: (args) => (
    <>
      <Label htmlFor="input-icon" className="mb-1">
        E-mailadres
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("E-mailadres")
    await userEvent.type(input, "sanne@bedrijf.nl")
    await expect(input).toHaveValue("sanne@bedrijf.nl")
    await userEvent.clear(input)
    input.blur()
  },
}

export const Prefix: Story = {
  args: {
    id: "input-prefix",
    inputMode: "decimal",
    defaultValue: "4.850,00",
    prefix: "€",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-prefix" className="mb-1">
        Bedrag excl. btw
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Bedrag excl. btw")
    await expect(input).toHaveAccessibleDescription("€")
    await expect(input).toHaveClass("tabular-nums")
    await userEvent.clear(input)
    await userEvent.type(input, "1.200,50")
    await expect(input).toHaveValue("1.200,50")
    await userEvent.clear(input)
    await userEvent.type(input, "4.850,00")
    input.blur()
  },
}

export const Suffix: Story = {
  args: {
    id: "input-suffix",
    inputMode: "decimal",
    defaultValue: "32,5",
    suffix: "uur",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-suffix" className="mb-1">
        Begrote tijd
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Begrote tijd")
    await expect(input).toHaveAccessibleDescription("uur")
    await expect(input).toHaveValue("32,5")
  },
}

export const ReadOnly: Story = {
  name: "Read-only",
  args: {
    id: "input-readonly",
    defaultValue: "2026-044",
    readOnly: true,
    "aria-describedby": "input-readonly-help",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-readonly" className="mb-1">
        Factuurnummer
      </Label>
      <Input {...args} />
      <p id="input-readonly-help" className="text-xs text-muted-foreground">
        Wordt toegekend bij het versturen.
      </p>
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText<HTMLInputElement>("Factuurnummer")
    await expect(input).toHaveAttribute("readonly")
    await expect(input).not.toBeDisabled()
    await expect(input).toHaveAccessibleDescription(
      "Wordt toegekend bij het versturen."
    )
    // Stays in the tab order; typing does not change the value.
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard("9")
    await expect(input).toHaveValue("2026-044")
    input.setSelectionRange(0, 0)
    input.blur()
  },
}

// Test only (hidden from the sidebar): on the read-only fill the unit text is
// dark, because muted text is too light there.
export const ReadOnlyWithPrefix: Story = {
  name: "Read-only with prefix",
  tags: ["!dev", "!autodocs"],
  args: {
    id: "input-readonly-prefix",
    defaultValue: "1.250,00",
    readOnly: true,
    prefix: "€",
  },
  render: (args) => (
    <>
      <Label htmlFor="input-readonly-prefix" className="mb-1">
        Totaal
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByLabelText("Totaal")).toHaveAttribute("readonly")
    const prefix = canvasElement.querySelector('[data-slot="input-prefix"]')
    await expect(prefix).toHaveClass("text-foreground")
    await expect(prefix).not.toHaveClass("text-muted-foreground")
  },
}

export const Date: Story = {
  args: { id: "input-date", type: "date", defaultValue: "2026-11-18" },
  render: (args) => (
    <>
      <Label htmlFor="input-date" className="mb-1">
        Vervaldatum
      </Label>
      <Input {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Vervaldatum")
    await expect(input).toHaveAttribute("type", "date")
    await expect(input).toHaveValue("2026-11-18")
  },
}
