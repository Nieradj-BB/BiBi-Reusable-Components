import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Inputs & forms/Checkbox",
  component: Checkbox,
  decorators: [
    (Story) => (
      // Muted description text needs the card surface for contrast.
      <div className="w-full max-w-sm rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  args: { label: "Herinnering sturen" },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Herinnering sturen",
    })
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(canvas.getByText("Herinnering sturen"))
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    checkbox.blur()
  },
}

export const Checked: Story = {
  args: { label: "Factuur per e-mail versturen", defaultChecked: true },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Factuur per e-mail versturen",
    })
    await expect(checkbox).toBeChecked()
    await userEvent.keyboard("{Tab}")
    await userEvent.keyboard(" ")
    await expect(checkbox).not.toBeChecked()
    await userEvent.keyboard(" ")
    await expect(checkbox).toBeChecked()
    checkbox.blur()
  },
}

export const Indeterminate: Story = {
  args: { label: "Alle facturen selecteren", defaultChecked: "indeterminate" },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Alle facturen selecteren",
    })
    await expect(checkbox).toHaveAttribute("aria-checked", "mixed")
    await expect(checkbox).toHaveAttribute("data-state", "indeterminate")
  },
}

export const Focus: Story = {
  args: { label: "Herinnering sturen" },
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(
      canvas.getByRole("checkbox", { name: "Herinnering sturen" })
    ).toHaveFocus()
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex min-w-0 flex-col gap-2">
      <Checkbox {...args} label="Automatisch archiveren" disabled />
      <Checkbox {...args} label="Btw verlegd" defaultChecked disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    const archive = canvas.getByRole("checkbox", {
      name: "Automatisch archiveren",
    })
    await expect(archive).toBeDisabled()
    await userEvent.click(archive, { pointerEventsCheck: 0 })
    await expect(archive).not.toBeChecked()
    await expect(
      canvas.getByRole("checkbox", { name: "Btw verlegd" })
    ).toBeChecked()
  },
}

export const WithDescription: Story = {
  name: "With description",
  args: {
    label: "Automatisch herinneren",
    description: "Stuurt de klant 7 dagen na de vervaldatum een herinnering.",
    defaultChecked: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("checkbox", { name: "Automatisch herinneren" })
    ).toHaveAccessibleDescription(
      "Stuurt de klant 7 dagen na de vervaldatum een herinnering."
    )
  },
}

export const Group: Story = {
  render: (args) => (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <Label as="legend">Kolommen tonen</Label>
      <Checkbox {...args} label="Klant" defaultChecked />
      <Checkbox {...args} label="Bedrag" defaultChecked />
      <Checkbox {...args} label="Vervaldatum" />
      <Checkbox {...args} label="Status" />
    </fieldset>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Kolommen tonen" })
    await expect(group).toBeInTheDocument()
    const status = canvas.getByRole("checkbox", { name: "Status" })
    await userEvent.click(status)
    await expect(status).toBeChecked()
    await userEvent.click(canvas.getByText("Status"))
    await expect(status).not.toBeChecked()
    status.blur()
  },
}
