import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Inputs & forms/Label",
  component: Label,
  decorators: [
    (Story) => (
      // Muted and red text need the card surface for contrast.
      <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    htmlFor: "label-default",
    className: "mb-1",
    children: "Projectnaam",
  },
  render: (args) => (
    <>
      <Label {...args} />
      <Input id="label-default" />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Projectnaam"))
    const input = canvas.getByLabelText("Projectnaam")
    await expect(input).toHaveFocus()
    input.blur()
  },
}

export const Required: Story = {
  args: {
    htmlFor: "label-required",
    className: "mb-1",
    required: true,
    children: "Klantnaam",
  },
  render: (args) => (
    <>
      <Label {...args} />
      <Input id="label-required" required />
    </>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Klantnaam" })
    await expect(input).toBeRequired()
  },
}

export const OptionalHint: Story = {
  name: "Optional hint",
  args: {
    htmlFor: "label-optional",
    className: "mb-1",
    optional: true,
    children: "Referentie",
  },
  render: (args) => (
    <>
      <Label {...args} />
      <Input id="label-optional" />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", { name: "Referentie (optioneel)" })
    ).toBeInTheDocument()
  },
}

export const Legend: Story = {
  args: { as: "legend", children: "Factuur versturen via" },
  render: (args) => (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <Label {...args} />
      <Checkbox id="label-legend-mail" label="E-mail" defaultChecked />
      <Checkbox id="label-legend-post" label="Post" />
    </fieldset>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("group", { name: "Factuur versturen via" })
    ).toBeInTheDocument()
  },
}
