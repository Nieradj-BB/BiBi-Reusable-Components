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
