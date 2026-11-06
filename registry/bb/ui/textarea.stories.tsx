import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Inputs & forms/Textarea",
  component: Textarea,
  decorators: [
    (Story) => (
      // Muted and red text need the card surface for contrast.
      <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: "textarea-default",
    defaultValue:
      "Levering en montage van de nieuwe werkplekken op de tweede verdieping.",
  },
  render: (args) => (
    <>
      <Label htmlFor="textarea-default" className="mb-1">
        Omschrijving
      </Label>
      <Textarea {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Omschrijving")
    await expect(textarea).toHaveAttribute("rows", "3")
    await expect(textarea).toHaveAttribute("dir", "auto")
  },
}

export const Focus: Story = {
  args: { id: "textarea-focus", placeholder: "Wat moet het team weten?" },
  render: (args) => (
    <>
      <Label htmlFor="textarea-focus" className="mb-1">
        Notitie voor het team
      </Label>
      <Textarea {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByLabelText("Notitie voor het team")).toHaveFocus()
  },
}

export const CharacterCount: Story = {
  name: "Character count",
  args: {
    id: "textarea-count",
    limit: 500,
    help: "Hooguit 500 tekens.",
    defaultValue: "Inclusief de extra uren voor de oplevering in week 12.",
  },
  render: (args) => (
    <>
      <Label htmlFor="textarea-count" className="mb-1">
        Toelichting op de factuur
      </Label>
      <Textarea {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Toelichting op de factuur")
    await expect(textarea).toHaveAccessibleDescription("Hooguit 500 tekens.")
    await expect(canvas.getByText("54 / 500")).toBeInTheDocument()
    await userEvent.type(textarea, " Graag")
    await expect(canvas.getByText("60 / 500")).toBeInTheDocument()
    await expect(textarea).not.toBeInvalid()
    await userEvent.keyboard("{Backspace>6/}")
    await expect(canvas.getByText("54 / 500")).toBeInTheDocument()
    textarea.blur()
  },
}

export const Invalid: Story = {
  args: {
    id: "textarea-invalid",
    limit: 60,
    help: "Hooguit 60 tekens.",
    "aria-invalid": true,
    "aria-describedby": "textarea-invalid-error",
    defaultValue:
      "Inclusief de extra uren voor de oplevering in week 12 en de reiskosten.",
  },
  render: (args) => (
    <>
      <Label htmlFor="textarea-invalid" className="mb-1">
        Toelichting op de factuur
      </Label>
      <Textarea {...args} />
      <p
        id="textarea-invalid-error"
        role="alert"
        className="text-sm text-destructive"
      >
        Schrijf hooguit 60 tekens.
      </p>
    </>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Toelichting op de factuur")
    await expect(textarea).toBeInvalid()
    await expect(textarea).toHaveAccessibleDescription(
      "Hooguit 60 tekens. Schrijf hooguit 60 tekens."
    )
    await expect(canvas.getByText("71 / 60")).toHaveClass("text-destructive")
    await expect(canvas.getByText("11 tekens te veel")).toHaveAttribute(
      "aria-live",
      "polite"
    )
    await expect(textarea).toHaveValue(
      "Inclusief de extra uren voor de oplevering in week 12 en de reiskosten."
    )
  },
}

export const Disabled: Story = {
  args: {
    id: "textarea-disabled",
    disabled: true,
    defaultValue: "Factuur is goedgekeurd door de projectleider.",
  },
  render: (args) => (
    <>
      <Label htmlFor="textarea-disabled" className="mb-1">
        Interne notitie
      </Label>
      <Textarea {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Interne notitie")).toBeDisabled()
  },
}

// Test only (hidden from the sidebar): DOM writes without an input event
// (a ref-based form library, a native form reset) keep the counter in sync.
export const CountAfterReset: Story = {
  name: "Count after reset",
  tags: ["!dev", "!autodocs"],
  args: { id: "textarea-reset", limit: 20 },
  render: (args) => (
    <form className="flex flex-col gap-1">
      <Label htmlFor="textarea-reset" className="mb-1">
        Korte notitie
      </Label>
      <Textarea
        {...args}
        ref={(node) => {
          if (node && !node.dataset.filled) {
            node.dataset.filled = "true"
            node.value = "Bel de klant"
          }
        }}
      />
      <Button type="reset" variant="outline" className="self-start">
        Wissen
      </Button>
    </form>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Korte notitie")
    await expect(canvas.getByText("12 / 20")).toBeInTheDocument()
    await userEvent.type(textarea, " over de offerte")
    await expect(canvas.getByText("28 / 20")).toBeInTheDocument()
    await expect(textarea).toBeInvalid()
    await userEvent.click(canvas.getByRole("button", { name: "Wissen" }))
    await waitFor(() => expect(canvas.getByText("0 / 20")).toBeInTheDocument())
    await expect(textarea).not.toBeInvalid()
  },
}
