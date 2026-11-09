import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const meta = {
  title: "Components/Inputs & forms/RadioGroup",
  component: RadioGroup,
  decorators: [
    (Story) => (
      // Muted description and error text need the card surface for contrast.
      <div className="w-full max-w-sm rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

// Radix moves focus a tick after keydown and selects while the arrow key is
// still down, so hold the key until the selection lands.
async function pressArrow(key: string, target: HTMLElement) {
  await userEvent.keyboard(`{${key}>}`)
  await waitFor(() => expect(target).toBeChecked())
  await userEvent.keyboard(`{/${key}}`)
}

export const Vertical: Story = {
  args: { name: "frequency", defaultValue: "maand" },
  render: (args) => (
    <fieldset className="min-w-0">
      <Label as="legend">Factuurfrequentie</Label>
      <RadioGroup {...args}>
        <RadioGroupItem value="week" label="Per week" />
        <RadioGroupItem value="maand" label="Per maand" />
        <RadioGroupItem value="kwartaal" label="Per kwartaal" />
        <RadioGroupItem value="jaar" label="Per jaar" disabled />
      </RadioGroup>
    </fieldset>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("group", { name: "Factuurfrequentie" })
    ).toBeInTheDocument()
    const month = canvas.getByRole("radio", { name: "Per maand" })
    const quarter = canvas.getByRole("radio", { name: "Per kwartaal" })
    const year = canvas.getByRole("radio", { name: "Per jaar" })
    await expect(month).toBeChecked()
    await expect(year).toBeDisabled()

    await userEvent.click(canvas.getByText("Per kwartaal"))
    await expect(quarter).toBeChecked()
    await expect(month).not.toBeChecked()

    await userEvent.click(year, { pointerEventsCheck: 0 })
    await expect(year).not.toBeChecked()

    await userEvent.click(month)
    await expect(month).toBeChecked()
    month.blur()
  },
}

export const Focus: Story = {
  args: { name: "term", defaultValue: "14" },
  render: (args) => (
    <fieldset className="min-w-0">
      <Label as="legend">Betaaltermijn</Label>
      <RadioGroup {...args}>
        <RadioGroupItem value="14" label="14 dagen" />
        <RadioGroupItem value="30" label="30 dagen" />
      </RadioGroup>
    </fieldset>
  ),
  play: async ({ canvas }) => {
    const fourteen = canvas.getByRole("radio", { name: "14 dagen" })
    const thirty = canvas.getByRole("radio", { name: "30 dagen" })

    // Tab lands on the checked option; arrow keys move and select.
    await userEvent.tab()
    await expect(fourteen).toHaveFocus()
    await pressArrow("ArrowDown", thirty)
    await expect(thirty).toHaveFocus()
    await expect(thirty).toBeChecked()
    await pressArrow("ArrowUp", fourteen)
    await expect(fourteen).toHaveFocus()
    await expect(fourteen).toBeChecked()
  },
}

export const WithDescriptions: Story = {
  name: "With descriptions",
  args: { name: "delivery", defaultValue: "email" },
  render: (args) => (
    <fieldset className="min-w-0">
      <Label as="legend">Verzendwijze</Label>
      <RadioGroup {...args}>
        <RadioGroupItem
          value="email"
          label="E-mail"
          description="Als pdf naar het factuuradres."
        />
        <RadioGroupItem
          value="post"
          label="Post"
          description="Binnen 3 werkdagen op het postadres."
        />
      </RadioGroup>
    </fieldset>
  ),
  play: async ({ canvas }) => {
    const email = canvas.getByRole("radio", { name: "E-mail" })
    await expect(email).toBeChecked()
    await expect(email).toHaveAccessibleDescription(
      "Als pdf naar het factuuradres."
    )
    await expect(
      canvas.getByRole("radio", { name: "Post" })
    ).toHaveAccessibleDescription("Binnen 3 werkdagen op het postadres.")
  },
}

export const Invalid: Story = {
  args: { name: "term-invalid", "aria-invalid": true },
  render: (args) => (
    <fieldset className="min-w-0" aria-describedby="radio-group-invalid-error">
      <Label as="legend">Betaaltermijn</Label>
      <RadioGroup {...args}>
        <RadioGroupItem value="14" label="14 dagen" />
        <RadioGroupItem value="30" label="30 dagen" />
      </RadioGroup>
      <p
        id="radio-group-invalid-error"
        role="alert"
        className="mt-2 text-sm text-destructive"
      >
        Kies een betaaltermijn.
      </p>
    </fieldset>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("group", { name: "Betaaltermijn" })
    ).toHaveAccessibleDescription("Kies een betaaltermijn.")
    await expect(canvas.getByRole("radiogroup")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
    for (const radio of canvas.getAllByRole("radio")) {
      await expect(radio).not.toBeChecked()
    }
  },
}

export const Horizontal: Story = {
  args: { name: "view", defaultValue: "lijst", orientation: "horizontal" },
  render: (args) => (
    <fieldset className="min-w-0">
      <Label as="legend">Weergave</Label>
      <RadioGroup {...args}>
        <RadioGroupItem value="lijst" label="Lijst" />
        <RadioGroupItem value="tegels" label="Tegels" />
        <RadioGroupItem value="kalender" label="Kalender" />
      </RadioGroup>
    </fieldset>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup")
    await expect(group).toHaveAttribute("aria-orientation", "horizontal")
    const list = canvas.getByRole("radio", { name: "Lijst" })
    const tiles = canvas.getByRole("radio", { name: "Tegels" })
    await userEvent.tab()
    await expect(list).toHaveFocus()
    await pressArrow("ArrowRight", tiles)
    await expect(tiles).toHaveFocus()
    await expect(tiles).toBeChecked()
    await pressArrow("ArrowLeft", list)
    await expect(list).toBeChecked()
    list.blur()
  },
}
