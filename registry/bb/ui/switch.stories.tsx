import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Components/Inputs & forms/Switch",
  component: Switch,
  decorators: [
    (Story) => (
      // Muted help and state text need the card surface for contrast.
      <div className="w-full max-w-sm rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Off: Story = {
  args: { "aria-label": "E-mailmeldingen" },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "E-mailmeldingen" })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
    toggle.blur()
  },
}

export const On: Story = {
  args: { "aria-label": "E-mailmeldingen", defaultChecked: true },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "E-mailmeldingen" })
    await expect(toggle).toBeChecked()
    await expect(toggle).toHaveAttribute("data-state", "checked")
  },
}

export const Focus: Story = {
  args: { "aria-label": "E-mailmeldingen", defaultChecked: true },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "E-mailmeldingen" })
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(toggle).not.toBeChecked()
    await userEvent.keyboard(" ")
    await expect(toggle).toBeChecked()
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Switch {...args} aria-label="Automatisch archiveren" disabled />
      <Switch
        {...args}
        aria-label="Automatisch factureren"
        defaultChecked
        disabled
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const archive = canvas.getByRole("switch", {
      name: "Automatisch archiveren",
    })
    await expect(archive).toBeDisabled()
    await userEvent.click(archive, { pointerEventsCheck: 0 })
    await expect(archive).not.toBeChecked()
    await expect(
      canvas.getByRole("switch", { name: "Automatisch factureren" })
    ).toBeChecked()
  },
}

export const WithLabel: Story = {
  name: "With label",
  args: { label: "Automatisch opslaan", defaultChecked: true },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "Automatisch opslaan" })
    await expect(toggle).toBeChecked()
    await userEvent.click(canvas.getByText("Automatisch opslaan"))
    await expect(toggle).not.toBeChecked()
    await userEvent.click(canvas.getByText("Automatisch opslaan"))
    await expect(toggle).toBeChecked()
    toggle.blur()
  },
}

function VisibilitySwitch() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        aria-label="Zichtbaar voor de klant"
        checked={visible}
        onCheckedChange={setVisible}
      />
      <span aria-hidden="true" className="text-xs text-muted-foreground">
        {visible ? "Zichtbaar" : "Verborgen"}
      </span>
    </div>
  )
}

// For table cells: the state text is for sighted users only.
export const WithStateText: Story = {
  name: "With state text",
  render: () => <VisibilitySwitch />,
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Zichtbaar voor de klant",
    })
    await expect(toggle).toBeChecked()
    await expect(canvas.getByText("Zichtbaar")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
    await expect(canvas.getByText("Verborgen")).toBeInTheDocument()
    await userEvent.click(toggle)
    await expect(canvas.getByText("Zichtbaar")).toBeInTheDocument()
    toggle.blur()
  },
}

export const SettingRow: Story = {
  name: "Setting row",
  render: (args) => (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor="switch-setting">Wekelijkse samenvatting</Label>
        <p
          id="switch-setting-help"
          className="mt-1 text-xs text-muted-foreground"
        >
          Elke maandag een overzicht van openstaande facturen.
        </p>
      </div>
      <Switch
        {...args}
        id="switch-setting"
        aria-describedby="switch-setting-help"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Wekelijkse samenvatting",
    })
    await expect(toggle).toHaveAccessibleDescription(
      "Elke maandag een overzicht van openstaande facturen."
    )
    await userEvent.click(canvas.getByText("Wekelijkse samenvatting"))
    await expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
    toggle.blur()
  },
}
