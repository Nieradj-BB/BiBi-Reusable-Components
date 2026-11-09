import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormActions,
  FormField,
  FormFieldGroup,
  FormFieldRow,
  FormError as FormLevelError,
  FormStack,
} from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

const deliveryOptions = ["E-mail", "Post", "Klantportaal"]

function DeliveryGroup() {
  const [selected, setSelected] = React.useState<string[]>([])

  return (
    <FormFieldGroup
      legend="Factuur versturen via"
      required
      help="Kies een of meer manieren."
      error={
        selected.length === 0
          ? "Kies minstens één manier om de factuur te versturen."
          : undefined
      }
    >
      {deliveryOptions.map((option) => (
        <Checkbox
          key={option}
          label={option}
          checked={selected.includes(option)}
          onCheckedChange={(checked) =>
            setSelected((current) =>
              checked === true
                ? [...current, option]
                : current.filter((item) => item !== option)
            )
          }
        />
      ))}
    </FormFieldGroup>
  )
}

export const GroupWithError: Story = {
  name: "Group with error",
  args: { label: "Factuur versturen via", children: <Input /> },
  render: () => <DeliveryGroup />,
  play: async ({ canvas }) => {
    // Checkbox groups have no aria-required: the legend says it in hidden text.
    const group = canvas.getByRole("group", {
      name: "Factuur versturen via (verplicht)",
    })
    await expect(group).toHaveAccessibleDescription(
      "Kies een of meer manieren. Kies minstens één manier om de factuur te versturen."
    )
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Kies minstens één manier om de factuur te versturen."
    )

    const post = canvas.getByRole("checkbox", { name: "Post" })
    await userEvent.click(post)
    await expect(post).toBeChecked()
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument()
    await expect(group).toHaveAccessibleDescription(
      "Kies een of meer manieren."
    )

    await userEvent.click(post)
    await expect(canvas.getByRole("alert")).toBeInTheDocument()
    post.blur()
  },
}

// Test only (hidden from the sidebar): a render function passes the group
// error and required on to a RadioGroup as aria-invalid and aria-required.
export const RadioGroupField: Story = {
  name: "Radio group field",
  tags: ["!dev", "!autodocs"],
  args: { label: "Betaaltermijn", children: <Input /> },
  render: () => (
    <FormFieldGroup
      legend="Betaaltermijn"
      required
      error="Kies een betaaltermijn."
    >
      {(group) => (
        <RadioGroup name="term" {...group}>
          <RadioGroupItem value="14" label="14 dagen" />
          <RadioGroupItem value="30" label="30 dagen" />
        </RadioGroup>
      )}
    </FormFieldGroup>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("group", { name: "Betaaltermijn" })
    ).toHaveAccessibleDescription("Kies een betaaltermijn.")
    const radioGroup = canvas.getByRole("radiogroup")
    await expect(radioGroup).toHaveAttribute("aria-invalid", "true")
    await expect(radioGroup).toHaveAttribute("aria-required", "true")
  },
}

export const FieldRow: Story = {
  name: "Field row",
  args: { label: "Voornaam", children: <Input /> },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FormStack>
      <FormFieldRow>
        <FormField label="Voornaam" required>
          <Input type="text" defaultValue="Sanne" autoComplete="given-name" />
        </FormField>
        <FormField label="Achternaam" required>
          <Input
            type="text"
            defaultValue="de Vries"
            autoComplete="family-name"
          />
        </FormField>
      </FormFieldRow>
      <FormField label="E-mailadres" required>
        <Input
          type="email"
          defaultValue="s.devries@hofstede.nl"
          autoComplete="email"
        />
      </FormField>
    </FormStack>
  ),
  play: async ({ canvas }) => {
    const first = canvas.getByRole("textbox", { name: "Voornaam" })
    const last = canvas.getByRole("textbox", { name: "Achternaam" })
    await expect(first).toBeRequired()
    await expect(last).toHaveValue("de Vries")
    // Side by side when there is room, in reading order.
    const firstBox = first.getBoundingClientRect()
    const lastBox = last.getBoundingClientRect()
    await expect(lastBox.left).toBeGreaterThan(firstBox.right)
    await expect(lastBox.top).toBe(firstBox.top)
  },
}

export const FormError: Story = {
  name: "Form error",
  args: { label: "Klantnaam", children: <Input /> },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FormStack asChild>
      <form
        noValidate
        aria-label="Klant toevoegen"
        onSubmit={(event) => event.preventDefault()}
      >
        <FormField label="Klantnaam" required>
          <Input name="client" type="text" defaultValue="Hofstede Advies" />
        </FormField>
        <FormField label="E-mailadres voor facturen" required>
          <Input
            name="email"
            type="email"
            defaultValue="facturen@hofstede.nl"
          />
        </FormField>
        <FormLevelError title="Klant niet opgeslagen">
          De server reageert niet. Je gegevens staan nog in het formulier;
          probeer het zo opnieuw.
        </FormLevelError>
        <FormActions>
          <Button variant="outline" type="button">
            Annuleren
          </Button>
          <Button type="submit">Klant toevoegen</Button>
        </FormActions>
      </form>
    </FormStack>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("alert")
    await expect(alert).toHaveTextContent("Klant niet opgeslagen")
    await expect(alert).toHaveTextContent(
      "De server reageert niet. Je gegevens staan nog in het formulier; probeer het zo opnieuw."
    )
    // Directly above the actions; the fields themselves stay valid.
    const actions = canvas
      .getByRole("button", { name: "Klant toevoegen" })
      .closest("[data-slot='form-actions']")
    await expect(alert.nextElementSibling).toBe(actions)
    await expect(
      canvas.getByRole("textbox", { name: "Klantnaam" })
    ).not.toHaveAttribute("aria-invalid")
  },
}
