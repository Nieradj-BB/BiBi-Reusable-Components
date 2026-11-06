import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"
import { FormActions, FormField, FormStack } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Inputs & forms/FormField",
  component: FormField,
  decorators: [
    (Story) => (
      // Error and help text need the card surface for contrast.
      <div className="w-full max-w-md rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: {
    label: "Projectnaam",
    required: true,
    help: "Zoals de klant het project noemt.",
    children: <Input id="form-field-anatomy" type="text" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Projectnaam" })
    await expect(input).toHaveAttribute("id", "form-field-anatomy")
    await expect(input).toBeRequired()
    await expect(input).toHaveAccessibleDescription(
      "Zoals de klant het project noemt."
    )
    await expect(input).not.toHaveAttribute("aria-invalid")
    await userEvent.type(input, "Renovatie hoofdkantoor")
    await expect(input).toHaveValue("Renovatie hoofdkantoor")
  },
}

export const Error: Story = {
  args: {
    label: "E-mailadres",
    required: true,
    help: "Hier sturen we de factuur naartoe.",
    error: "Vul een volledig e-mailadres in, zoals naam@bedrijf.nl.",
    children: <Input type="email" defaultValue="s.bakker@" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "E-mailadres" })
    await expect(input).toBeInvalid()
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(input).toHaveAccessibleDescription(
      "Hier sturen we de factuur naartoe. Vul een volledig e-mailadres in, zoals naam@bedrijf.nl."
    )
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Vul een volledig e-mailadres in, zoals naam@bedrijf.nl."
    )
  },
}

export const OptionalHint: Story = {
  name: "Optional hint",
  args: {
    label: "Inkoopordernummer",
    optional: true,
    help: "Komt op de factuur als de klant erom vraagt.",
    children: <Input type="text" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: "Inkoopordernummer (optioneel)",
    })
    await expect(input).not.toBeRequired()
    await expect(input).toHaveAccessibleDescription(
      "Komt op de factuur als de klant erom vraagt."
    )
  },
}

export const Disabled: Story = {
  args: {
    label: "Klantnummer",
    help: "Wordt automatisch toegekend.",
    children: <Input type="text" defaultValue="K-10482" disabled />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Klantnummer" })
    await expect(input).toBeDisabled()
    await expect(input).toHaveAccessibleDescription(
      "Wordt automatisch toegekend."
    )
  },
}

type ClientErrors = { client?: string; email?: string }

function validateClient(form: HTMLFormElement): ClientErrors {
  const data = new FormData(form)
  const client = String(data.get("client") ?? "").trim()
  const email = String(data.get("email") ?? "").trim()
  const errors: ClientErrors = {}
  if (!client) errors.client = "Vul de naam van de klant in."
  if (!email) {
    errors.email = "Vul een e-mailadres in."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Vul een volledig e-mailadres in, zoals naam@bedrijf.nl."
  }
  return errors
}

function ClientForm() {
  const [errors, setErrors] = React.useState<ClientErrors>({})
  const [saved, setSaved] = React.useState(false)

  return (
    <FormStack asChild>
      <form
        noValidate
        aria-label="Klant toevoegen"
        onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const nextErrors = validateClient(form)
          setErrors(nextErrors)
          setSaved(Object.keys(nextErrors).length === 0)
          const firstInvalid = (["client", "email"] as const).find(
            (name) => nextErrors[name]
          )
          if (firstInvalid) {
            form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
          }
        }}
        onReset={() => {
          setErrors({})
          setSaved(false)
        }}
      >
        <FormField label="Klantnaam" required error={errors.client}>
          <Input name="client" type="text" />
        </FormField>
        <FormField
          label="E-mailadres voor facturen"
          required
          help="Hier sturen we elke factuur naartoe."
          error={errors.email}
        >
          <Input name="email" type="email" />
        </FormField>
        <FormField label="Opmerking" optional>
          <Textarea name="note" rows={3} />
        </FormField>
        <FormActions>
          <Button variant="outline" type="reset">
            Annuleren
          </Button>
          <Button type="submit">Klant toevoegen</Button>
        </FormActions>
        <p role="status" className="sr-only">
          {saved ? "Klant toegevoegd." : ""}
        </p>
      </form>
    </FormStack>
  )
}

export const Form: Story = {
  args: { label: "Klantnaam", children: <Input /> },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  render: () => <ClientForm />,
  play: async ({ canvas }) => {
    const client = canvas.getByRole("textbox", { name: "Klantnaam" })
    const email = canvas.getByRole("textbox", {
      name: "E-mailadres voor facturen",
    })

    await userEvent.click(email)
    await userEvent.keyboard("{Enter}")
    await expect(client).toHaveFocus()
    await expect(client).toBeInvalid()
    await expect(email).toHaveAccessibleDescription(
      "Hier sturen we elke factuur naartoe. Vul een e-mailadres in."
    )

    await userEvent.type(client, "Van Dijk Bouw")
    await userEvent.type(email, "factuur@vandijkbouw")
    await userEvent.click(
      canvas.getByRole("button", { name: "Klant toevoegen" })
    )
    await expect(email).toHaveFocus()
    await expect(client).not.toHaveAttribute("aria-invalid")

    await userEvent.type(email, ".nl")
    await userEvent.click(
      canvas.getByRole("button", { name: "Klant toevoegen" })
    )
    await expect(canvas.queryAllByRole("alert")).toHaveLength(0)
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Klant toegevoegd."
    )

    await userEvent.click(canvas.getByRole("button", { name: "Annuleren" }))
    await expect(client).toHaveValue("")
    await expect(email).toHaveValue("")
    await expect(canvas.getByRole("status")).toHaveTextContent("")
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

// Test only (hidden from the sidebar): a render function gets
// aria-required, which is valid on the Select trigger, instead of required.
export const RequiredSelect: Story = {
  name: "Required select",
  tags: ["!dev", "!autodocs"],
  args: {
    label: "Status",
    required: true,
    children: (control) => (
      <Select name="status" required>
        <SelectTrigger {...control}>
          <SelectValue placeholder="Kies een status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Afgerond</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Status" })
    await expect(trigger).toHaveAttribute("aria-required", "true")
    await expect(trigger).not.toHaveAttribute("required")
  },
}
